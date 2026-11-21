import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { siteIcons } from "../../src/lib/metadata";

const expectedPublicFiles = [
  "public/brand/brand-logo-source.png",
  "public/favicon.ico",
  "public/icons/icon-16x16.png",
  "public/icons/icon-32x32.png",
  "public/icons/icon-48x48.png",
  "public/icons/apple-touch-icon.png",
  "public/icons/icon-192x192.png",
  "public/icons/icon-512x512.png",
];

test("approved brand logo source and all generated favicon assets exist", () => {
  for (const file of expectedPublicFiles) {
    assert.ok(fs.existsSync(file), `Missing ${file}`);
    assert.ok(fs.statSync(file).size > 0, `Empty ${file}`);
  }
});

test("siteIcons metadata declares non-conflicting icon sizes", () => {
  assert.ok(
    siteIcons && typeof siteIcons === "object" && !Array.isArray(siteIcons) && !(siteIcons instanceof URL),
  );
  const iconList = Array.isArray(siteIcons.icon) ? siteIcons.icon : [];
  const urls = iconList.map((entry) =>
    typeof entry === "string" || entry instanceof URL ? entry.toString() : entry.url,
  );
  assert.deepEqual(urls, [
    "/favicon.ico",
    "/icons/icon-16x16.png",
    "/icons/icon-32x32.png",
    "/icons/icon-48x48.png",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ]);
  const appleList = Array.isArray(siteIcons.apple) ? siteIcons.apple : [];
  assert.equal(appleList.length, 1);
});
