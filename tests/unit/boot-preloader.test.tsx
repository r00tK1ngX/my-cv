import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { BootPreloader } from "../../src/components/boot-preloader";

test("BootPreloader renders nothing on SSR to avoid hydration mismatch and never block no-JS", () => {
  for (const locale of ["en", "vi"] as const) {
    assert.equal(renderToStaticMarkup(<BootPreloader locale={locale} />), "");
  }
});

test("BootPreloader contains localized EN/VI boot messages, approved logo, and reduced-motion/skip support", () => {
  const src = fs.readFileSync("src/components/boot-preloader.tsx", "utf8");
  const css = fs.readFileSync("src/styles/boot-preloader.css", "utf8");
  assert.match(src, /\/icons\/icon-192x192\.png/);
  assert.match(src, /r00tK1ngX@portfolio/);
  assert.match(src, /Initializing portfolio environment\.\.\./);
  assert.match(src, /Khởi tạo môi trường portfolio\.\.\./);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /sessionStorage/);
  assert.match(src, /Escape/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
