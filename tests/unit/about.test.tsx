import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("About describes student baseline without unsupported professional roles", async () => {
  assert.ok(existsSync("src/components/about-page.tsx"), "About page missing");
  const { AboutPage } = await import("../../src/components/about-page");
  const html = renderToStaticMarkup(<AboutPage locale="en" />);
  assert.match(html, /Châu Anh Dũng/);
  assert.match(html, /Duy Tan University/);
  assert.match(html, /PWN/);
  assert.match(html, /AI &amp; Security Automation/);
  assert.doesNotMatch(
    html,
    /junior penetration tester|CVE researcher|professional penetration|R&amp;D Intern/i,
  );
  const vi = renderToStaticMarkup(<AboutPage locale="vi" />);
  assert.match(vi, /Đại học Duy Tân/);
  assert.match(vi, /Đà Nẵng/);
});

for (const locale of ["en", "vi"] as const) {
  test(`About ${locale} reuses the approved portrait inside a decorative identity HUD`, async () => {
    const { AboutPage } = await import("../../src/components/about-page");
    const html = renderToStaticMarkup(<AboutPage locale={locale} />);
    const visual = html.match(/<div class="about-avatar" aria-hidden="true">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(visual, "Preserve the existing decorative About visual");
    assert.match(visual, /<svg\b[^>]*class="identity-hud"[^>]*viewBox="0 0 288 288"[^>]*focusable="false"/);
    assert.match(visual, /class="identity-core"/);
    assert.match(visual, /class="identity-hud identity-inner"/);
    assert.match(visual, /class="identity-hud identity-orbit"/);
    assert.match(visual, /class="identity-hud identity-scan"/);
    const brackets = visual.match(/<g class="identity-brackets">([\s\S]*?)<\/g>/)?.[1];
    assert.equal((brackets?.match(/<path\b/g) ?? []).length, 4);
    const ticks = visual.match(/<g class="identity-ticks">([\s\S]*?)<\/g>/)?.[1];
    assert.equal((ticks?.match(/<path\b/g) ?? []).length, 24);
    assert.equal((visual.match(/class="identity-marker"/g) ?? []).length, 2);
    assert.doesNotMatch(visual, /<text\b|<animate\b|<script\b|<filter\b|tabindex=|<button\b|<a\b/);
    assert.match(visual, /<img\b[^>]*class="about-portrait"/);
    assert.match(visual, /src="\/images\/chau-anh-dung-avatar\.webp"/);
    assert.match(visual, /width="512"/);
    assert.match(visual, /height="512"/);
    assert.match(visual, /alt=""/);
    assert.match(visual, /loading="eager"/);
    assert.doesNotMatch(visual, /<b>CAD<\/b>|\/_next\/image/);
  });
}
