import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("research uses category-specific cards and never invents missing severity or reward", async () => {
  assert.ok(
    existsSync("src/components/research-card.tsx"),
    "Reference research card renderer missing",
  );
  const { ResearchCard } = await import("../../src/components/research-card");
  const base = {
    id: "test-only",
    title: { en: "Internal test fixture", vi: "Dữ liệu kiểm tra nội bộ" },
    description: { en: "Renderer check only", vi: "Chỉ kiểm tra renderer" },
    href: "https://example.invalid/",
    date: "2026-01-01",
  };
  const cve = renderToStaticMarkup(
    <ResearchCard
      item={{
        ...base,
        category: "cves",
        identifier: "TEST-ONLY",
        vendor: "Fixture",
        severity: "High",
        status: "Published",
        score: 7.1,
        details: [{ en: "Fixture detail", vi: "Chi tiết kiểm tra" }],
      }}
      locale="en"
    />,
  );
  assert.match(cve, /research-card/);
  assert.match(cve, /CVSS/);
  assert.match(cve, /7.1/);
  assert.match(cve, /Fixture detail/);
  const exploit = renderToStaticMarkup(
    <ResearchCard
      item={{ ...base, category: "exploits", platform: "Linux" }}
      locale="en"
    />,
  );
  assert.match(exploit, /Linux/);
  assert.doesNotMatch(exploit, /Verified|CVSS/);
  const bounty = renderToStaticMarkup(
    <ResearchCard item={{ ...base, category: "bounties" }} locale="en" />,
  );
  assert.doesNotMatch(bounty, /\$|CVSS|Critical|Patched/);
});
