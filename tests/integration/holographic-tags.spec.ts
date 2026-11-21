import { test, expect, type Page } from "@playwright/test";

const openHome = async (page: Page, locale: string) => {
  await page.goto(locale === "en" ? "/" : "/vi/");
  await page.bringToFront();
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
};
const colors = ["rgb(34, 211, 238)", "rgb(244, 114, 182)", "rgb(74, 222, 128)", "rgb(251, 191, 36)"];
const labels = ["PWN / BINARY", "RED TEAM", "LINUX", "AI & SECURITY"];

for (const locale of ["en", "vi"] as const) {
  for (const [device, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
    test(`Orbital nodes: ${locale} ${device} retain identity in quiet glass capsules`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: device === "mobile", isMobile: device === "mobile", reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
      try {
        await openHome(page, locale);
        const data = await page.locator(".float-tag").evaluateAll(elements => elements.map(e => {
          const capsule = e.querySelector(".node-capsule")!;
          const s = getComputedStyle(capsule), link = e.querySelector(".node-link")!;
          const indicator = e.querySelector(".node-status")!;
          const r = capsule.getBoundingClientRect();
          return {
            text: e.textContent, color: s.color, pointer: s.pointerEvents,
            backdrop: s.backdropFilter, shadow: s.boxShadow, font: s.fontSize, radius: s.borderRadius,
            float: { name: s.animationName, duration: s.animationDuration, delay: s.animationDelay },
            legacyDecoration: [getComputedStyle(e, "::before").content, getComputedStyle(e, "::after").content],
            link: { display: getComputedStyle(link).display, animation: getComputedStyle(link).animationName, hidden: link.getAttribute("aria-hidden"), focusable: link.getAttribute("focusable"), pointer: getComputedStyle(link).pointerEvents },
            indicator: { hidden: indicator.getAttribute("aria-hidden"), background: getComputedStyle(indicator).backgroundColor },
            icon: { hidden: e.querySelector(".node-icon")!.getAttribute("aria-hidden"), width: e.querySelector(".node-icon")!.getBoundingClientRect().width },
            focusable: e.matches("a,button,[tabindex],[role=button]") || !!e.querySelector("a,button,[tabindex],[role=button]"),
            clippedText: capsule.scrollWidth > capsule.clientWidth + 1,
            hit: !!document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest(".float-tag"),
          };
        }));
        expect(data.map(d => d.text)).toEqual(labels); expect(data.map(d => d.color)).toEqual(colors);
        expect(data.map(d => d.float.delay)).toEqual(["0s", "-2.5s", "-5s", "-7.5s"]);
        for (const row of data) {
          expect(row.pointer).toBe("none"); expect(row.link.pointer).toBe("none");
          expect(row.backdrop).toBe("blur(3px)"); expect(row.shadow).not.toBe("none"); expect(row.font).toBe("10px"); expect(row.radius).toBe("999px");
          expect(row.float.name).toBe("orbital-node-float"); expect(row.float.duration).toBe("10s");
          expect(row.legacyDecoration).toEqual(["none", "none"]); expect(row.link.animation).toBe("none");
          expect(row.link.display).toBe(device === "desktop" ? "block" : "none");
          expect(row.link.hidden).toBe("true"); expect(row.link.focusable).toBe("false");
          expect(row.icon.hidden).toBe("true"); expect(row.icon.width).toBe(13);
          expect(row.indicator.hidden).toBe("true"); expect(row.indicator.background).toBe(row.color);
          expect(row.focusable).toBe(false); expect(row.clippedText).toBe(false); expect(row.hit).toBe(false);
        }
        expect(errors).toEqual([]);
      } finally { await context.close(); }
    });
  }

  test(`Orbital nodes: ${locale} reduced motion stays static at load and live changes`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const snapshot = () => page.locator(".node-capsule").evaluateAll(elements => elements.map(e => ({ transform: getComputedStyle(e).transform, float: getComputedStyle(e).animationName })));
    try {
      await openHome(page, locale);
      const initial = await snapshot();
      expect(initial).toHaveLength(4); expect(initial.every(d => d.float === "none" && d.transform === "none")).toBe(true);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "orbital-node-float")).toBe(true);
      const moving = await snapshot(); await page.waitForTimeout(200);
      expect((await snapshot()).some((d, i) => d.transform !== moving[i].transform)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "none")).toBe(true);
      const still = await snapshot(); await page.waitForTimeout(160); expect(await snapshot()).toEqual(still);
    } finally { await context.close(); }
  });
}

test("Orbital nodes: quiet regional hover does not capture pointer or alter the cursor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openHome(page, "en");
  await page.mouse.move(600, 200); await page.waitForTimeout(350);
  const before = await page.locator(".node-capsule").first().evaluate(e => ({ border: getComputedStyle(e).borderTopColor, shadow: getComputedStyle(e).boxShadow }));
  const target = await page.locator(".node-capsule").first().boundingBox();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2);
  await page.waitForTimeout(450);
  const after = await page.locator(".node-capsule").first().evaluate(e => ({ border: getComputedStyle(e).borderTopColor, shadow: getComputedStyle(e).boxShadow, translate: getComputedStyle(e).translate, hit: !!document.elementFromPoint(e.getBoundingClientRect().x + e.clientWidth / 2, e.getBoundingClientRect().y + e.clientHeight / 2)?.closest(".float-tag") }));
  expect(after.border).not.toBe(before.border); expect(after.shadow).not.toBe(before.shadow); expect(after.translate).toBe("none");
  expect(after.hit).toBe(false);
  // The unchanged cursor treats the entire Hero visual as its image region.
  await expect(page.locator(".cyber-cursor")).toHaveAttribute("data-state", "image");
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.waitForTimeout(40);
  expect(await page.locator(".node-capsule").first().evaluate(e => getComputedStyle(e).transform)).toBe("none");
});

test("Orbital nodes: CSS-only float stays live while connector geometry remains static", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: "no-preference" });
  const page = await context.newPage();
  try {
    await page.goto("/"); await page.bringToFront(); await page.waitForTimeout(1500);
    const snapshot = () => page.locator(".hero-visual").evaluate(root => root.getAnimations({ subtree: true }).filter(a => (a as CSSAnimation).animationName === "orbital-node-float").map(a => ({ name: (a as CSSAnimation).animationName, state: a.playState, time: a.currentTime })));
    const connectors = () => page.locator(".node-link").evaluateAll(elements => elements.map(e => ({ box: e.getBoundingClientRect().toJSON(), markup: e.innerHTML, animation: getComputedStyle(e).animationName })));
    const before = await snapshot(); expect(before).toHaveLength(4); expect(before.every(a => a.state === "running")).toBe(true);
    const staticLinks = await connectors();
    const session = await context.newCDPSession(page); await session.send("Performance.enable");
    const layouts = async () => (await session.send("Performance.getMetrics")).metrics.find(m => m.name === "LayoutCount")!.value;
    const first = await layouts(); await page.waitForTimeout(600); const delta = (await layouts()) - first;
    const after = await snapshot(); expect(after).toHaveLength(4);
    expect(after.every((a, i) => a.state === "running" && Number(a.time) > Number(before[i].time))).toBe(true);
    expect(await connectors()).toEqual(staticLinks);
    expect(staticLinks.every(link => link.animation === "none")).toBe(true);
    expect(delta).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});
