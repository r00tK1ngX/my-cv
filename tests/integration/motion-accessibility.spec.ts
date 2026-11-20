import { test, expect } from "@playwright/test";
import { pageKeys, routeFor } from "../../src/lib/routes";

for (const locale of ["en", "vi"] as const)
  test(`reduced motion preserves all8 ${locale} pages across4 viewports`, async ({
    browser,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 360, height: 800 },
    ]) {
      const context = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const key of pageKeys) {
        const response = await page.goto(routeFor(locale, key));
        expect(response?.status()).toBe(200);
        await expect(page.locator("main h1")).toBeVisible();
        await expect(
          page.locator(
            'main [data-motion-state="pending"],main [data-motion-state="entering"]',
          ),
        ).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect(
          await page.evaluate(
            () =>
              document.getAnimations().filter((a) => a.playState === "running")
                .length,
          ),
        ).toBe(0);
      }
      expect(errors).toEqual([]);
      await context.close();
    }
  });

test("keyboard focus exposes ready controls without waiting for entrance", async ({
  page,
}) => {
  await page.goto("/projects/");
  const code = page.locator(".project-links a").first();
  await code.focus();
  await expect(code).toBeFocused();
  await expect(page.locator(".project-card").first()).toHaveAttribute(
    "data-motion-state",
    "done",
  );
  expect(await code.evaluate((e) => getComputedStyle(e).outlineStyle)).not.toBe(
    "none",
  );
});

test("reduced motion suppresses positional hover and press effects while keeping controls visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/");
  const card = page.locator(".project-card").first();
  await card.hover();
  await expect(card).toHaveCSS("transform", "none");
  await expect(card.locator(".project-visual svg")).toHaveCSS(
    "transform",
    "none",
  );
  const locale = page.locator(".language-switch");
  await locale.hover();
  await page.mouse.down();
  try {
    await expect(locale).toHaveCSS("transform", "none");
  } finally {
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
});

test("desktop CTA press overrides its hover lift", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator(".hero-buttons > .button").first();
  const y = () =>
    cta.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await cta.hover();
  await expect.poll(y).toBeLessThan(-1);
  await page.mouse.down();
  try {
    await expect.poll(y, { timeout: 1000 }).toBeGreaterThan(0.5);
  } finally {
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
});

test("typewriter restores the full label when the media change listener is delayed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const match = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      const media = match(query);
      if (query.includes("prefers-reduced-motion")) {
        // Withhold the notification; the browser still updates `matches` normally.
        Object.defineProperty(media, "addEventListener", { value: () => {} });
      }
      return media;
    };
  });
  await page.goto("/");
  await page.bringToFront();
  const label = page.locator('.type-line > span[aria-hidden="true"]').last();
  await expect
    .poll(() => label.innerText(), { timeout: 8000 })
    .not.toBe("Cybersecurity Student");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    )
    .toBe(true);
  await expect(label).toHaveText("Cybersecurity Student", { timeout: 3000 });
});

test("tab transition can be interrupted by reduced motion without losing intent", async ({
  page,
}) => {
  await page.goto("/research/");
  await page.getByRole("tab", { name: /Exploits/ }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-exploits",
  );
  await page.waitForTimeout(100);
  expect(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
  ).toBe(0);
});
