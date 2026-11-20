import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { HomePage } from "../../src/components/home-page";
test("reference glitch effect layers carry Owner name and honor reduced motion", () => {
  const html = renderToStaticMarkup(<HomePage locale="en" />);
  assert.match(html, /data-text="Châu Anh"/);
  const css = readFileSync("src/styles/globals.css", "utf8");
  assert.match(css, /\.glitch-name::before/);
  assert.match(css, /@keyframes glitch-one/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
