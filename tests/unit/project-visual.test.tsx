import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { ProjectsSection } from "../../src/components/content-sections";
test("project visuals retain the reference scan-line and category badge hierarchy", () => {
  const html = renderToStaticMarkup(<ProjectsSection locale="en" />);
  assert.equal((html.match(/class="project-scanline"/g) ?? []).length, 3);
  assert.equal((html.match(/class="project-visual-label"/g) ?? []).length, 3);
  const css = readFileSync("src/styles/globals.css", "utf8");
  assert.match(css, /@keyframes project-scan/);
  assert.match(css, /\.project-visual\s*\{[^}]*height:\s*176px/s);
});
