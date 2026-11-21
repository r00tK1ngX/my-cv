import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { BootPreloader } from "../../src/components/boot-preloader";

test("BootPreloader renders in SSR HTML for zero-flicker first paint and gates visibility on bootPending", () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderToStaticMarkup(<BootPreloader locale={locale} />);
    assert.match(html, /class="boot-preloader /);
    assert.match(html, /r00tK1ngX@portfolio/);
  }
  const css = fs.readFileSync("src/styles/boot-preloader.css", "utf8");
  assert.match(css, /html:not\(\[data-boot-pending="1"\]\) \.boot-preloader/);
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
