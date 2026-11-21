import { test, expect } from "@playwright/test";

test("Orbital nodes: static connectors stay behind capsules and outside the HUD at layout boundaries", async ({ page }) => {
  await page.goto("/");
  await page.bringToFront();
  await page.locator(".hero-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-visual")).toHaveAttribute("data-motion-state", "done");
  for (const width of [320, 390, 639, 640, 899, 900, 1279, 1280, 1440, 1519, 1599, 1600, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".hero-visual").scrollIntoViewIfNeeded();
    const links = await page.locator(".node-link").evaluateAll(elements => {
      const core = document.querySelector(".home-identity-core")!.getBoundingClientRect();
      const cx = core.x + core.width / 2, cy = core.y + core.height / 2, radius = core.width * 202 / 420;
      return elements.map(e => {
        const style = getComputedStyle(e), path = e.querySelector("path")!, length = path.getTotalLength();
        const circle = e.querySelector("circle")!;
        const matrix = (e as SVGGraphicsElement).getScreenCTM()!;
        const gaps = Array.from({ length: 21 }, (_, i) => {
          const p = path.getPointAtLength(length * i / 20), viewport = new DOMPoint(p.x, p.y).matrixTransform(matrix);
          return Math.hypot(viewport.x - cx, viewport.y - cy) - radius;
        });
        const anchor = new DOMPoint(Number(circle.getAttribute("cx")), Number(circle.getAttribute("cy"))).matrixTransform(matrix);
        return { display: style.display, z: style.zIndex, pointer: style.pointerEvents, animation: style.animationName, stroke: style.stroke,
          color: getComputedStyle(e.parentElement!).color, hidden: e.getAttribute("aria-hidden"), focusable: e.getAttribute("focusable"),
          minGap: Math.min(...gaps), anchorGap: Math.hypot(anchor.x - cx, anchor.y - cy) - radius };
      });
    });
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link.display).toBe(width >= 1280 && width <= 1599 ? "block" : "none");
      expect(link.animation).toBe("none"); expect(link.pointer).toBe("none"); expect(link.z).toBe("-1");
      expect(link.stroke).toBe(link.color); expect(link.hidden).toBe("true"); expect(link.focusable).toBe("false");
      if (link.display !== "none") {
        expect(link.minGap, `${width}px connector enters full HUD envelope`).toBeGreaterThanOrEqual(3);
        expect(link.anchorGap, `${width}px endpoint enters full HUD envelope`).toBeGreaterThanOrEqual(3);
      }
    }
  }
});
