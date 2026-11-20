import { test, expect } from "@playwright/test";
test("opening drawer keeps both surface layers fully visible during the slide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".hero-copy")).toHaveAttribute(
    "data-motion-role",
    "hero-copy",
  );
  const sample = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>(".menu-toggle")!.click();
    return new Promise<{ overlay: string; drawer: string; sliding: boolean }>(
      (resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const overlay = document.querySelector(".mobile-overlay")!;
            const drawer = overlay.querySelector(".mobile-drawer")!;
            const style = getComputedStyle(drawer);
            resolve({
              overlay: getComputedStyle(overlay).opacity,
              drawer: style.opacity,
              sliding: style.transform !== "none",
            });
          }),
        ),
    );
  });
  expect(sample).toEqual({ overlay: "1", drawer: "1", sliding: true });
});
