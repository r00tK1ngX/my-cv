import { test, expect, type Page } from "@playwright/test";

const tracks = {
  "home-core-inner": { duration: 40000, direction: "normal" },
  "home-core-orbit": { duration: 72000, direction: "reverse" },
  "home-core-scan": { duration: 22000, direction: "normal" },
};
const openHome = async (page: Page, locale: string) => {
  expect((await page.goto(locale === "en" ? "/" : "/vi/"))?.status()).toBe(200);
  await page.bringToFront();
  await page.locator(".hero-portrait").evaluate(image => (image as HTMLImageElement).decode());
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
};

for (const locale of ["en", "vi"] as const) {
  test(`Home identity: ${locale} labels clear the HUD at every responsive phase`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openHome(page, locale);
    for (const width of [320, 360, 390, 639, 640, 768, 899, 900, 1024, 1179, 1180, 1200, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator(".hero-visual").scrollIntoViewIfNeeded();
      for (const phase of [0, .25, .5, .75]) {
        const geometry = await page.evaluate(phase => {
          const visual = document.querySelector<HTMLElement>(".hero-visual")!;
          for (const animation of visual.getAnimations({ subtree: true })) {
            animation.pause();
            animation.currentTime = Number(animation.effect!.getTiming().duration) * phase;
          }
          const core = document.querySelector(".home-identity-core")!.getBoundingClientRect();
          const image = document.querySelector<HTMLImageElement>(".hero-portrait")!;
          const portrait = image.getBoundingClientRect(), style = getComputedStyle(image);
          const copy = document.querySelector(".hero-copy")!.getBoundingClientRect();
          const center = { x: core.x + core.width / 2, y: core.y + core.height / 2 };
          const labels = [...visual.querySelectorAll(".node-capsule")].map(element => {
            const r = element.getBoundingClientRect();
            const dx = Math.max(r.x - center.x, 0, center.x - r.right);
            const dy = Math.max(r.y - center.y, 0, center.y - r.bottom);
            return { text: element.textContent, x: r.x, right: r.right, gap: Math.hypot(dx, dy) - core.width * 202 / 420 };
          });
          return {
            width: core.width, height: core.height, x: core.x, right: core.right,
            centerError: Math.abs(portrait.x + portrait.width / 2 - center.x) + Math.abs(portrait.y + portrait.height / 2 - center.y),
            portrait: { width: portrait.width, height: portrait.height, fit: style.objectFit, position: style.objectPosition, naturalWidth: image.naturalWidth },
            copySeparated: innerWidth < 640 ? core.top >= copy.bottom : core.left >= copy.right,
            scrollWidth: document.documentElement.scrollWidth, labels,
          };
        }, phase);
        expect(geometry.width).toBeLessThanOrEqual(420.1);
        expect(Math.abs(geometry.width - geometry.height)).toBeLessThan(.1);
        expect(geometry.x).toBeGreaterThanOrEqual(0); expect(geometry.right).toBeLessThanOrEqual(width);
        expect(geometry.centerError).toBeLessThan(.1);
        expect(Math.abs(geometry.portrait.width - geometry.portrait.height)).toBeLessThan(.1);
        expect(geometry.portrait.naturalWidth).toBe(512);
        expect(geometry.portrait.fit).toBe("cover"); expect(geometry.portrait.position).toBe("50% 50%");
        expect(geometry.copySeparated).toBe(true); expect(geometry.scrollWidth).toBeLessThanOrEqual(width);
        expect(geometry.labels.map(l => l.text)).toEqual(["PWN / BINARY", "RED TEAM", "LINUX", "AI & SECURITY"]);
        for (const label of geometry.labels) {
          expect(label.x).toBeGreaterThanOrEqual(0); expect(label.right).toBeLessThanOrEqual(width);
          expect(label.gap, `${width}px phase ${phase}: ${label.text}`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  for (const [device, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
    test(`Home identity: ${locale} ${device} preserves image and transparent ornament layers`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, isMobile: device === "mobile", hasTouch: device === "mobile", reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors: string[] = [], failures: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
      page.on("requestfailed", r => failures.push(r.url()));
      try {
        await openHome(page, locale);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator(".home-core-ticks path")).toHaveCount(36);
        await expect(page.locator(".home-core-marker")).toHaveCount(2);
        await expect(page.locator(".scan-brackets i")).toHaveCount(4);
        await expect(page.locator(".hero-portrait")).toHaveAttribute("src", "/images/chau-anh-dung-avatar.webp");
        const data = await page.locator(".home-identity-core").evaluate(root => {
          const image = root.querySelector(".hero-portrait")!.getBoundingClientRect();
          const target = document.elementFromPoint(image.x + image.width / 2, image.y + image.height / 2);
          const animations = root.getAnimations({ subtree: true }).map(a => ({
            target: (a.effect as KeyframeEffect).target!.classList.item(1), state: a.playState,
            duration: a.effect!.getTiming().duration, direction: a.effect!.getTiming().direction,
            properties: [...new Set((a.effect as KeyframeEffect).getKeyframes().flatMap(frame => Object.keys(frame)))].filter(key => !["offset", "easing", "composite", "computedOffset"].includes(key)),
          }));
          return { hitImage: target?.matches(".hero-portrait"), clear: [...root.querySelectorAll(".home-hud,.home-hud *,.scan-brackets,.scan-brackets *")].every(e => getComputedStyle(e).pointerEvents === "none"), nonfocusable: [...root.querySelectorAll("svg")].every(e => e.getAttribute("focusable") === "false"), animations };
        });
        expect(data.clear).toBe(true); expect(data.nonfocusable).toBe(true); expect(data.hitImage).toBe(true);
        expect(data.animations).toHaveLength(3);
        for (const [target, timing] of Object.entries(tracks)) {
          const animation = data.animations.find(a => a.target === target)!;
          expect(animation).toMatchObject({ ...timing, state: "running", properties: ["transform"] });
        }
        expect(errors).toEqual([]); expect(failures).toEqual([]);
      } finally { await context.close(); }
    });
  }

  test(`Home identity: ${locale} reduced motion stops and resumes all core tracks`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await openHome(page, locale);
      const snapshot = () => page.locator(".home-identity-core").evaluate(root => root.getAnimations({ subtree: true }).map(a => ({ state: a.playState, time: a.currentTime })));
      expect(await snapshot()).toHaveLength(0);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect.poll(async () => (await snapshot()).length).toBe(3);
      const initial = await snapshot(); await page.waitForTimeout(150); const advanced = await snapshot();
      expect(advanced.every((a, i) => a.state === "running" && Number(a.time) > Number(initial[i].time))).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(async () => (await snapshot()).length).toBe(0);
      await expect(page.locator(".hero-portrait")).toBeVisible();
    } finally { await context.close(); }
  });
}

test("Home identity: CSS-only active HUD has bounded layout cost without JS enhancements", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: "no-preference" });
  const page = await context.newPage();
  try {
    await page.goto("/"); await page.bringToFront(); await page.waitForTimeout(1500);
    const snapshot = () => page.locator(".home-identity-core").evaluate(root => root.getAnimations({ subtree: true }).map(a => ({ state: a.playState, time: a.currentTime })));
    const initial = await snapshot(); expect(initial).toHaveLength(3); expect(initial.every(a => a.state === "running")).toBe(true);
    const session = await context.newCDPSession(page); await session.send("Performance.enable");
    const layouts = async () => (await session.send("Performance.getMetrics")).metrics.find(m => m.name === "LayoutCount")!.value;
    const first = await layouts(); await page.waitForTimeout(500); const delta = (await layouts()) - first;
    const final = await snapshot(); expect(final).toHaveLength(3);
    expect(final.every((a, i) => a.state === "running" && Number(a.time) > Number(initial[i].time))).toBe(true);
    expect(delta).toBeLessThanOrEqual(2);
  } finally { await context.close(); }
});
