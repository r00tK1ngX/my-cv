import { test, expect } from "@playwright/test";

for (const locale of ["en", "vi"] as const) {
  const prefix = locale === "vi" ? "/vi" : "";
  const menuName = locale === "vi" ? "Menu điều hướng" : "Navigation menu";

  for (const width of [390, 1440]) {
    test(`${locale}: wordmark visible label is included in its accessibility tree name at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${prefix}/about/`);
      const wordmark = page.locator(".wordmark");
      const evidence = {
        visible: await wordmark.innerText(),
        accessibleTree: await wordmark.ariaSnapshot(),
        label: await wordmark.getAttribute("aria-label"),
      };
      await testInfo.attach("wordmark-accessibility", { body: JSON.stringify(evidence, null, 2), contentType: "application/json" });
      expect(evidence.visible).toContain("r00tK1ngX");
      expect(evidence.visible).toContain("portfolio");
      await expect(wordmark).toHaveAccessibleName(
        locale === "vi" ? /r00tK1ngX.*portfolio.*Trang chủ/ : /r00tK1ngX.*portfolio.*Home/,
      );
      expect(evidence.accessibleTree).toMatch(/link .*r00tK1ngX.*portfolio/);
    });
  }

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    for (const target of [".language-switch", ".wordmark"]) {
      test(`${locale}: modal blocks trusted background pointer ${target} in ${reducedMotion}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion });
        await page.goto(`${prefix}/about/`);
        await page.bringToFront();
        const originalURL = page.url();
        const box = await page.locator(target).boundingBox();
        expect(box).not.toBeNull();
        await page.locator(".menu-toggle").click();
        const dialog = page.getByRole("dialog", { name: menuName });
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("aria-modal", "true");
        const before = await page.locator(target).evaluate((element) => ({
          inert: !!element.closest("[inert]"),
          path: location.pathname,
          dialogTree: document.querySelector('[role="dialog"]')?.getAttribute("aria-label"),
        }));
        const tree = await page.locator("body").ariaSnapshot();
        await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.waitForTimeout(180);
        const actual = { before, path: new URL(page.url()).pathname, tree, dialogCount: await page.getByRole("dialog").count() };
        await testInfo.attach("modal-pointer-state", { body: JSON.stringify(actual, null, 2), contentType: "application/json" });
        expect(page.url()).toBe(originalURL);
        await expect(dialog).toBeVisible();
        expect(before.inert).toBe(true);
        expect(tree).not.toMatch(/link "(?:Chuyển sang Tiếng Việt|Switch to English)"/);
        expect(tree).not.toContain("contentinfo");
        expect(tree).not.toContain("main:");
      });
    }

    test(`${locale}: modal keyboard, close controls and background restoration in ${reducedMotion}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(`${prefix}/about/`);
      const toggle = page.locator(".menu-toggle");
      await toggle.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: menuName });
      await expect(dialog).toBeVisible();
      await expect(page.locator(".mobile-drawer nav a").first()).toBeFocused();
      for (const key of ["Shift+Tab", "Tab", "End", "Tab", "Shift+Tab"]) {
        await page.keyboard.press(key);
        expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      expect(await page.locator("main").evaluate((element: HTMLElement) => element.inert)).toBe(false);
      expect(await page.locator("footer").evaluate((element: HTMLElement) => element.inert)).toBe(false);
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
      await toggle.click();
      await page.locator(".menu-toggle").click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(toggle).toBeFocused();
      await toggle.click();
      await toggle.click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(toggle).toBeFocused();
      await page.locator(".language-switch").click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(`${locale === "en" ? "/vi" : ""}/about/`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "en" ? "vi" : "en");
    });
  }
}
