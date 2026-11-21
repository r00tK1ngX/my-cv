import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("home hero has approved identity and reference section anchors", async () => {
  assert.ok(existsSync("src/components/home-page.tsx"), "Home hero missing");
  const { HomePage } = await import("../../src/components/home-page");
  const html = renderToStaticMarkup(<HomePage locale="en" />);
  assert.match(html, /Châu Anh/);
  assert.match(html, /Dũng/);
  assert.match(html, /href="#projects"/);
  assert.match(html, /href="#experience"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="skills"/);
  assert.match(html, /id="projects"/);
  assert.doesNotMatch(
    html,
    /CVE HUNTER|Years Exp|Bug Bounties|Riadh|Benlamine/,
  );
});

for (const locale of ["en", "vi"] as const) {
  test(`Home ${locale} keeps four decorative HUD tags with luminous indicators`, async () => {
    const { HomePage } = await import("../../src/components/home-page");
    const html = renderToStaticMarkup(<HomePage locale={locale} />);
    const tags = [...html.matchAll(/<span class="float-tag ([^"]+)">([\s\S]*?)<\/span>/g)];
    assert.deepEqual(tags.map(tag => tag[1]), ["cyan", "pink", "green", "amber"]);
    assert.deepEqual(tags.map(tag => tag[2].replace(/<[^>]+>/g, "")), [
      "◆ PWN / BINARY", "◆ RED TEAM", "◆ LINUX", "◆ AI &amp; SECURITY",
    ]);
    for (const tag of tags) {
      assert.match(tag[2], /<i class="tag-indicator" aria-hidden="true">◆<\/i>/);
      assert.doesNotMatch(tag[0], /<a\b|<button\b|tabindex=|role=|onclick=/i);
    }
  });
}
