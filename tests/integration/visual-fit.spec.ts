import { test, expect } from "@playwright/test";
for (const width of [360, 390, 768, 1366])
  test(`hero text badges stay within viewport ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const badge of await page.locator(".float-tag").all()) {
      const box = await badge.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  });
