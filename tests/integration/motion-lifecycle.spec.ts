import { test, expect } from "@playwright/test";

test("rapid synchronous tab changes and reduced-motion interruption honor last intent", async ({
  page,
}) => {
  await page.goto("/research/");
  await page.evaluate(() => {
    const tabs = document.querySelectorAll<HTMLButtonElement>("[role=tab]");
    tabs[1].click();
    tabs[2].click();
    tabs[0].click();
  });
  await expect(page.getByRole("tab", { name: /CVEs/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "panel-cves");
  await page.waitForTimeout(400);
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "panel-cves");
});

test("tab fallback preserves accessible content when native transitions are unavailable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.goto("/vi/research/");
  await page.getByRole("tab", { name: /Khai thác/ }).click();
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-exploits",
  );
  await expect(page.getByRole("tabpanel")).toContainText(
    "Chưa có bản khai thác",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .getByRole("tabpanel")
      .evaluate(
        (e) =>
          e.getAnimations().filter((a) => a.playState === "running").length,
      ),
  ).toBe(0);
});

test("motion-only entrances add no geometry shift after fonts are loaded", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page
    .getByRole("link", { name: "Projects", exact: true })
    .first()
    .click();
  await page.evaluate(() => document.fonts.ready);
  const card = page.locator(".project-card").first();
  await expect(card).toHaveAttribute("data-motion-state", "done");
  const before = await card.evaluate((e) => ({
    left: (e as HTMLElement).offsetLeft,
    top: (e as HTMLElement).offsetTop,
    w: e.clientWidth,
    h: e.clientHeight,
  }));
  await card.hover();
  await page.waitForTimeout(300);
  const after = await card.evaluate((e) => ({
    left: (e as HTMLElement).offsetLeft,
    top: (e as HTMLElement).offsetTop,
    w: e.clientWidth,
    h: e.clientHeight,
  }));
  expect(after).toEqual(before);
});
