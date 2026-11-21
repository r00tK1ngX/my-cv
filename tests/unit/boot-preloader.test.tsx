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
    assert.match(html, /0%/);
    assert.match(html, locale === "vi" ? /NGOẠI TUYẾN/ : /OFFLINE/);
    assert.doesNotMatch(html, /SKIP|BỎ QUA|boot-skip/);
  }
  const css = fs.readFileSync("src/styles/boot-preloader.css", "utf8");
  assert.match(css, /html:not\(\[data-boot-pending="1"\]\) \.boot-preloader/);
});

test("BootPreloader contains Concept 01 EN/VI boot messages, OFFLINE/ONLINE status, approved logo, and reduced-motion support", () => {
  const src = fs.readFileSync("src/components/boot-preloader.tsx", "utf8");
  const css = fs.readFileSync("src/styles/boot-preloader.css", "utf8");
  assert.match(src, /\/icons\/icon-192x192\.png/);
  assert.match(src, /r00tK1ngX@portfolio/);
  assert.match(src, /Initializing cybersecurity environment\.\.\./);
  assert.match(src, /Khởi tạo môi trường an ninh mạng\.\.\./);
  assert.match(src, /System initialization complete\./);
  assert.match(src, /Khởi tạo hệ thống hoàn tất\./);
  assert.match(src, /OFFLINE/);
  assert.match(src, /ONLINE/);
  assert.match(src, /NGOẠI TUYẾN/);
  assert.match(src, /TRỰC TUYẾN/);
  assert.doesNotMatch(src, /boot-skip|\[ SKIP \]|\[ BỎ QUA \]/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /sessionStorage/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
