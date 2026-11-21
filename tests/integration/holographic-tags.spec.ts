import { test, expect, type Page } from "@playwright/test";

const openHome = async (page: Page, locale: string) => {
  await page.goto(locale === "en" ? "/" : "/vi/");
  await page.bringToFront();
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
};
const colors = ["rgb(34, 211, 238)", "rgb(244, 114, 182)", "rgb(74, 222, 128)", "rgb(251, 191, 36)"];
const labels = ["◆ PWN / BINARY", "◆ RED TEAM", "◆ LINUX", "◆ AI & SECURITY"];

for (const locale of ["en", "vi"] as const) {
  for (const [device, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
    test(`Holographic tags: ${locale} ${device} retain identities and decorative surfaces`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: device === "mobile", isMobile: device === "mobile", reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
      try {
        await openHome(page, locale);
        const data = await page.locator(".float-tag").evaluateAll(elements => elements.map(e => {
          const s = getComputedStyle(e), before = getComputedStyle(e, "::before"), after = getComputedStyle(e, "::after");
          const indicator = e.querySelector(".tag-indicator")!;
          const r = e.getBoundingClientRect();
          return {
            text: e.textContent, color: s.color, pointer: s.pointerEvents,
            backdrop: s.backdropFilter, shadow: s.boxShadow, font: s.fontSize,
            float: { name: s.animationName, duration: s.animationDuration, delay: s.animationDelay },
            sweep: { name: after.animationName, duration: after.animationDuration, pointer: after.pointerEvents },
            corners: before.content, cornerPointer: before.pointerEvents,
            indicator: { hidden: indicator.getAttribute("aria-hidden"), background: getComputedStyle(indicator).backgroundColor },
            focusable: e.matches("a,button,[tabindex],[role=button]"),
            clippedText: e.scrollWidth > e.clientWidth + 1,
            hit: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest(".float-tag") !== null,
          };
        }));
        expect(data.map(d => d.text)).toEqual(labels); expect(data.map(d => d.color)).toEqual(colors);
        expect(data.map(d => d.float.delay)).toEqual(["0s", "-2s", "-4s", "-6s"]);
        for (const row of data) {
          expect(row.pointer).toBe("none"); expect(row.cornerPointer).toBe("none"); expect(row.sweep.pointer).toBe("none");
          expect(row.backdrop).toBe("blur(4px)"); expect(row.shadow).not.toBe("none"); expect(row.font).toBe("9px");
          expect(row.float.name).toBe("hologram-float"); expect(row.float.duration).toBe("8s");
          expect(row.sweep.name).toBe("hologram-sweep"); expect(row.sweep.duration).toBe("12s");
          expect(row.corners).toBe('""'); expect(row.indicator.hidden).toBe("true"); expect(row.indicator.background).toBe(row.color);
          expect(row.focusable).toBe(false); expect(row.clippedText).toBe(false); expect(row.hit).toBe(false);
        }
        expect(errors).toEqual([]);
      } finally { await context.close(); }
    });
  }

  test(`Holographic tags: ${locale} reduced motion stops float and sweep at load and live changes`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const snapshot = () => page.locator(".float-tag").evaluateAll(elements => elements.map(e => ({ transform: getComputedStyle(e).transform, translate: getComputedStyle(e).translate, float: getComputedStyle(e).animationName, sweep: getComputedStyle(e, "::after").animationName })));
    try {
      await openHome(page, locale);
      const initial = await snapshot();
      expect(initial).toHaveLength(4); expect(initial.every(d => d.float === "none" && d.sweep === "none")).toBe(true);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "hologram-float" && d.sweep === "hologram-sweep")).toBe(true);
      const moving = await snapshot(); await page.waitForTimeout(200);
      expect((await snapshot()).some((d, i) => d.transform !== moving[i].transform)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "none" && d.sweep === "none")).toBe(true);
      const still = await snapshot(); await page.waitForTimeout(160); expect(await snapshot()).toEqual(still);
    } finally { await context.close(); }
  });
}

test("Holographic tags: regional hover is subtle without capturing pointer or changing cursor state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openHome(page, "en");
  await page.mouse.move(600, 200); await page.waitForTimeout(350);
  const before = await page.locator(".float-tag").first().evaluate(e => ({ border: getComputedStyle(e).borderTopColor, shadow: getComputedStyle(e).boxShadow }));
  const target = await page.locator(".float-tag").first().boundingBox();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2);
  await page.waitForTimeout(350);
  const after = await page.locator(".float-tag").first().evaluate(e => ({ border: getComputedStyle(e).borderTopColor, shadow: getComputedStyle(e).boxShadow, translate: getComputedStyle(e).translate, hit: document.elementFromPoint(e.getBoundingClientRect().x + 3, e.getBoundingClientRect().y + 3)?.className }));
  expect(after.border).not.toBe(before.border); expect(after.shadow).not.toBe(before.shadow); expect(after.translate).toBe("0px -1px");
  expect(after.hit).not.toContain("float-tag");
  // The unchanged cursor treats the entire Hero visual as its image region.
  await expect(page.locator(".cyber-cursor")).toHaveAttribute("data-state", "image");
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.waitForTimeout(40);
  expect(await page.locator(".float-tag").first().evaluate(e => getComputedStyle(e).translate)).toBe("none");
});

test("Holographic tags: CSS motion remains live within a bounded layout budget", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: "no-preference" });
  const page = await context.newPage();
  try {
    await page.goto("/"); await page.bringToFront(); await page.waitForTimeout(1500);
    const snapshot = () => page.locator(".hero-visual").evaluate(root => root.getAnimations({ subtree: true }).filter(a => ["hologram-float", "hologram-sweep"].includes((a as CSSAnimation).animationName)).map(a => ({ name: (a as CSSAnimation).animationName, state: a.playState, time: a.currentTime })));
    const before = await snapshot(); expect(before).toHaveLength(8); expect(before.every(a => a.state === "running")).toBe(true);
    const session = await context.newCDPSession(page); await session.send("Performance.enable");
    const layouts = async () => (await session.send("Performance.getMetrics")).metrics.find(m => m.name === "LayoutCount")!.value;
    const first = await layouts(); await page.waitForTimeout(600); const delta = (await layouts()) - first;
    const after = await snapshot(); expect(after).toHaveLength(8);
    expect(after.every((a, i) => a.state === "running" && Number(a.time) > Number(before[i].time))).toBe(true);
    expect(delta).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});
