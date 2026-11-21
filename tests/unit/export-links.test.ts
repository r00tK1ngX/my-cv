import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pageKeys, routeFor, siteOrigin } from "../../src/lib/routes";

test("export verification rejects a local link to an existing directory without index.html", () => {
  const workspace = process.cwd();
  fs.mkdirSync("qa/regression-fixtures", { recursive: true });
  const fixture = fs.mkdtempSync(
    path.join(workspace, "qa/regression-fixtures/export-links-"),
  );
  try {
    const output = path.join(fixture, "out");
    for (const locale of ["en", "vi"] as const) {
      for (const key of pageKeys) {
        const route = routeFor(locale, key);
        const file = path.join(output, route, "index.html");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(
          file,
          `<html lang="${locale}"><head><link rel="canonical" href="${siteOrigin + route}"></head><body><h1>Fixture</h1><a href="/skills/">Valid directory index</a></body></html>`,
        );
      }
    }
    fs.writeFileSync(path.join(output, "404.html"), "Not found");
    fs.writeFileSync(
      path.join(output, "sitemap.xml"),
      "<loc>fixture</loc>".repeat(16),
    );
    const run = () =>
      spawnSync(
        process.execPath,
        [
          path.join(workspace, "node_modules/tsx/dist/cli.mjs"),
          path.join(workspace, "scripts/verify-export.ts"),
        ],
        { cwd: fixture, encoding: "utf8" },
      );
    const valid = run();
    assert.equal(valid.status, 0, valid.stderr);
    fs.mkdirSync(path.join(output, "empty-directory"));
    fs.appendFileSync(
      path.join(output, "index.html"),
      '<a href="/empty-directory/">Regression link</a>',
    );
    const result = run();
    assert.notEqual(
      result.status,
      0,
      "An existing directory without index.html must not pass as a local route",
    );
    assert.match(result.stderr, /Broken local href\/src.*empty-directory/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
