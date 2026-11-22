import { test, expect } from "@playwright/test";

for (const locale of ["en", "vi"] as const) {
  test(`${locale}: full document loads (first visit & reload) play boot sequence, while internal nav & lang switch do not replay`, async ({ page }) => {
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
    await expect(preloader.locator(".boot-shield")).toHaveAttribute("src", "/icons/icon-192x192.png");
    await expect(preloader.locator(".boot-skip")).toHaveCount(0);

    const offlineLabel = locale === "en" ? "OFFLINE" : "NGOẠI TUYẾN";
    const onlineLabel = locale === "en" ? "ONLINE" : "TRỰC TUYẾN";
    const earlyState = await page.evaluate(() => ({
      pct: parseInt(document.querySelector(".boot-status-pct")?.textContent ?? "0", 10),
      label: document.querySelector(".boot-status-label")?.textContent ?? "",
      isOnline: document.querySelector(".boot-status-live")?.classList.contains("is-online") ?? false,
    }));
    if (earlyState.pct < 100) {
      expect(earlyState.label).toBe(offlineLabel);
      expect(earlyState.isOnline).toBe(false);
    }

    await expect(preloader.locator(".boot-status-label")).toHaveText(onlineLabel, { timeout: 5000 });
    await expect(preloader.locator(".boot-status-pct")).toHaveText("100%");
    await expect(preloader).toHaveCount(0, { timeout: 5000 });

    // Full reload (F5 / Ctrl+R) MUST replay Preloader
    await page.reload();
    await expect(page.locator(".boot-preloader")).toBeVisible();
    await expect(page.locator(".boot-preloader")).toHaveCount(0, { timeout: 5000 });

    // Internal navigation Home -> About -> Projects does NOT replay
    await page.locator(`.desktop-nav a[href="${locale === "en" ? "/about/" : "/vi/about/"}"]`).click();
    await expect(page).toHaveURL(locale === "en" ? /\/about\/$/ : /\/vi\/about\/$/);
    await expect(page.locator(".boot-preloader")).toHaveCount(0);

    await page.locator(`.desktop-nav a[href="${locale === "en" ? "/projects/" : "/vi/projects/"}"]`).click();
    await expect(page).toHaveURL(locale === "en" ? /\/projects\/$/ : /\/vi\/projects\/$/);
    await expect(page.locator(".boot-preloader")).toHaveCount(0);

    // Language switch through internal link does NOT replay, then reloading DOES replay
    const targetLangUrl = locale === "en" ? /\/vi\/projects\/$/ : /\/projects\/$/;
    await page.locator(".language-switch").click();
    await expect(page).toHaveURL(targetLangUrl);
    await expect(page.locator(".boot-preloader")).toHaveCount(0);

    await page.reload();
    await expect(page.locator(".boot-preloader")).toBeVisible();
    await expect(page.locator(".boot-preloader")).toContainText(
      locale === "en" ? "TRẠM LÀM VIỆC BẢO MẬT" : "SECURITY WORKSTATION",
    );
    await expect(page.locator(".boot-preloader")).toHaveCount(0, { timeout: 5000 });

    expect(errors).toEqual([]);
  });

  test(`${locale}: brand navigation scrolls to top on home and navigates to top of home from subpages`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    const homePath = locale === "en" ? "/" : "/vi/";
    const aboutPath = locale === "en" ? "/about/" : "/vi/about/";
    const projectsPath = locale === "en" ? "/projects/" : "/vi/projects/";

    // Home scrolled down -> click brand -> top of Home
    await page.goto(homePath);
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.locator(".wordmark").click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page).toHaveURL(locale === "en" ? /\/$/ : /\/vi\/$/);

    // About -> click brand -> Home at top
    await page.goto(aboutPath);
    await page.locator(".wordmark").click();
    await expect(page).toHaveURL(locale === "en" ? /\/$/ : /\/vi\/$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // Projects -> keyboard Enter on brand -> Home at top
    await page.goto(projectsPath);
    await page.locator(".wordmark").focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(locale === "en" ? /\/$/ : /\/vi\/$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // Mobile header brand click
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(aboutPath);
    await page.locator(".wordmark").click();
    await expect(page).toHaveURL(locale === "en" ? /\/$/ : /\/vi\/$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    expect(errors).toEqual([]);
  });

  test(`${locale}: Escape key dismisses preloader without visible skip button`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(locale === "en" ? "/about/" : "/vi/projects/");
    const preloader = page.locator(".boot-preloader");
    await expect(preloader).toBeVisible();
    await expect(preloader.locator(".boot-skip")).toHaveCount(0);
    await page.keyboard.press("Escape");
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
    await expect(p.locator(".boot-log.is-visible").first()).toBeVisible({ timeout: 2000 });
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
