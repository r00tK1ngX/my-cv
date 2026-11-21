import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["en", "vi"] as const) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`${locale} ${reducedMotion}: dialog exposes only the intended mobile navigation landmark`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      await page.locator(".menu-toggle").click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toHaveAccessibleName(locale === "vi" ? "Menu điều hướng" : "Navigation menu");
      await expect(dialog.getByRole("navigation")).toHaveCount(1);
      await expect(dialog.getByRole("navigation")).toHaveAccessibleName(locale === "vi" ? "Điều hướng di động" : "Mobile navigation");
      await expect(dialog.getByRole("banner")).toHaveCount(0);
      await expect(dialog.getByRole("main")).toHaveCount(0);
      await expect(dialog.getByRole("contentinfo")).toHaveCount(0);
      expect(await dialog.evaluate((element) => !!element.querySelector("main,footer"))).toBe(false);
    });
    test(`${locale} ${reducedMotion}: controls relationship, repeated lifecycle and desktop cleanup`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      const toggle = page.locator(".menu-toggle");
      await expect(toggle).toBeHidden();
      await expect(toggle).not.toHaveAttribute("aria-controls");
      await expect(page.getByRole("navigation", { name: locale === "vi" ? "Điều hướng chính" : "Main navigation", exact: true })).toHaveCount(1);
      await page.setViewportSize({ width: 390, height: 844 });
      for (let cycle = 0; cycle < 4; cycle++) {
        await toggle.focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(toggle).toHaveAttribute("aria-controls", "mobile-navigation");
        await expect(page.locator("#mobile-navigation")).toHaveCount(1);
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(page.locator(".mobile-drawer > .button")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        if (cycle === 1) await toggle.click();
        else if (cycle === 2) await page.locator(".drawer-heading button").click();
        else if (cycle === 3) await page.mouse.click(200, 810);
        else await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(toggle).toBeFocused();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator("#mobile-navigation")).toHaveCount(0);
        await expect(toggle).not.toHaveAttribute("aria-controls");
      }
      await toggle.click();
      await page.setViewportSize({ width: 1180, height: 900 });
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("main,footer").locator("[inert]")).toHaveCount(0);
      expect(await page.locator("main").evaluate((element: HTMLElement) => element.inert)).toBe(false);
      expect(await page.locator("footer").evaluate((element: HTMLElement) => element.inert)).toBe(false);
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
      await expect(page.getByRole("navigation", { name: locale === "vi" ? "Điều hướng chính" : "Main navigation", exact: true })).toHaveCount(1);
      await page.setViewportSize({ width: 390, height: 844 });
      await toggle.click();
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await page.locator(".language-switch").click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(locale === "en" ? "/vi/about/" : "/about/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "en" ? "vi" : "en");
    });
    test(`${locale} ${reducedMotion}: desktop breakpoint restores focus to a visible header control`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      await page.locator(".menu-toggle").click();
      await expect(page.locator(".drawer-heading button")).toBeFocused();
      await page.setViewportSize({ width: 1180, height: 900 });
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator(".menu-toggle")).toBeHidden();
      await expect(page.locator(".wordmark")).toBeFocused();
      const actual = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        classes: document.activeElement?.className,
        visible: !!document.activeElement?.getClientRects().length,
        inert: !!document.activeElement?.closest("[inert]"),
        dialogCount: document.querySelectorAll('[role="dialog"]').length,
      }));
      await testInfo.attach("breakpoint-focus", { body: JSON.stringify(actual), contentType: "application/json" });
      expect(actual).toMatchObject({ tag: "A", classes: "wordmark", visible: true, inert: false, dialogCount: 0 });
      await page.keyboard.press("Tab");
      await expect(page.locator(".desktop-nav a").first()).toBeFocused();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator(".menu-toggle").click();
      await page.keyboard.press("Escape");
      await expect(page.locator(".menu-toggle")).toBeFocused();
    });
    test(`${locale} ${reducedMotion}: modal bounds stay in the viewport when opened after page scrolling`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, 950); });
      expect(await page.evaluate(() => scrollY)).toBeGreaterThan(844);
      await page.locator(".menu-toggle").click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const bounds = await dialog.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBe(0);
      expect(bounds!.height).toBe(844);
      await expect(page.locator(".drawer-heading button")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator(".menu-toggle")).toBeFocused();
    });
    test(`${locale} ${reducedMotion}: reopening during exit and breakpoint changes preserve current focus generation`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      const toggle = page.locator(".menu-toggle");
      for (const delay of [20, 140, 260]) {
        await toggle.click();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Escape");
        await page.waitForTimeout(delay);
        await toggle.click();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.waitForTimeout(360);
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(toggle).toBeFocused();
      }
      await toggle.click();
      await page.keyboard.press("Escape");
      await page.setViewportSize({ width: 1180, height: 900 });
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("#mobile-navigation")).toHaveCount(0);
      await page.setViewportSize({ width: 1179, height: 900 });
      await toggle.click();
      await expect(page.locator(".drawer-heading button")).toBeFocused();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(page.locator("#mobile-navigation")).toHaveCount(0);
      await expect(toggle).not.toHaveAttribute("aria-controls");
    });
    test(`${locale} ${reducedMotion}: background remains pointer and keyboard inert; modal axe checks`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/contact/" : "/contact/");
      const start = page.url();
      const toggle = page.locator(".menu-toggle");
      const boxes = await Promise.all([".language-switch", ".wordmark"].map(selector => page.locator(selector).boundingBox()));
      await toggle.click();
      for (const selector of [".skip-link", ".wordmark", ".language-switch", "main input", "main textarea", "footer a"]) {
        const target = page.locator(selector).first();
        expect(await target.evaluate(element => !!element.closest("[inert]"))).toBe(true);
        await target.evaluate((element: HTMLElement) => element.focus());
        await expect(page.locator(".drawer-heading button")).toBeFocused();
      }
      for (const box of boxes) {
        expect(box).not.toBeNull();
        await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await expect(page.getByRole("dialog")).toBeVisible();
        expect(page.url()).toBe(start);
        await page.keyboard.press("Tab");
        expect(await page.locator("#mobile-navigation").evaluate(element => element.contains(document.activeElement))).toBe(true);
      }
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      await testInfo.attach("modal-axe", { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }), contentType: "application/json" });
      expect(result.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      const closed = await new AxeBuilder({ page }).withRules(["aria-valid-attr-value"]).analyze();
      expect(closed.violations).toEqual([]);
    });
    for (const key of ["Tab", "Shift+Tab"]) {
      test(`${locale} ${reducedMotion}: header pointer drag-release then ${key} stays in active modal`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion });
        await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
        await page.bringToFront();
        const toggle = page.locator(".menu-toggle");
        await toggle.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.waitForTimeout(350);
        const box = await toggle.boundingBox();
        expect(box).not.toBeNull();
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down();
        await page.mouse.move(200, 40);
        await page.mouse.up();
        await expect(toggle).toBeFocused();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await page.keyboard.press(key);
        const actual = await page.evaluate(() => ({
          tag: document.activeElement?.tagName,
          classes: document.activeElement?.className,
          inDialog: !!document.activeElement?.closest('[role="dialog"]'),
          inDrawer: !!document.activeElement?.closest("#mobile-navigation"),
          dialogCount: document.querySelectorAll('[role="dialog"]').length,
          expanded: document.querySelector(".menu-toggle")?.getAttribute("aria-expanded"),
          documentFocused: document.hasFocus(),
        }));
        await testInfo.attach("actual-focus-and-dialog", { body: JSON.stringify(actual), contentType: "application/json" });
        expect(actual.dialogCount).toBe(1);
        expect(actual.expanded).toBe("true");
        expect(actual.inDialog).toBe(true);
        expect(actual.inDrawer).toBe(true);
        expect(actual.documentFocused).toBe(true);
        if (key === "Shift+Tab") await expect(page.locator(".mobile-drawer > .button")).toBeFocused();
        else await expect(page.locator(".drawer-heading button")).toBeFocused();
      });
    }
  }
}
