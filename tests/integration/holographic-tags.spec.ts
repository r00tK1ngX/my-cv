import { test, expect, type Page } from "@playwright/test";

const openHome = async (page: Page, locale: string) => {
  await page.goto(locale === "en" ? "/" : "/vi/");
  await page.bringToFront();
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
};
const colors = [
  "rgb(34, 211, 238)",
  "rgb(74, 222, 128)",
  "rgb(251, 191, 36)",
  "rgb(244, 114, 182)",
  "rgb(167, 139, 250)",
];
const labels = ["PWN / BINARY", "LINUX", "AI & SECURITY", "RED TEAM", "CTF PLAYER"];

for (const locale of ["en", "vi"] as const) {
  for (const [device, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
    test(`Tactical HUD markers: ${locale} ${device} retain identity in chamfered modules`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: device === "mobile", isMobile: device === "mobile", reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
      try {
        await openHome(page, locale);
        const data = await page.locator(".hud-marker").evaluateAll(elements => elements.map(e => {
          const plate = e.querySelector(".hud-marker-plate")!;
          const core = e.querySelector(".hud-marker-core")!;
          const label = e.querySelector(".hud-marker-label")!;
          const pulse = e.querySelector(".hud-marker-pulse")!;
          const icon = e.querySelector(".hud-marker-icon")!;
          const s = getComputedStyle(plate);
          const r = plate.getBoundingClientRect();
          return {
            text: e.textContent,
            color: getComputedStyle(e).color,
            pointer: s.pointerEvents,
            clipPath: s.clipPath,
            backdrop: getComputedStyle(core).backdropFilter,
            font: getComputedStyle(label).fontSize,
            float: { name: s.animationName, duration: s.animationDuration, delay: s.animationDelay },
            pulse: { hidden: pulse.getAttribute("aria-hidden"), background: getComputedStyle(pulse).backgroundColor },
            icon: { hidden: icon.getAttribute("aria-hidden"), width: icon.getBoundingClientRect().width },
            focusable: e.matches("a,button,[tabindex],[role=button]") || !!e.querySelector("a,button,[tabindex],[role=button]"),
            clippedText: core.scrollWidth > core.clientWidth + 1,
            hit: !!document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest(".hud-marker"),
          };
        }));
        expect(data.map(d => d.text)).toEqual(labels);
        expect(data.map(d => d.color)).toEqual(colors);
        expect(data.map(d => d.float.delay)).toEqual(["0s", "-2s", "-4s", "-6s", "-8s"]);
        for (const row of data) {
          expect(row.pointer).toBe("none");
          expect(row.clipPath).toContain("polygon");
          expect(row.backdrop).toBe("blur(6px)");
          expect(row.font).toBe(device === "desktop" ? "10px" : "9px");
          expect(row.float.name).toBe("hud-marker-float");
          expect(row.float.duration).toBe("10s");
          expect(row.icon.hidden).toBe("true");
          expect(row.icon.width).toBe(12);
          expect(row.pulse.hidden).toBe("true");
          expect(row.pulse.background).toBe(row.color);
          expect(row.focusable).toBe(false);
          expect(row.clippedText).toBe(false);
          expect(row.hit).toBe(false);
        }
        expect(errors).toEqual([]);
      } finally { await context.close(); }
    });
  }

  test(`Tactical HUD markers: ${locale} reduced motion stays static at load and live changes`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const snapshot = () => page.locator(".hud-marker-plate").evaluateAll(elements => elements.map(e => ({ transform: getComputedStyle(e).transform, float: getComputedStyle(e).animationName })));
    try {
      await openHome(page, locale);
      const initial = await snapshot();
      expect(initial).toHaveLength(5);
      expect(initial.every(d => d.float === "none" && d.transform === "none")).toBe(true);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "hud-marker-float")).toBe(true);
      const moving = await snapshot(); await page.waitForTimeout(200);
      expect((await snapshot()).some((d, i) => d.transform !== moving[i].transform)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(async () => (await snapshot()).every(d => d.float === "none")).toBe(true);
      const still = await snapshot(); await page.waitForTimeout(160); expect(await snapshot()).toEqual(still);
    } finally { await context.close(); }
  });
}

test("Tactical HUD markers: quiet regional hover does not capture pointer or alter the cursor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openHome(page, "en");
  await page.mouse.move(600, 200); await page.waitForTimeout(350);
  const before = await page.locator(".hud-marker-plate").first().evaluate(e => ({ bg: getComputedStyle(e).backgroundImage }));
  const target = await page.locator(".hud-marker-plate").first().boundingBox();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2);
  await page.waitForTimeout(450);
  const after = await page.locator(".hud-marker-plate").first().evaluate(e => ({
    bg: getComputedStyle(e).backgroundImage,
    translate: getComputedStyle(e).translate,
    hit: !!document.elementFromPoint(e.getBoundingClientRect().x + e.clientWidth / 2, e.getBoundingClientRect().y + e.clientHeight / 2)?.closest(".hud-marker"),
  }));
  expect(after.bg).not.toBe(before.bg);
  expect(after.translate).toBe("none");
  expect(after.hit).toBe(false);
  await expect(page.locator(".cyber-cursor")).toHaveAttribute("data-state", "image");
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.waitForTimeout(40);
  expect(await page.locator(".hud-marker-plate").first().evaluate(e => getComputedStyle(e).transform)).toBe("none");
});

test("Tactical HUD markers: CSS-only float stays live with bounded layout cost", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: "no-preference" });
  const page = await context.newPage();
  try {
    await page.goto("/"); await page.bringToFront(); await page.waitForTimeout(1500);
    const snapshot = () => page.locator(".hero-visual").evaluate(root => root.getAnimations({ subtree: true }).filter(a => (a as CSSAnimation).animationName === "hud-marker-float").map(a => ({ name: (a as CSSAnimation).animationName, state: a.playState, time: a.currentTime })));
    const before = await snapshot(); expect(before).toHaveLength(5); expect(before.every(a => a.state === "running")).toBe(true);
    const session = await context.newCDPSession(page); await session.send("Performance.enable");
    const layouts = async () => (await session.send("Performance.getMetrics")).metrics.find(m => m.name === "LayoutCount")!.value;
    const first = await layouts(); await page.waitForTimeout(600); const delta = (await layouts()) - first;
    const after = await snapshot(); expect(after).toHaveLength(5);
    expect(after.every((a, i) => a.state === "running" && Number(a.time) > Number(before[i].time))).toBe(true);
    expect(delta).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});
