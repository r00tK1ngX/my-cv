import { test, expect, type Page } from "@playwright/test";

async function actualFocus(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    return {
      tag: active?.tagName,
      classes: active?.className,
      visible: !!active?.getClientRects().length && !!active && getComputedStyle(active).visibility === "visible",
      inert: !!active?.closest("[inert]"),
      dialogCount: document.querySelectorAll('[role="dialog"]').length,
      expanded: document.querySelector(".menu-toggle")?.getAttribute("aria-expanded"),
      documentFocused: document.hasFocus(),
    };
  });
}

for (const locale of ["en", "vi"] as const) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`${locale} ${reducedMotion} controls resolves throughout closed open exit and unmount`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      const toggle = page.locator(".menu-toggle");
      await expect(toggle).not.toHaveAttribute("aria-controls");
      await expect(page.locator("#mobile-navigation")).toHaveCount(0);
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-controls", "mobile-navigation");
      await expect(page.locator("#mobile-navigation")).toHaveCount(1);
      await expect(page.getByRole("dialog")).toHaveCount(1);
      await expect(page.locator(".drawer-heading button")).toBeFocused();
      await page.evaluate(() => {
        const w = window as unknown as { exitRecords: unknown[]; exitObserver: MutationObserver };
        w.exitRecords = [];
        w.exitObserver = new MutationObserver(() => {
          const button = document.querySelector(".menu-toggle")!;
          const controls = button.getAttribute("aria-controls");
          const target = document.getElementById("mobile-navigation");
          w.exitRecords.push({ controls, count: document.querySelectorAll("#mobile-navigation").length,
            expanded: button.getAttribute("aria-expanded"), targetInert: !!target?.closest("[inert]"),
            dialogCount: document.querySelectorAll('[role="dialog"]').length });
        });
        w.exitObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-controls", "aria-expanded", "inert", "role"] });
      });
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(page.locator("#mobile-navigation")).toHaveCount(0);
      await expect(toggle).not.toHaveAttribute("aria-controls");
      const records = await page.evaluate(() => {
        const w = window as unknown as { exitRecords: { controls: string | null; count: number; expanded: string; targetInert: boolean; dialogCount: number }[]; exitObserver: MutationObserver };
        w.exitObserver.disconnect(); return w.exitRecords;
      });
      await testInfo.attach("controls-exit-observed-DOM", { body: JSON.stringify(records), contentType: "application/json" });
      expect(records.length).toBeGreaterThan(0);
      expect(records.every(r => r.controls === null ? r.count === 0 : r.controls === "mobile-navigation" && r.count === 1)).toBe(true);
      if (reducedMotion === "no-preference") expect(records.some(r => r.expanded === "false" && r.count === 1 && r.controls === "mobile-navigation" && r.targetInert && r.dialogCount === 0)).toBe(true);
      else expect(records.every(r => r.expanded !== "false" || r.count === 0)).toBe(true);
      expect(records.at(-1)).toMatchObject({ controls: null, count: 0, expanded: "false", dialogCount: 0 });
    });
    test(`${locale} ${reducedMotion} repeated reopen keeps current drawer focus and navigation intent`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      const toggle = page.locator(".menu-toggle");
      for (const delay of [0, 20, 140, 260, 330]) {
        await toggle.evaluate((e: HTMLButtonElement) => e.click());
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.locator(".drawer-heading button").click();
        if (delay) await page.waitForTimeout(delay);
        await toggle.click();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.waitForTimeout(360);
        await expect(page.getByRole("dialog")).toHaveCount(1);
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(page.locator(".mobile-drawer > .button")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(toggle).toBeFocused();
      }
      await toggle.click();
      await page.locator(`.mobile-drawer nav a[href="${locale === "vi" ? "/vi/contact/" : "/contact/"}"]`).click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(locale === "vi" ? "/vi/contact/" : "/contact/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page.waitForTimeout(100);
      expect(await toggle.evaluate(e => e === document.activeElement)).toBe(false);
      await page.locator(".language-switch").click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(locale === "vi" ? "/contact/" : "/vi/contact/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "vi" ? "en" : "vi");
    });
    test(`${locale} ${reducedMotion} unavailable opener restores a visible wordmark`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      await page.locator(".menu-toggle").click();
      await expect(page.locator(".drawer-heading button")).toBeFocused();
      await page.locator(".menu-toggle").evaluate((e: HTMLElement) => { e.style.display = "none"; });
      await page.locator(".drawer-heading button").click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator(".wordmark")).toBeFocused();
      expect(await actualFocus(page)).toMatchObject({ tag: "A", classes: "wordmark", visible: true, inert: false, dialogCount: 0 });
    });
    test(`${locale} ${reducedMotion} delayed real restoration cannot override newer valid focus or reopened drawer`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      // Scheduler diagnostic: retain real callbacks, never substitute focus results.
      await page.addInitScript(() => {
        const native = requestAnimationFrame.bind(window);
        const w = window as unknown as { holdRestore: boolean; restoreFrames: FrameRequestCallback[] };
        w.restoreFrames = [];
        window.requestAnimationFrame = callback => {
          if (w.holdRestore && callback.toString().includes("focus")) { w.restoreFrames.push(callback); return 987654; }
          return native(callback);
        };
      });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      const toggle = page.locator(".menu-toggle");
      for (const reopen of [false, true]) {
        await toggle.click();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.evaluate(() => { (window as unknown as { holdRestore: boolean }).holdRestore = true; });
        await page.keyboard.press("Escape");
        await expect.poll(() => page.evaluate(() => (window as unknown as { restoreFrames: unknown[] }).restoreFrames.length)).toBeGreaterThan(0);
        if (reopen) {
          await toggle.evaluate((e: HTMLButtonElement) => e.click());
          await expect(page.locator(".drawer-heading button")).toBeFocused();
        } else await page.locator(".language-switch").focus();
        await page.evaluate(() => {
          const w = window as unknown as { holdRestore: boolean; restoreFrames: FrameRequestCallback[] };
          w.holdRestore = false;
          w.restoreFrames.splice(0).forEach(callback => callback(performance.now()));
        });
        if (reopen) {
          await expect(page.getByRole("dialog")).toHaveCount(1);
          await expect(page.locator(".drawer-heading button")).toBeFocused();
          await page.keyboard.press("Escape");
          await expect(toggle).toBeFocused();
        } else {
          await expect(page.getByRole("dialog")).toHaveCount(0);
          await expect(page.locator(".language-switch")).toBeFocused();
        }
      }
    });
    test(`${locale} ${reducedMotion} IR-01 dismissal then desktop resize restores visible fallback without stealing valid focus`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
      await page.bringToFront();
      const toggle = page.locator(".menu-toggle");
      for (const waitForExit of [false, true]) {
        await toggle.click();
        await expect(page.locator(".drawer-heading button")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(toggle).toBeFocused();
        if (waitForExit) await expect(page.locator("#mobile-navigation")).toHaveCount(0);
        await page.setViewportSize({ width: 1180, height: 900 });
        await expect(page.locator(".wordmark")).toBeFocused();
        await expect(toggle).toBeHidden();
        const observed = await actualFocus(page);
        await testInfo.attach(`IR-01-breakpoint-${waitForExit}`, { body: JSON.stringify(observed), contentType: "application/json" });
        expect(observed).toMatchObject({ tag: "A", classes: "wordmark", visible: true, inert: false, dialogCount: 0, expanded: "false" });
        await page.keyboard.press("Tab");
        await expect(page.locator(".desktop-nav a").first()).toBeFocused();
        await page.setViewportSize({ width: 390, height: 844 });
      }
      await toggle.click();
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await page.locator(".language-switch").focus();
      await page.setViewportSize({ width: 1180, height: 900 });
      await expect(page.locator(".language-switch")).toBeFocused();
      expect((await actualFocus(page)).visible).toBe(true);
    });
    for (const initiallyFocused of [true, false]) {
      for (const dismissal of ["drawer-close", "backdrop"] as const) {
        test(`${locale} ${reducedMotion} IR-02 ${dismissal} restores visible opener; initiallyFocused=${initiallyFocused}`, async ({ page }, testInfo) => {
          await page.setViewportSize({ width: 390, height: 844 });
          await page.emulateMedia({ reducedMotion });
          await page.goto(locale === "vi" ? "/vi/about/" : "/about/");
          await page.bringToFront();
          const toggle = page.locator(".menu-toggle");
          for (let cycle = 0; cycle < 2; cycle++) {
            if (initiallyFocused) {
              await toggle.focus();
              await page.keyboard.press("Enter");
            } else {
              // DOM activation intentionally does not transfer input-method focus.
              if (cycle === 0) await page.evaluate(() => { (document.activeElement as HTMLElement).blur(); });
              else await page.locator(".language-switch").focus();
              expect(await toggle.evaluate(e => e === document.activeElement)).toBe(false);
              await toggle.evaluate((e: HTMLButtonElement) => e.click());
            }
            await expect(page.getByRole("dialog")).toHaveCount(1);
            await expect(page.locator(".drawer-heading button")).toBeFocused();
            if (dismissal === "drawer-close") await page.locator(".drawer-heading button").click();
            else await page.mouse.click(200, 810);
            await expect(page.getByRole("dialog")).toHaveCount(0);
            await expect(toggle).toBeFocused();
            const observed = await actualFocus(page);
            await testInfo.attach(`IR-02-focus-${cycle}`, { body: JSON.stringify(observed), contentType: "application/json" });
            expect(observed).toMatchObject({ tag: "BUTTON", classes: "menu-toggle", visible: true, inert: false, dialogCount: 0, expanded: "false", documentFocused: true });
            await expect(page.locator("#mobile-navigation")).toHaveCount(0);
          }
        });
      }
    }
  }
}
