import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("shared shell supplies current identity, navigation and language equivalent", async () => {
  assert.ok(
    existsSync("src/components/site-shell.tsx"),
    "Missing reference-faithful shared shell",
  );
  const { SiteShell } = await import("../../src/components/site-shell");
  const html = renderToStaticMarkup(
    <SiteShell locale="en" page="research">
      <h1>Research</h1>
    </SiteShell>,
  );
  assert.match(html, /r00tK1ngX/);
  assert.match(html, /class="brand-emblem"/);
  assert.match(html, /src="\/icons\/icon-192x192\.png"/);
  assert.match(html, /href="\/vi\/research\/"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /Skip to content/);
  assert.doesNotMatch(html, /Riadh|Benlamine|Download CV|\.pdf/);
  const vi = renderToStaticMarkup(
    <SiteShell locale="vi" page="about">
      <h1>Giới thiệu</h1>
    </SiteShell>,
  );
  assert.match(vi, /href="\/about\/"/);
});

test("mobile drawer removes redundant inner drawer-heading and duplicate close button", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync("src/components/site-shell.tsx", "utf8");
  const css = readFileSync("src/styles/globals.css", "utf8");
  assert.doesNotMatch(source, /drawer-heading/);
  assert.doesNotMatch(source, /◈/);
  assert.doesNotMatch(css, /\.drawer-heading/);
  assert.match(source, /className="menu-toggle"/);
});
