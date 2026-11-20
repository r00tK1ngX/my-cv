import {test,expect} from '@playwright/test';

for(const locale of ['en','vi'] as const){
 test(`${locale}: changing intent during exit cannot extend a fully transparent stale panel`,async({page})=>{
  await page.goto(locale==='en'?'/research/':'/vi/research/');
  await expect(page.locator('.research-tabs')).toHaveAttribute('data-motion-state','done');
  const data=await page.evaluate(async()=>{
   const frames:{at:number;phase:string;o:number;selected:string;text:string}[]=[];let running=true;
   const frame=()=>{const p=document.querySelector<HTMLElement>('[role=tabpanel]')!;frames.push({at:performance.now(),phase:p.dataset.motionPhase||'',o:+getComputedStyle(p).opacity,selected:document.querySelector('[aria-selected=true]')!.id,text:p.querySelector('h2')!.textContent!});if(running)requestAnimationFrame(frame)};
   frame();const click=(key:string)=>document.querySelector<HTMLButtonElement>('#tab-'+key)!.click();
   click('exploits');await new Promise(r=>setTimeout(r,115));click('bounties');
   await new Promise(r=>setTimeout(r,80));click('exploits');
   await new Promise(r=>setTimeout(r,80));click('bounties');
   await new Promise(r=>setTimeout(r,650));running=false;
   return{frames,final:document.querySelector('[role=tabpanel] h2')!.textContent,selected:document.querySelector('[aria-selected=true]')!.id};
  });
  const zeros=data.frames.filter(f=>f.phase==='exit'&&f.o<0.001);
  const longest=zeros.reduce((m,f,i)=>Math.max(m,i?f.at-zeros[i-1].at<50?f.at-zeros[0].at:0:0),0);
  expect(longest).toBeLessThan(50);
  expect(data.selected).toBe('tab-bounties');
  expect(data.final).toBe(locale==='en'?'No published bug bounty entries yet':'Chưa có báo cáo bug bounty được công bố');
 });

 test(`${locale}: all tab control targets reference an existing shared panel`,async({page})=>{
  await page.goto(locale==='en'?'/research/':'/vi/research/');
  const missing=await page.getByRole('tab').evaluateAll(tabs=>tabs.filter(t=>!document.getElementById(t.getAttribute('aria-controls')||'')).map(t=>t.id));
  expect(missing).toEqual([]);
 });

 test(`${locale}: Tab follows the focused request before commit`,async({page})=>{
  await page.goto(locale==='en'?'/research/':'/vi/research/');
  await page.locator('#tab-bounties').click();await expect(page.getByRole('tabpanel')).toHaveAttribute('data-motion-phase','idle');
  await page.locator('#tab-bounties').focus();await page.keyboard.press('Home');await page.keyboard.press('Tab');
  await expect(page.getByRole('tabpanel')).toBeFocused();
 });

 test(`${locale}: return click in the commit task overrides a queued category update`,async({page})=>{
  await page.addInitScript(()=>{
   const native=window.setTimeout.bind(window);
   window.setTimeout=((callback:TimerHandler,delay?:number,...args:unknown[])=>native(()=>{
    if(typeof callback==='function')callback(...args);
    const w=window as unknown as {raceArmed:boolean};
    if(delay===150&&w.raceArmed){w.raceArmed=false;document.querySelector<HTMLButtonElement>('#tab-cves')!.click();}
   },delay)) as typeof window.setTimeout;
  });
  await page.goto(locale==='en'?'/research/':'/vi/research/');
  await page.evaluate(()=>{(window as unknown as {raceArmed:boolean}).raceArmed=true;document.querySelector<HTMLButtonElement>('#tab-exploits')!.click()});
  await page.waitForTimeout(650);
  await expect(page.locator('#tab-cves')).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('tabpanel')).toHaveAttribute('id','panel-cves');
 });
}

test('canvas bitmap follows its element size without a window resize',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const c=page.locator('.particle-canvas');
 const before=await c.evaluate(e=>({width:(e as HTMLCanvasElement).width,height:(e as HTMLCanvasElement).height}));
 await page.locator('.hero').evaluate(e=>{(e as HTMLElement).style.minHeight='0';(e as HTMLElement).style.height='1250px'});
 await expect.poll(()=>c.evaluate(e=>({actual:(e as HTMLCanvasElement).height,expected:e.clientHeight*Math.min(devicePixelRatio,2)}))).toEqual({actual:1250,expected:1250});
 expect(before.height).not.toBe(1250);
});

test('a delayed Escape focus callback cannot move focus outside a reopened drawer',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.addInitScript(()=>{
  const original=window.requestAnimationFrame.bind(window);
  const w=window as unknown as {holdFocus:boolean;held:FrameRequestCallback[]};w.held=[];
  window.requestAnimationFrame=callback=>{
   if(w.holdFocus&&callback.toString().includes('focus')){w.held.push(callback);return 987654;}
   return original(callback);
  };
 });
 await page.goto('/');await page.locator('.menu-toggle').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.evaluate(()=>{(window as unknown as {holdFocus:boolean}).holdFocus=true});
 await page.keyboard.press('Escape');
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {held:unknown[]}).held.length)).toBeGreaterThan(0);
 await page.locator('.menu-toggle').evaluate((e:HTMLButtonElement)=>e.click());
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.evaluate(()=>{const w=window as unknown as {holdFocus:boolean;held:FrameRequestCallback[]};w.holdFocus=false;w.held.splice(0).forEach(f=>f(performance.now()))});
 expect(await page.getByRole('dialog').evaluate(e=>e.contains(document.activeElement))).toBe(true);
});
