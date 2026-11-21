import { test, expect } from "@playwright/test";

for (const locale of ["en", "vi"] as const) {
  test(`${locale}: first load plays boot sequence, reveals site, and skips on refresh/navigation`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(locale === "en" ? "/" : "/vi/");

    const preloader = page.locator(".boot-preloader");
    await expect(preloader).toBeVisible();
    await expect(preloader.locator(".boot-host")).toHaveText("r00tK1ngX@portfolio");
    await expect(preloader.locator(".boot-emblem-img")).toHaveAttribute("src", "/icons/icon-192x192.png");
    await expect(preloader).toContainText(locale === "en" ? "Initializing portfolio environment..." : "Khởi tạo môi trường portfolio...");
    await expect(preloader).toContainText(locale === "en" ? "SYSTEM READY" : "HỆ THỐNG SẴN SÀNG", { timeout: 5000 });

    // Dissolves cleanly after completion
    await expect(preloader).toHaveCount(0, { timeout: 5000 });

    // Refresh in same tab does not replay
    await page.reload();
    await expect(page.locator(".boot-preloader")).toHaveCount(0);

    // Internal navigation does not replay
    await page.locator(`.desktop-nav a[href="${locale === "en" ? "/about/" : "/vi/about/"}"]`).click();
    await expect(page).toHaveURL(locale === "en" ? /\/about\/$/ : /\/vi\/about\/$/);
    await expect(page.locator(".boot-preloader")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${locale}: skip button and Escape immediately dismiss preloader`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(locale === "en" ? "/about/" : "/vi/projects/");
    const preloader = page.locator(".boot-preloader");
    await expect(preloader).toBeVisible();
    await preloader.locator(".boot-skip").click();
    await expect(preloader).toHaveCount(0, { timeout: 2000 });
  });

  test(`${locale}: reduced-motion bypasses boot animation immediately`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(locale === "en" ? "/" : "/vi/");
    await expect(page.locator(".boot-preloader")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
  });
}

test("BootPreloader fits cleanly without horizontal overflow across desktop, tablet, and mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 1280, 768, 390, 320]) {
    const context = await page.context().browser()!.newContext({ viewport: { width, height: 844 }, reducedMotion: "no-preference" });
    const p = await context.newPage();
    await p.goto("/");
    await expect(p.locator(".boot-preloader")).toBeVisible();
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `overflow at ${width}px`).toBe(false);
    await p.keyboard.press("Escape");
    await expect(p.locator(".boot-preloader")).toHaveCount(0, { timeout: 2000 });
    await context.close();
  }
});

test("First-paint zero-flicker: preloader covers viewport before homepage paints even under CPU/network throttling", async ({ browser }) => {
  for (const url of ["/", "/vi/"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 80,
      downloadThroughput: 500 * 1024,
      uploadThroughput: 250 * 1024,
    });
    await page.addInitScript(() => {
      (window as unknown as { __firstPaintHits: boolean[] }).__firstPaintHits = [];
      const sample = () => {
        const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const pre = document.querySelector(".boot-preloader");
        if (pre) {
          (window as unknown as { __firstPaintHits: boolean[] }).__firstPaintHits.push(
            !!el?.closest(".boot-preloader") && getComputedStyle(pre).display !== "none",
          );
        }
      };
      document.addEventListener("DOMContentLoaded", sample, { once: true });
    });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const hits = await page.evaluate(() => (window as unknown as { __firstPaintHits: boolean[] }).__firstPaintHits);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every(Boolean), `Homepage flashed before preloader on ${url}`).toBe(true);
    await expect(page.locator(".boot-preloader")).toHaveCount(0, { timeout: 6000 });
    await expect(page.locator("h1")).toBeVisible();
    await ctx.close();
  }
});

test("No-JS fallback keeps homepage accessible without preloader blocking", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".boot-preloader")).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  await ctx.close();
});
