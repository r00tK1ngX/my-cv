import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
test("route model exists for static EN/VI equivalents", async () => {
  assert.ok(
    existsSync("src/lib/routes.ts"),
    "Missing the typed static route model",
  );
  const { pageKeys, routeFor, equivalentRoute, allRoutes } =
    await import("../../src/lib/routes");
  assert.equal(allRoutes.length, 16);
  assert.equal(new Set(allRoutes).size, 16);
  for (const key of pageKeys) {
    assert.equal(equivalentRoute(routeFor("en", key)), routeFor("vi", key));
    assert.equal(equivalentRoute(routeFor("vi", key)), routeFor("en", key));
  }
  assert.equal(routeFor("en", "home"), "/");
  assert.equal(routeFor("vi", "home"), "/vi/");
  assert.ok(allRoutes.every((p: string) => !p.startsWith("/en/")));
});
