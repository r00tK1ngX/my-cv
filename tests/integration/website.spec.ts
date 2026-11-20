import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  pageKeys,
  routeFor,
  equivalentRoute,
  siteOrigin,
} from "../../src/lib/routes";
for (const locale of ["en", "vi"] as const)
  for (const key of pageKeys) {
    test(`${locale} ${key}: direct static route, refresh, metadata, equivalent language`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(routeFor(locale, key));
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        siteOrigin + routeFor(locale, key),
      );
      await expect(page.locator(".language-switch")).toHaveAttribute(
        "href",
        equivalentRoute(routeFor(locale, key)),
      );
      await page.reload();
      await expect(page.locator("h1")).toBeVisible();
      await page.locator(".language-switch").click();
      await expect(page).toHaveURL(
        new RegExp(equivalentRoute(routeFor(locale, key)) + "$"),
      );
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale === "en" ? "vi" : "en",
      );
      expect(errors).toEqual([]);
    });
  }
test("desktop navigation changes all page routes and active states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const key of pageKeys.filter((k) => k !== "home")) {
    await page
      .locator(".desktop-nav")
      .getByRole("link", {
        name: key[0].toUpperCase() + key.slice(1),
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp("/" + key + "/$"));
    await expect(page.locator(".desktop-nav [aria-current=page]")).toHaveCount(
      1,
    );
  }
  await page.locator(".wordmark").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".hero-name")).toBeVisible();
});
test("mobile menu closes on Escape, traps focus and releases scroll across breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await toggle.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await toggle.click();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Get in touch", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Research", exact: true })
    .click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
for (const locale of ["en", "vi"] as const)
  test(`${locale}: Research tabs click and keyboard filter state`, async ({
    page,
  }) => {
    await page.goto(routeFor(locale, "research"));
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toBeVisible();
      await expect(page.getByRole("tabpanel").locator("h2")).toContainText(
        locale === "en" ? "No published" : "Chưa có",
      );
    }
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toBeFocused();
  });
test("contact native validation, encoded mailto and no network delivery", async ({
  page,
}) => {
  await page.goto("/contact/");
  let delivered = false;
  page.on("request", (req) => {
    if (req.method() === "POST") delivered = true;
  });
  await page.getByRole("button", { name: "Open email app" }).click();
  expect(
    await page
      .locator("#contact-name")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  await page.locator("#contact-name").fill("QA Example");
  await page.locator("#contact-email").fill("qa@example.com");
  await page.locator("#contact-subject").fill("Internship & learning");
  await page.locator("#contact-message").fill("Local QA draft only.");
  await page.getByRole("button", { name: "Open email app" }).click();
  await expect(page.getByRole("status")).toContainText("Draft prepared");
  await expect(
    page.getByRole("link", { name: "Open draft again" }),
  ).toHaveAttribute(
    "href",
    /^mailto:chauanhdung@gmail.com\?subject=Internship%20%26%20learning&body=/,
  );
  expect(delivered).toBe(false);
  await expect(
    page.getByRole("link", { name: "LinkedIn Châu Anh Dũng", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/anh-d%C5%A9ng-ch%C3%A2u-533b98364/",
  );
});
for (const width of [360, 390, 768, 1366, 1440])
  test(`all routes have no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 640 ? 844 : 900 });
    for (const locale of ["en", "vi"] as const)
      for (const key of pageKeys) {
        await page.goto(routeFor(locale, key));
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${locale} ${key}`,
        ).toBe(true);
      }
  });
test("home anchors land and no external runtime resources are required", async ({
  page,
}) => {
  const failures: string[] = [];
  const external: string[] = [];
  page.on("request", (r) => {
    if (
      r.url().startsWith("http") &&
      !r.url().startsWith("http://127.0.0.1:4173/")
    )
      external.push(r.url());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  await page.goto("/");
  await page
    .getByRole("link", { name: "⬡ View projects", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
  expect(failures).toEqual([]);
  expect(external).toEqual([]);
});
test("missing page returns 404 and accessible return-home link", async ({
  page,
}) => {
  const r = await page.goto("/does-not-exist/");
  expect(r?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await page.getByRole("link", { name: "Return home" }).click();
  await expect(page.locator(".hero-name")).toBeVisible();
});
for (const locale of ["en", "vi"] as const)
  for (const key of pageKeys)
    test(`axe WCAG AA ${locale} ${key}`, async ({ page }) => {
      await page.goto(routeFor(locale, key));
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    });
