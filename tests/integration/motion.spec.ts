import { test, expect } from "@playwright/test";

test("below-fold reveals wait for viewport, settle once, and hover still owns card lift", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("#projects .project-card").first();
  await expect(card).toHaveAttribute("data-motion-state", "pending");
  await page.waitForTimeout(950);
  await expect(card).toHaveAttribute("data-motion-state", "pending");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-motion-state", "done");
  await card.hover();
  await expect
    .poll(() =>
      card.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42),
    )
    .toBeLessThan(-3);
  await page.mouse.move(0, 0);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(card).toHaveAttribute("data-motion-state", "done");
});

test("hero has ordered roles without changing approved settled geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/vi/");
  const copy = page.locator(".hero-copy"),
    visual = page.locator(".hero-visual");
  await expect(copy).toHaveAttribute("data-motion-role", "hero-copy");
  await expect(visual).toHaveAttribute("data-motion-role", "hero-visual");
  await expect(visual).toHaveAttribute("data-motion-state", "done");
  const scale = await visual.evaluate(
    (e) => new DOMMatrix(getComputedStyle(e).transform).a,
  );
  expect(scale).toBeCloseTo(1, 2);
});

test("drawer retains only a noninteractive exit and cancels it on rapid reopen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  await toggle.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close menu" })
    .click();
  await expect(page.locator(".mobile-overlay")).toHaveAttribute(
    "data-state",
    "closing",
  );
  await expect(page.locator(".mobile-overlay")).toHaveAttribute("inert", "");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".mobile-overlay")).toHaveAttribute(
    "data-state",
    "open",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-overlay")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("particles pause outside hero and resume without jump", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    (window as unknown as { draws: number }).draws = 0;
    CanvasRenderingContext2D.prototype.clearRect = function (
      ...args: Parameters<typeof clear>
    ) {
      if (this.canvas.classList.contains("particle-canvas"))
        (window as unknown as { draws: number }).draws++;
      return clear.apply(this, args);
    };
  });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { draws: number }).draws),
    )
    .toBeGreaterThan(5);
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(200);
  const paused = await page.evaluate(
    () => (window as unknown as { draws: number }).draws,
  );
  await page.waitForTimeout(250);
  expect(
    await page.evaluate(() => (window as unknown as { draws: number }).draws),
  ).toBe(paused);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { draws: number }).draws),
    )
    .toBeGreaterThan(paused + 2);
});

test("reduced motion reveals all content immediately and skips drawer exit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/vi/");
  await expect(page.locator(".hero-copy")).toHaveAttribute(
    "data-motion-state",
    "done",
  );
  const pending = page.locator('[data-motion-state="pending"]');
  await expect(pending).toHaveCount(0);
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-overlay")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(pending).toHaveCount(0);
});

test("research rapid switches keep final category and clean up the CSS phase", async ({
  page,
}) => {
  await page.goto("/research/");
  await expect(page.locator(".research-panel")).toHaveCSS(
    "view-transition-name",
    "none",
  );
  await page.getByRole("tab", { name: /Exploits/ }).click();
  await page.getByRole("tab", { name: /Bug bounties/ }).click();
  await expect(page.getByRole("tab", { name: /Bug bounties/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText(
    "No published bug bounty entries yet",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("tab", { name: /CVEs/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "No published CVE entries yet",
  );
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.getByRole("tabpanel")).toHaveAttribute("data-motion-phase", "idle");
});
