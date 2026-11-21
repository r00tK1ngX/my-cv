import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "../../src/components/icon";
test("social destinations retain recognizable reference brand icons", () => {
  for (const name of ["github", "linkedin"]) {
    const html = renderToStaticMarkup(<Icon name={name} />);
    assert.match(html, /brand-icon/);
    assert.doesNotMatch(html, /lucide-code-xml|lucide-briefcase/);
  }
});
