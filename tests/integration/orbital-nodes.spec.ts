import { test, expect } from "@playwright/test";

test("Tactical HUD markers: no marker overlaps another marker or enters the HUD ring across viewports", async ({ page }) => {
  await page.goto("/");
  await page.bringToFront();
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
  for (const width of [320, 390, 639, 640, 768, 900, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".hero-visual").scrollIntoViewIfNeeded();
    const result = await page.evaluate(() => {
      const core = document.querySelector(".home-identity-core")!.getBoundingClientRect();
      const cx = core.x + core.width / 2;
      const cy = core.y + core.height / 2;
      const radius = (core.width * 202) / 420;
      const plates = [...document.querySelectorAll(".hud-marker-plate")].map(el => {
        const r = el.getBoundingClientRect();
        const dx = Math.max(r.x - cx, 0, cx - r.right);
        const dy = Math.max(r.y - cy, 0, cy - r.bottom);
        return {
          text: el.textContent,
          x: r.x,
          y: r.y,
          right: r.right,
          bottom: r.bottom,
          gap: Math.hypot(dx, dy) - radius,
        };
      });
      let overlaps = 0;
      for (let i = 0; i < plates.length; i++) {
        for (let j = i + 1; j < plates.length; j++) {
          const a = plates[i], b = plates[j];
          if (a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y) overlaps++;
        }
      }
      return { plates, overlaps };
    });
    expect(result.plates).toHaveLength(5);
    expect(result.overlaps, `${width}px marker overlap`).toBe(0);
    for (const plate of result.plates) {
      expect(plate.x, `${width}px ${plate.text} left`).toBeGreaterThanOrEqual(0);
      expect(plate.right, `${width}px ${plate.text} right`).toBeLessThanOrEqual(width);
      expect(plate.gap, `${width}px ${plate.text} HUD gap`).toBeGreaterThanOrEqual(3);
    }
  }
});
