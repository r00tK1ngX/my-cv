import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SkillsSection } from "../../src/components/content-sections";
test("Vietnamese skills explain study concepts in Vietnamese without ratings", () => {
  const html = renderToStaticMarkup(<SkillsSection locale="vi" />);
  assert.match(html, /Cấu trúc dữ liệu và giải thuật/);
  assert.match(html, /Lập trình hướng đối tượng Java/);
  assert.match(html, /Nền tảng giao thức mạng/);
  assert.doesNotMatch(html, /\d+%/);
});
