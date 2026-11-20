import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { pageKeys, routeFor } from "../../src/lib/routes";
test("all localized metadata binds the correct static language route", async () => {
  assert.ok(
    existsSync("src/lib/metadata.ts"),
    "Localized SEO metadata missing",
  );
  const { metadataFor } = await import("../../src/lib/metadata");
  for (const locale of ["en", "vi"] as const) {
    for (const key of pageKeys) {
      const m = metadataFor(locale, key);
      assert.equal(
        m.alternates?.canonical,
        "https://chauanhdung.id.vn" + routeFor(locale, key),
      );
      assert.equal(
        m.alternates?.languages?.["x-default"],
        "https://chauanhdung.id.vn" + routeFor("en", key),
      );
      assert.ok(m.title);
      assert.ok(m.description);
    }
  }
});
