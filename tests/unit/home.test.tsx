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
  test(`Home ${locale} renders five tactical HUD markers with distinct icons`, async () => {
    const { HomePage } = await import("../../src/components/home-page");
    const html = renderToStaticMarkup(<HomePage locale={locale} />);
    const markers = [
      ...html.matchAll(
        /<span class="hud-marker ([^"]+)">([\s\S]*?)<\/span><\/span><\/span>/g,
      ),
    ];
    assert.deepEqual(
      markers.map(marker => marker[1]),
      ["cyan", "green", "amber", "pink", "violet"],
    );
    assert.deepEqual(
      markers.map(marker => marker[2].replace(/<[^>]+>/g, "")),
      ["PWN / BINARY", "LINUX", "AI &amp; SECURITY", "RED TEAM", "CTF PLAYER"],
    );
    assert.equal(
      new Set(
        markers.map(
          marker => marker[2].match(/class="lucide ([^"]+) hud-marker-icon"/)?.[1],
        ),
      ).size,
      5,
    );
    for (const marker of markers) {
      assert.match(marker[2], /class="hud-marker-plate"/);
      assert.match(marker[2], /class="hud-marker-core"/);
      assert.match(marker[2], /class="hud-marker-rail" aria-hidden="true"/);
      assert.match(marker[2], /class="hud-marker-sep" aria-hidden="true"/);
      assert.match(marker[2], /class="hud-marker-pulse" aria-hidden="true"/);
      assert.doesNotMatch(marker[0], /<a\b|<button\b|tabindex=|role=|onclick=/i);
    }
  });
}

test("tactical HUD markers use chamfered geometry and CSS-only motion", () => {
  const css = readFileSync("src/styles/globals.css", "utf8");
  const markers = css.split("\n.hud-marker {\n")[1].split("\n.scroll-cue {\n")[0];
  assert.match(markers, /clip-path: polygon/);
  assert.match(markers, /hud-marker-float/);
  assert.match(markers, /prefers-reduced-motion: no-preference/);
  assert.doesNotMatch(
    readFileSync("src/components/home-page.tsx", "utf8"),
    /requestAnimationFrame|setInterval/,
  );
});
