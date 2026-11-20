import { expect, test } from "@playwright/test";

test("desktop hero enters in ordered visible phases like the observed reference", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const phase = (locator: ReturnType<typeof page.locator>) => locator.evaluate(e => {
    const a = e.getAnimations().find(x => x.effect instanceof KeyframeEffect);
    if (!a || !(a.effect instanceof KeyframeEffect)) return null;
    const f = a.effect.getKeyframes()[0];
    return { name: (a as CSSAnimation).animationName, duration: a.effect.getTiming().duration, delay: a.effect.getTiming().delay, opacity: Number(f.opacity), translate: f.translate };
  });
  const copy = await phase(page.locator(".hero-copy"));
  const visual = await phase(page.locator(".hero-visual"));
  expect(copy).toMatchObject({ name:"hero-copy-in",duration:1000,opacity:1,translate:"-64px" });
  expect(visual).toMatchObject({ name:"hero-visual-in",duration:1000,delay:300,opacity:0.12,translate:"64px" });
  await expect(page.locator(".hero-copy h1")).toContainText("Châu Anh");
  await expect.poll(()=>page.locator(".hero-copy").getAttribute("data-motion-state")).toBe("done");
  await expect.poll(()=>page.locator(".hero-visual").getAttribute("data-motion-state")).toBe("done");
});

test("a desktop card row enters visibly once with the reference's 120ms stagger", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cards=page.locator("#projects .project-card");
  await expect(cards.first()).toHaveAttribute("data-motion-state","pending");
  const details=await cards.evaluateAll(async row=>{
    window.scrollTo({top:row[0].getBoundingClientRect().top+scrollY-180,behavior:"instant"});
    const until=performance.now()+1400;
    while(performance.now()<until){
      const anim=row.map(e=>e.getAnimations().find(a=>a.effect instanceof KeyframeEffect));
      if(anim.every(Boolean))return anim.map(a=>{const k=(a!.effect as KeyframeEffect).getKeyframes()[0];const t=a!.effect!.getTiming();return {duration:t.duration,delay:t.delay,opacity:Number(k.opacity),translate:k.translate};});
      await new Promise(requestAnimationFrame);
    }
    return [];
  });
  expect(details).toHaveLength(3);
  for (const x of details) expect(x).toMatchObject({duration:700,opacity:1,translate:"0px 48px"});
  expect(details.map(x=>x.delay)).toEqual([0,120,240]);
  await cards.last().scrollIntoViewIfNeeded();
  await expect(cards.first()).toHaveAttribute("data-motion-state","done");
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
  await page.locator(".project-card").first().scrollIntoViewIfNeeded();
  expect(await cards.first().evaluate(e=>e.getAnimations().length)).toBe(0);
});

test("the last stacked Vietnamese hero visual animates once only when actually entering view", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/vi/");
  await expect(page.locator(".hero-copy")).toHaveAttribute("data-motion-state","done");
  const visual=page.locator(".hero-visual");
  await expect(visual).toHaveAttribute("data-motion-state","pending");
  const before=await visual.evaluate(e=>({top:e.getBoundingClientRect().top,h:innerHeight}));
  expect(before.top).toBeGreaterThan(before.h * 0.8);
  await visual.scrollIntoViewIfNeeded();
  await expect(visual).toHaveAttribute("data-motion-state","entering");
  await expect.poll(()=>visual.getAttribute("data-motion-state"),{timeout:2500}).toBe("done");
});

test("the typewriter starts as the bilingual copy is still arriving and settles between phrases", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  const label=page.locator('.type-line > span[aria-hidden="true"]').last();
  await expect.poll(async()=> (await label.textContent())?.length,{timeout:1200}).toBeLessThan(19);
  await expect(label).toHaveText("Cybersecurity Student");
  await expect.poll(async()=>page.locator(".hero-copy").getAttribute("data-motion-state"),{timeout:2500}).toBe("done");
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(label).toHaveText("Cybersecurity Student");
  await expect(page.locator(".orbit").first()).toHaveCSS("animation-name","none");
});

// Research frame-by-frame DOM invariants live in research-invariant.spec.ts.
// No DOM clones, synthetic opacity curves, or time-derived identities are evidence.

test("reduced motion becoming active during a tab exit ends on the latest category", async ({ page }) => {
  await page.goto("/research/");
  await page.getByRole("tab",{name:/Exploits/}).click();
  await page.waitForTimeout(50);
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id","panel-exploits");
  await expect(page.getByRole("tabpanel")).toHaveCSS("opacity","1");
});

test("CSS tabs work independently of a throwing native View Transition API", async ({ page }) => {
  await page.addInitScript(()=>Object.defineProperty(document,"startViewTransition",{value:()=>{throw Error("unsupported");},configurable:true}));
  await page.goto("/research/");
  await page.getByRole("tab",{name:/Exploits/}).click();
  await expect.poll(async()=>page.evaluate(()=>document.querySelector("#panel-exploits")!==null)).toBe(true);
  await expect(page.getByRole("tabpanel")).toHaveCSS("opacity","1");
});

test("Escape restores focus to the drawer opener instead of overwriting it in cleanup", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/vi/");
  await page.locator(".language-switch").focus();
  const toggle=page.locator(".menu-toggle");
  await toggle.evaluate((e:HTMLButtonElement)=>e.click());
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("drawer exit remains present until its real CSS animation has completed", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await page.locator(".menu-toggle").click();
  await page.waitForTimeout(350);
  const sample = await page.evaluate(async () => {
    document.querySelector<HTMLButtonElement>(".drawer-heading button")!.click();
    await new Promise(resolve => setTimeout(resolve, 230));
    const surface = document.querySelector<HTMLElement>(".mobile-overlay");
    const drawer = surface?.querySelector<HTMLElement>(".mobile-drawer");
    return {present:!!surface, inert:!!surface?.inert, opacity:drawer?Number(getComputedStyle(drawer).opacity):null};
  });
  expect(sample.present).toBe(true);
  expect(sample.inert).toBe(true);
  expect(sample.opacity).toBeLessThan(1);
  await expect(page.locator(".mobile-overlay")).toHaveCount(0);
});

test("typing changes move the caret without generating LayoutShift entries", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { shifts: {at:number; value:number; sources:string[]}[] }).shifts=[];
    new PerformanceObserver(list => {
      for (const raw of list.getEntries()) {
        const e=raw as PerformanceEntry & {value:number;sources:{node:HTMLElement}[]};
        (window as unknown as { shifts: {at:number; value:number; sources:string[]}[] }).shifts.push({at:e.startTime,value:e.value,sources:e.sources.map(s=>s.node?.className)});
      }
    }).observe({type:"layout-shift",buffered:true});
  });
  await page.goto("/");
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator(".hero-copy")).toHaveAttribute("data-motion-state","done");
  const start=await page.evaluate(()=>performance.now());
  const typed=page.locator(".type-text");
  const before=await typed.textContent();
  await expect.poll(()=>typed.textContent(),{timeout:6000}).not.toBe(before);
  await page.waitForTimeout(1200);
  const caretShifts=await page.evaluate(start=>(window as unknown as {shifts:{at:number;value:number;sources:string[]}[]}).shifts.filter(s=>s.at>start&&s.sources.some(c=>c?.includes("type-cursor"))),start);
  expect(caretShifts).toEqual([]);
});
