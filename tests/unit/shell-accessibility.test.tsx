import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { SiteShell } from "../../src/components/site-shell";

for (const locale of ["en", "vi"] as const) {
  test(`${locale}: wordmark accessible name includes its visible textual label`, () => {
    const html = renderToStaticMarkup(
      <SiteShell locale={locale} page="about">
        <h1>{locale === "en" ? "About" : "Giới thiệu"}</h1>
      </SiteShell>,
    );
    const wordmark = html.match(/<a\b[^>]*class="wordmark"[^>]*>/)?.[0];
    assert.ok(wordmark, "Missing wordmark home link");
    const name = wordmark.match(/aria-label="([^"]+)"/)?.[1];
    assert.ok(name, "Missing wordmark accessible name");
    assert.match(name, /r00tK1ngX.*portfolio/);
    assert.match(name, locale === "en" ? /Home/ : /Trang chủ/);
    assert.doesNotMatch(html, /<header[^>]*\sinert(?:=|\s|>)/);
    assert.doesNotMatch(html, /<main[^>]*\sinert(?:=|\s|>)/);
    assert.doesNotMatch(html, /<footer[^>]*\sinert(?:=|\s|>)/);
  });
  test(`${locale}: a fully closed menu does not advertise an unmounted controls target`, () => {
    const html = renderToStaticMarkup(
      <SiteShell locale={locale} page="about"><h1>About</h1></SiteShell>,
    );
    const toggle = html.match(/<button\b[^>]*class="menu-toggle"[^>]*>/)?.[0];
    assert.ok(toggle);
    assert.match(toggle, /aria-expanded="false"/);
    assert.doesNotMatch(toggle, /aria-controls=/);
    assert.doesNotMatch(html, /id="mobile-navigation"/);
  });
}
