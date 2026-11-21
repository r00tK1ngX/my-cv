import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { SiteShell } from "../../src/components/site-shell";
import { CyberCursor } from "../../src/components/cyber-cursor";

const cursorCss = readFileSync("src/styles/cyber-cursor.css", "utf8");

test("cyber cursor renders the complete decorative architecture and preserves initial native cursor", () => {
  const html = renderToStaticMarkup(<CyberCursor />);
  assert.match(html, /class="cyber-cursor" aria-hidden="true"/);
  assert.match(html, /class="cyber-cursor__glow"/);
  assert.match(html, /class="cyber-cursor__ring"/);
  assert.match(html, /class="cyber-cursor__ripple"/);
  assert.match(html, /class="cyber-cursor__trail cyber-cursor__trail--1"/);
  assert.match(html, /class="cyber-cursor__trail cyber-cursor__trail--2"/);
  assert.match(html, /class="cyber-cursor__trail cyber-cursor__trail--3"/);
  assert.match(html, /class="cyber-cursor__core"/);
  assert.match(html, /visibility:hidden/);
  assert.match(html, /data-state="default"/);
  assert.match(html, /data-initialized="false"/);
  assert.match(html, /style="visibility:hidden"/);
});

test("English and Vietnamese shells include the cursor without altering core shell landmarks", () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderToStaticMarkup(<SiteShell locale={locale} page="home"><main id="cursor-test">{locale}</main></SiteShell>);
    assert.equal((html.match(/class="cyber-cursor"/g) ?? []).length, 1);
    assert.match(html, /id="cursor-test"/);
    assert.match(html, /class="site-header/);
    assert.match(html, /class="site-footer"/);
  }
});

test("custom cursor CSS only hides native desktop pointers after initialization", () => {
  assert.match(cursorCss, /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*and\s*\(min-width:\s*1180px\)/);
  assert.match(cursorCss, /html\[data-cyber-cursor="ready"\]\s*\*::after\s*\{\s*cursor:\s*none\s*!important/s);
  assert.match(cursorCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?html\[data-cyber-cursor="ready"\]/);
  assert.match(cursorCss, /\.cyber-cursor\s*\{[^}]*pointer-events:\s*none/s);
});

test("cursor responds to semantic interactive, button, and reduced-motion states in its styles", () => {
  assert.match(cursorCss, /\.cyber-cursor\[data-state="interactive"\]/);
  assert.match(cursorCss, /\.cyber-cursor\[data-state="button"\]/);
  assert.match(cursorCss, /\.cyber-cursor\[data-state="image"\]/);
  assert.match(cursorCss, /cyber-cursor__ripple/);
  assert.match(cursorCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.cyber-cursor/);
});
