import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
test("every self-hosted font CSS import resolves in installed package", () => {
  const css = readFileSync("src/styles/globals.css", "utf8");
  for (const match of css.matchAll(/@import "(@fontsource\/[^\"]+)"/g)) {
    assert.ok(
      existsSync("node_modules/" + match[1]),
      "Font import does not exist: " + match[1],
    );
  }
});
