import { expect, test, type Page } from "@playwright/test";

const keys = ["cves", "exploits", "bounties"] as const;
const headings = {
  en: ["No published CVE entries yet", "No published exploit entries yet", "No published bug bounty entries yet"],
  vi: ["Chưa có CVE được công bố", "Chưa có bản khai thác được công bố", "Chưa có báo cáo bug bounty được công bố"],
};

async function frameProbe(page: Page) {
  return page.evaluateHandle(() => {
    const frames: { selected: string; selectedCount: number; panel: string; label: string; text: string; opacity: number; phase: string; count: number; at: number }[] = [];
    let running = true;
    const snapshot = () => {
      const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');
      const panel = panels[0];
      const selections = document.querySelectorAll('[role="tab"][aria-selected="true"]');
      const selected = selections[0];
      frames.push({
        selected: selected?.id || "MISSING", selectedCount: selections.length, panel: panel?.id || "MISSING", label: panel?.getAttribute("aria-labelledby") || "",
        text: panel?.querySelector("h2")?.textContent || "", opacity: panel ? Number(getComputedStyle(panel).opacity) : 0,
        phase: panel?.dataset.motionPhase || "", count: panels.length, at: performance.now(),
      });
      if (running) requestAnimationFrame(snapshot);
    };
    snapshot();
    return { frames, stop: () => { running = false; return frames; } };
  });
}

for (const locale of ["en", "vi"] as const) {
  test(`${locale}: every sampled frame keeps selected tab, active panel and rendered content together`, async ({ page }) => {
    await page.goto(locale === "en" ? "/research/" : "/vi/research/");
    await expect(page.locator(".research-tabs")).toHaveAttribute("data-motion-state", "done");
    const probe = await frameProbe(page);
    for (const key of ["exploits", "bounties", "cves", "bounties", "exploits", "cves"]) {
      await page.locator(`#tab-${key}`).click();
      await expect(page.locator('[role="tabpanel"] h2')).toHaveText(headings[locale][keys.indexOf(key as typeof keys[number])]);
      await expect(page.locator('[role="tabpanel"]')).toHaveAttribute("data-motion-phase", "idle");
      await page.locator(`#tab-${key}`).dblclick();
    }
    const frames = await probe.evaluate(x => x.stop());
    const mismatch = frames.filter(f => {
      const key = f.selected.replace("tab-", "");
      const index = keys.indexOf(key as typeof keys[number]);
      return index < 0 || f.count !== 1 || f.selectedCount !== 1 || f.panel !== `panel-${key}` || f.label !== f.selected || f.text !== headings[locale][index];
    });
    expect(frames.length).toBeGreaterThan(10);
    expect(mismatch).toEqual([]);
    expect(frames.some(f => f.phase === "exit" && f.opacity < 0.9)).toBe(true);
    expect(frames.some(f => f.phase === "enter" && f.opacity < 0.9)).toBe(true);
    await probe.dispose();
  });

  test(`${locale}: rapid clicks, repeats, keyboard and live reduced motion honor the last request`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(locale === "en" ? "/research/" : "/vi/research/");
    await expect(page.locator(".research-tabs")).toHaveAttribute("data-motion-state", "done");
    const probe = await frameProbe(page);
    await page.evaluate(() => {
      for (const key of ["exploits", "bounties", "cves", "exploits", "bounties", "bounties"]) document.querySelector<HTMLButtonElement>(`#tab-${key}`)!.click();
    });
    await expect(page.locator('[role="tabpanel"]')).toHaveAttribute("id", "panel-bounties");
    await expect(page.locator('[role="tabpanel"] h2')).toHaveText(headings[locale][2]);
    await expect(page.locator('[role="tabpanel"]')).toHaveAttribute("data-motion-phase", "idle");
    await page.locator("#tab-bounties").focus();
    await page.keyboard.press("Home");
    await expect(page.locator("#tab-cves")).toBeFocused();
    await expect(page.locator('[role="tabpanel"] h2')).toHaveText(headings[locale][0]);
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#tab-bounties")).toBeFocused();
    await expect(page.locator('[role="tabpanel"] h2')).toHaveText(headings[locale][2]);
    await page.keyboard.press("ArrowRight");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator('[role="tabpanel"]')).toHaveAttribute("id", "panel-cves");
    await expect(page.locator('[role="tabpanel"]')).toHaveAttribute("data-motion-phase", "idle");
    await page.locator("#tab-exploits").click();
    await expect(page.locator('[role="tabpanel"] h2')).toHaveText(headings[locale][1]);
    const frames = await probe.evaluate(x => x.stop());
    expect(frames.filter(f => f.panel !== f.selected.replace("tab-", "panel-") || f.label !== f.selected || f.count !== 1 || f.selectedCount !== 1)).toEqual([]);
    expect(errors).toEqual([]);
    await probe.dispose();
  });
}
