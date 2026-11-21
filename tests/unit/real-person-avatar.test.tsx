import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { HomePage } from "../../src/components/home-page";

for (const locale of ["en", "vi"] as const) {
  test(`the ${locale} Hero uses the approved static portrait in the existing visual shell`, () => {
    const html = renderToStaticMarkup(<HomePage locale={locale} />);
    const emblem = html.match(/<div class="hero-emblem">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(emblem, "Existing Hero emblem container remains");
    assert.match(emblem, /<img\b/);
    assert.match(emblem, /src="\/images\/chau-anh-dung-avatar\.webp"/);
    assert.match(emblem, /class="hero-portrait"/);
    assert.match(emblem, /width="512"/);
    assert.match(emblem, /height="512"/);
    assert.match(emblem, /alt=""/);
    assert.doesNotMatch(emblem, /<svg\b|<b>CAD<\/b>|\/_next\/image/);
    assert.match(html, /class="hero-visual reveal" aria-hidden="true"/);
    assert.equal((html.match(/class="orbit(?: second)?"/g) ?? []).length, 2);
    assert.match(html, /class="scan-brackets"><i><\/i><i><\/i><i><\/i><i><\/i>/);
    for (const label of ["PWN / BINARY", "RED TEAM", "LINUX", "AI &amp; SECURITY"]) {
      assert.ok(html.includes(label), "Keep approved production label " + label);
    }
    assert.ok(fs.existsSync("public/images/chau-anh-dung-avatar.webp"));
  });
}

test("the release validator explicitly permits only the new avatar image", () => {
  const script = fs.readFileSync("scripts/verify-release.mjs", "utf8");
  assert.ok(script.includes('"images/chau-anh-dung-avatar.webp"'));
  assert.ok(script.includes('"public-avatar"'));
  assert.doesNotMatch(script, /relative\.startsWith\("images\/"\)/);
  assert.equal(path.extname("public/images/chau-anh-dung-avatar.webp"), ".webp");
});
