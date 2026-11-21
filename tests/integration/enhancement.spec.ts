import { test, expect } from "@playwright/test";
test("reduced motion and no-JavaScript keep core content and all static routes accessible", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-name")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Chuyển sang Tiếng Việt" }),
  ).toBeVisible();
  await page.goto("/research/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("tabpanel")).toBeVisible();
  await context.close();
});
test("typewriter advances and reduced-motion CSS disables decorative animation", async ({
  page,
}) => {
  await page.goto("/");
  const first = await page
    .locator(".type-line [aria-hidden=true]")
    .nth(1)
    .innerText();
  await expect
    .poll(
      async () =>
        page.locator(".type-line [aria-hidden=true]").nth(1).innerText(),
      { timeout: 6000 },
    )
    .not.toBe(first);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".orbit").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});
