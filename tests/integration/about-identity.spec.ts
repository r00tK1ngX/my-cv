import { test, expect } from "@playwright/test";

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };
const tracks = ["identity-inner", "identity-orbit", "identity-scan"];
const openAbout = async (page: import("@playwright/test").Page, locale: string) => {
  const response = await page.goto(locale === "en" ? "/about/" : "/vi/about/");
  expect(response?.status()).toBe(200);
  await page.bringToFront();
  await page.locator(".about-portrait").evaluate(image => (image as HTMLImageElement).decode());
  await expect(page.locator(".about-avatar")).toHaveAttribute("data-motion-state", "done");
};

test("About identity: ambient motion avoids repeated layout work", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openAbout(page, "en");
  const session = await page.context().newCDPSession(page);
  await session.send("Performance.enable");
  const layoutCount = async () => (await session.send("Performance.getMetrics")).metrics.find(metric => metric.name === "LayoutCount")!.value;
  const before = await layoutCount();
  await page.waitForTimeout(400);
  expect((await layoutCount()) - before).toBeLessThanOrEqual(2);
});

for (const locale of ["en", "vi"] as const) {
  for (const [device, viewport] of [["desktop", desktop], ["mobile", mobile]] as const) {
    test(`About identity: ${locale} ${device} keeps the face clear and HUD non-interactive`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: device === "mobile", isMobile: device === "mobile", reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      try {
        await openAbout(page, locale);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator(".about-portrait")).toHaveAttribute("src", "/images/chau-anh-dung-avatar.webp");
        await expect(page.locator(".identity-ticks > path")).toHaveCount(24);
        await expect(page.locator(".identity-brackets > path")).toHaveCount(4);
        await expect(page.locator(".identity-marker")).toHaveCount(2);
        await expect(page.locator(".identity-nodes > rect")).toHaveCount(2);
        const result = await page.evaluate(() => {
          const root = document.querySelector<HTMLElement>(".about-avatar")!;
          const core = document.querySelector<HTMLElement>(".identity-core")!.getBoundingClientRect();
          const image = document.querySelector<HTMLImageElement>(".about-portrait")!;
          const portrait = image.getBoundingClientRect(), style = getComputedStyle(image);
          return {
            clear: [...root.querySelectorAll("*")].every(e => getComputedStyle(e).pointerEvents === "none"),
            focusable: root.querySelectorAll("a,button,[tabindex],input").length,
            svgFocusable: root.querySelector("svg")?.getAttribute("focusable"),
            hidden: root.getAttribute("aria-hidden"),
            ratio: portrait.width / core.width,
            squareError: Math.abs(portrait.width - portrait.height),
            centerError: Math.abs(portrait.x + portrait.width / 2 - core.x - core.width / 2) + Math.abs(portrait.y + portrait.height / 2 - core.y - core.height / 2),
            fit: style.objectFit, position: style.objectPosition, radius: style.borderRadius,
            intrinsic: [image.naturalWidth, image.naturalHeight],
            overflow: document.documentElement.scrollWidth > innerWidth,
            motion: root.getAnimations({ subtree: true }).map(a => ({ target: (a.effect as KeyframeEffect).target?.classList.item(1), duration: a.effect?.getTiming().duration, easing: a.effect?.getTiming().easing, properties: [...new Set((a.effect as KeyframeEffect).getKeyframes().flatMap(frame => Object.keys(frame)))].filter(key => !["offset", "easing", "composite", "computedOffset"].includes(key)) })),
          };
        });
        expect(result.clear).toBe(true); expect(result.focusable).toBe(0);
        expect(result.svgFocusable).toBe("false"); expect(result.hidden).toBe("true");
        expect(result.ratio).toBeCloseTo(160 / 288, 3);
        expect(result.squareError).toBeLessThan(0.1); expect(result.centerError).toBeLessThan(0.1);
        expect(result.intrinsic).toEqual([512, 512]); expect(result.fit).toBe("cover");
        expect(result.position).toBe("50% 50%"); expect(result.radius).toBe("50%"); expect(result.overflow).toBe(false);
        expect(result.motion.map(a => a.target).sort()).toEqual([...tracks].sort());
        expect(result.motion.map(a => a.duration).sort((a, b) => Number(a) - Number(b))).toEqual([18000, 36000, 64000]);
        expect(result.motion.every(a => a.easing === "linear" && a.properties.length === 1 && a.properties[0] === "transform")).toBe(true);
        expect(errors).toEqual([]);
      } finally { await context.close(); }
    });
  }

  test(`About identity: ${locale} reduced motion is static at load and after live changes`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: desktop, reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await openAbout(page, locale);
      const animationCount = () => page.locator(".about-avatar").evaluate(root => root.getAnimations({ subtree: true }).length);
      expect(await animationCount()).toBe(0);
      for (const name of tracks) expect(await page.locator("." + name).evaluate(e => getComputedStyle(e).animationName)).toBe("none");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect.poll(animationCount).toBe(3);
      const transform = () => page.locator(".identity-inner").evaluate(e => getComputedStyle(e).transform);
      const first = await transform();
      await expect.poll(transform).not.toBe(first);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(animationCount).toBe(0);
      const still = await transform();
      await page.waitForTimeout(160);
      expect(await transform()).toBe(still);
      await expect(page.locator(".about-portrait")).toBeVisible();
    } finally { await context.close(); }
  });

  test(`About identity: ${locale} scales at breakpoints without changing layout or scroll anchoring`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openAbout(page, locale);
    for (const width of [320, 360, 390, 639, 768, 899, 900, 1180, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const result = await page.evaluate(() => {
        const core = document.querySelector(".identity-core")!.getBoundingClientRect();
        const bio = document.querySelector(".bio")!.getBoundingClientRect();
        const portrait = document.querySelector(".about-portrait")!.getBoundingClientRect();
        return { width: core.width, height: core.height, x: core.x, right: core.right, bottom: core.bottom, ratio: portrait.width / core.width, overflow: document.documentElement.scrollWidth > innerWidth, separated: innerWidth < 900 ? core.bottom <= bio.top : core.right <= bio.left };
      });
      expect(result.width).toBeLessThanOrEqual(288.1);
      expect(Math.abs(result.width - result.height)).toBeLessThan(0.1);
      expect(result.x).toBeGreaterThanOrEqual(0); expect(result.right).toBeLessThanOrEqual(width);
      expect(result.ratio).toBeCloseTo(160 / 288, 3);
      expect(result.overflow).toBe(false); expect(result.separated).toBe(true);
    }
    await page.setViewportSize(desktop);
    const position = () => page.locator(".identity-core").evaluate(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY }; });
    const before = await position();
    await page.mouse.wheel(0, 360);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    const after = await position();
    expect(Math.abs(before.x - after.x)).toBeLessThan(0.1);
    expect(Math.abs(before.y - after.y)).toBeLessThan(0.1);
  });
}
