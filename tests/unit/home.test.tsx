import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
  test(`Home ${locale} keeps four orbital capsules with distinct icons and quiet connections`, async () => {
    const { HomePage } = await import("../../src/components/home-page");
    const html = renderToStaticMarkup(<HomePage locale={locale} />);
    const tags = [...html.matchAll(/<span class="float-tag ([^"]+)">([\s\S]*?)<\/span><\/span>/g)];
    assert.deepEqual(tags.map(tag => tag[1]), ["cyan", "pink", "green", "amber"]);
    assert.deepEqual(tags.map(tag => tag[2].replace(/<[^>]+>/g, "")), [
      "PWN / BINARY", "RED TEAM", "LINUX", "AI &amp; SECURITY",
    ]);
    assert.equal(new Set(tags.map(tag => tag[2].match(/class="lucide ([^"]+) node-icon"/)?.[1])).size, 4);
    for (const tag of tags) {
      assert.match(tag[2], /class="node-capsule"/);
      assert.match(tag[2], /class="node-status" aria-hidden="true"/);
      assert.match(tag[2], /class="node-link"[^>]*aria-hidden="true"[^>]*focusable="false"/);
      assert.match(tag[2], /class="node-anchor"/);
      assert.doesNotMatch(tag[0], /<a\b|<button\b|tabindex=|role=|onclick=/i);
    }
  });
}

test("orbital capsules remove sweep and bracket styling without a scripted animation loop", () => {
  const css = readFileSync("src/styles/globals.css", "utf8");
  const tags = css.split("\n.float-tag {\n")[1].split("\n.scroll-cue {\n")[0];
  assert.doesNotMatch(tags, /hologram-sweep|\.float-tag::before|\.float-tag::after/);
  assert.match(tags, /border-radius: 999px/);
  assert.match(tags, /orbital-node-float/);
  assert.match(tags, /prefers-reduced-motion: no-preference/);
  assert.doesNotMatch(readFileSync("src/components/home-page.tsx", "utf8"), /requestAnimationFrame|setInterval/);
});
