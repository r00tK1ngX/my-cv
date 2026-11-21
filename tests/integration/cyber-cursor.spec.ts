import { test, expect } from "@playwright/test";

const cursor = ".cyber-cursor";
const desktop = { width: 1440, height: 900 };
const ready = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.bringToFront();
  await page.waitForFunction(() => document.querySelector(".cyber-cursor"));
  await page.mouse.move(600, 200);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
};

test.use({ viewport: desktop, reducedMotion: "no-preference" });

test("cursor: immediate core, delayed ring, bounded trail settles and sleeps", async ({ page }) => {
  await ready(page);
  const values = await page.evaluate(() => {
    document.body.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: 800, clientY: 240 }));
    const part = (name: string) => document.querySelector<HTMLElement>(`.cyber-cursor__${name}`)!;
    return { core: parseFloat(part("core").style.getPropertyValue("--cursor-x")), ring: parseFloat(part("ring").style.getPropertyValue("--cursor-x")) };
  });
  expect(values.core).toBe(800);
  expect(values.ring).toBeLessThan(800);
  await expect.poll(() => page.locator(".cyber-cursor__ring").evaluate(e => parseFloat((e as HTMLElement).style.getPropertyValue("--cursor-x")))).toBeCloseTo(800, 0);
  await page.waitForTimeout(1600);
  const mutations = await page.locator(cursor).evaluate(async element => {
    let changes = 0;
    const observer = new MutationObserver(records => changes += records.length);
    observer.observe(element, { attributes: true, subtree: true, childList: true });
    await new Promise(resolve => setTimeout(resolve, 160));
    observer.disconnect();
    return changes;
  });
  expect(mutations).toBe(0);
  expect(await page.locator(".cyber-cursor__trail").count()).toBe(3);
});

test("cursor: semantic link/button/image states, custom override, click ripple does not block", async ({ page }) => {
  await ready(page);
  const link = page.locator(".desktop-nav a").first();
  await link.hover();
  await expect(page.locator(cursor)).toHaveAttribute("data-state", "interactive");
  const button = page.locator(".hero-buttons a.button").first();
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator(cursor)).toHaveAttribute("data-state", "button");
  await page.mouse.down();
  await expect(page.locator(cursor)).toHaveAttribute("data-state", "pressed");
  await expect.poll(() => page.locator(".cyber-cursor__ripple > i").evaluate(e => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0);
  await page.mouse.up();
  await expect(page).toHaveURL(/#projects$/);
  await page.goto("/");
  await expect(page.locator(".hero-portrait")).toBeVisible();
  await page.waitForFunction(() => document.querySelector(".hero-visual")?.getAttribute("data-motion-state") === "done");
  const avatar = (await page.locator(".hero-portrait").boundingBox())!;
  await page.mouse.move(avatar.x + avatar.width / 2, avatar.y + avatar.height / 2);
  await expect(page.locator(cursor)).toHaveAttribute("data-state", "image");
  await page.evaluate(() => document.querySelector(".hero-description")!.setAttribute("data-cursor", "interactive"));
  await page.locator(".hero-description").hover();
  await expect(page.locator(cursor)).toHaveAttribute("data-state", "interactive");
  expect(await page.locator(cursor).evaluate(e => getComputedStyle(e).pointerEvents)).toBe("none");
});

test("cursor: editing, disabled controls and drag use native pointer, input/selection still work", async ({ page }) => {
  await page.goto("/contact/");
  await page.mouse.move(600, 150);
  const input = page.locator("#contact-name");
  await input.hover();
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  expect(await input.evaluate(e => getComputedStyle(e).cursor)).toBe("text");
  await input.fill("Cursor selection test");
  await input.press("Control+a");
  expect(await input.evaluate(e => (e as HTMLInputElement).selectionEnd)).toBe("Cursor selection test".length);
  await page.evaluate(() => {
    const fixture = document.createElement("button");
    fixture.id = "disabled-cursor-fixture";
    fixture.disabled = true;
    fixture.textContent = "Disabled test control";
    fixture.style.cssText = "position:fixed;left:350px;top:150px;z-index:2000";
    document.body.append(fixture);
  });
  const disabled = (await page.locator("#disabled-cursor-fixture").boundingBox())!;
  await page.mouse.move(disabled.x + 10, disabled.y + 10);
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  expect(await page.locator("#disabled-cursor-fixture").evaluate(e => getComputedStyle(e).cursor)).toBe("not-allowed");
  await page.mouse.move(700, 200);
  await page.evaluate(() => document.dispatchEvent(new DragEvent("dragstart", { bubbles: true })));
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
});

test("cursor: leaving, keyboard, live reduced motion and mobile breakpoint restore native pointer", async ({ page }) => {
  await ready(page);
  await page.keyboard.press("Tab");
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  await page.mouse.move(650, 200);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  expect(await page.locator(cursor).evaluate(e => getComputedStyle(e).display)).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(600, 220);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  await page.setViewportSize(desktop);
  await page.mouse.move(680, 240);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
  await page.mouse.move(-10, -10);
  await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
  await page.mouse.move(800, 200);
  await expect(page.locator(cursor)).toHaveAttribute("data-active", "true");
});

for (const locale of ["en", "vi"] as const) {
  test(`cursor: ${locale} mobile touch retains native behavior`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(locale === "en" ? "/" : "/vi/");
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.mouse.move(250, 250);
    await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
    expect(await page.locator(cursor).evaluate(e => getComputedStyle(e).display)).toBe("none");
    await page.locator(".menu-toggle").tap();
    await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("dialog").locator("button").first().tap();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const previous = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(previous);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("cursor: initial reduced motion, missing stylesheet and JS-disabled keep native cursor", async ({ browser }) => {
  for (const scenario of ["reduce", "missing-css", "no-js"] as const) {
    const context = await browser.newContext({ viewport: desktop, reducedMotion: scenario === "reduce" ? "reduce" : "no-preference", javaScriptEnabled: scenario !== "no-js" });
    if (scenario === "missing-css") await context.route("**/*.css", route => route.abort());
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/vi/", { waitUntil: "networkidle" });
    await page.mouse.move(700, 200);
    await expect(page.locator("html")).not.toHaveAttribute("data-cyber-cursor", "ready");
    expect(await page.locator("body").evaluate(e => getComputedStyle(e).cursor)).not.toBe("none");
    expect(await page.locator(cursor).evaluate(e => getComputedStyle(e).visibility)).toBe("hidden");
    expect(errors).toEqual([]);
    await context.close();
  }
});

test("cursor: EN/VI navigation keeps one overlay, approved avatar and clean hydration", async ({ page }) => {
  const errors: string[] = [];
  const failures: string[] = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  page.on("requestfailed", request => failures.push(request.url()));
  await ready(page);
  await expect(page.locator(cursor)).toHaveCount(1);
  await page.locator(".desktop-nav a").first().click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.mouse.move(700, 200);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
  await expect(page.locator(cursor)).toHaveCount(1);
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/vi\/about\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await page.locator(".wordmark").click();
  await expect(page).toHaveURL(/\/vi\/$/);
  await expect(page.locator(".hero-portrait")).toHaveAttribute("src", "/images/chau-anh-dung-avatar.webp");
  await page.mouse.move(700, 200);
  await expect(page.locator("html")).toHaveAttribute("data-cyber-cursor", "ready");
  expect(await page.locator(".hero-portrait").evaluate(e => (e as HTMLImageElement).naturalWidth)).toBe(512);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
