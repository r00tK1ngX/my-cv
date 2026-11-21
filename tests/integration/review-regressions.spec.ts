import { test, expect } from "@playwright/test";

test("runtime reduced-motion changes stop and restart typewriter and canvas work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.clearRect;
    (window as unknown as { particleDraws: number }).particleDraws = 0;
    CanvasRenderingContext2D.prototype.clearRect = function (
      ...args: Parameters<typeof original>
    ) {
      if (this.canvas.classList.contains("particle-canvas"))
        (window as unknown as { particleDraws: number }).particleDraws++;
      return original.apply(this, args);
    };
  });
  await page.goto("/");
  const typed = page.locator('.type-line > span[aria-hidden="true"]').last();
  await expect
    .poll(() => typed.innerText(), { timeout: 6500 })
    .not.toBe("Cybersecurity Student");
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { particleDraws: number }).particleDraws,
      ),
    )
    .toBeGreaterThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(typed).toHaveText("Cybersecurity Student");
  await page.waitForTimeout(150);
  const count = await page.evaluate(
    () => (window as unknown as { particleDraws: number }).particleDraws,
  );
  await page.waitForTimeout(350);
  expect(
    await page.evaluate(
      () => (window as unknown as { particleDraws: number }).particleDraws,
    ),
  ).toBe(count);
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { particleDraws: number }).particleDraws,
      ),
    )
    .toBeGreaterThan(count);
  const resized = await page.evaluate(
    () => (window as unknown as { particleDraws: number }).particleDraws,
  );
  await page.waitForTimeout(200);
  expect(
    await page.evaluate(
      () => (window as unknown as { particleDraws: number }).particleDraws,
    ),
  ).toBe(resized);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { particleDraws: number }).particleDraws,
      ),
    )
    .toBeGreaterThan(resized + 2);
});

test("mobile primary navigation works without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Static navigation", exact: true })
    .getByRole("link", { name: "Skills", exact: true })
    .click();
  await expect(page).toHaveURL(/\/skills\/$/);
  await page.locator(".language-switch").click();
  await page
    .getByRole("navigation", { name: "Điều hướng tĩnh", exact: true })
    .getByRole("link", { name: "Dự án", exact: true })
    .click();
  await expect(page).toHaveURL(/\/vi\/projects\/$/);
  await context.close();
});
