import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("blog is static and honestly empty, with no external feed request", async () => {
  assert.ok(existsSync("src/components/blog-page.tsx"), "Static Blog missing");
  const { BlogPage } = await import("../../src/components/blog-page");
  const html = renderToStaticMarkup(<BlogPage locale="en" />);
  assert.match(html, /No articles published yet/);
  assert.doesNotMatch(html, /rss2json|medium\.com|Hackthebox Devvortex/);
});
