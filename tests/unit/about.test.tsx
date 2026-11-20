import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("About describes student baseline without unsupported professional roles", async () => {
  assert.ok(existsSync("src/components/about-page.tsx"), "About page missing");
  const { AboutPage } = await import("../../src/components/about-page");
  const html = renderToStaticMarkup(<AboutPage locale="en" />);
  assert.match(html, /Châu Anh Dũng/);
  assert.match(html, /Duy Tan University/);
  assert.match(html, /PWN/);
  assert.match(html, /AI &amp; Security Automation/);
  assert.doesNotMatch(
    html,
    /junior penetration tester|CVE researcher|professional penetration|R&amp;D Intern/i,
  );
  const vi = renderToStaticMarkup(<AboutPage locale="vi" />);
  assert.match(vi, /Đại học Duy Tân/);
  assert.match(vi, /Đà Nẵng/);
});
