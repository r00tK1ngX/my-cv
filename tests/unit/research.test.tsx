import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("research renders three accessible real-data filters with no invented achievement", async () => {
  assert.ok(
    existsSync("src/components/research-page.tsx"),
    "Research filters missing",
  );
  const { ResearchPage } = await import("../../src/components/research-page");
  const html = renderToStaticMarkup(<ResearchPage locale="en" />);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 3);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /No published CVE entries yet/);
  assert.doesNotMatch(
    html,
    /CVE-\d{4}-\d+|\$100|EARNINGS|verified researcher/i,
  );
});
