import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { pageKeys, routeFor, siteOrigin } from "../src/lib/routes";

const out = path.resolve("out");
assert.ok(fs.existsSync(path.join(out, "index.html")), "Missing static export");
function regularFile(target: string): boolean {
  try {
    return (
      fs.lstatSync(target).isFile() && !fs.lstatSync(target).isSymbolicLink()
    );
  } catch {
    return false;
  }
}
function localReferenceExists(root: string, value: string): boolean {
  const relative = path.relative(root, value);
  if (
    relative.startsWith(".." + path.sep) ||
    relative === ".." ||
    path.isAbsolute(relative)
  )
    return false;
  const parts = relative.split(path.sep).filter(Boolean);
  let current = root;
  for (const part of parts) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) return false;
    } catch {
      return false;
    }
  }
  return regularFile(value) || regularFile(path.join(value, "index.html"));
}
const files: string[] = [];
function visit(directory: string) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const p = path.join(directory, entry.name);
    const stat = fs.lstatSync(p);
    assert.ok(!stat.isSymbolicLink(), "Export link: " + p);
    if (entry.isDirectory()) visit(p);
    else {
      assert.ok(
        stat.isFile() && stat.nlink === 1,
        "Nonregular/hardlinked export: " + p,
      );
      files.push(p);
    }
  }
}
visit(out);
const deniedPath =
  /(?:^|\/)(?:docs|qa|src|tests|scripts|node_modules|\.git|\.github)(?:\/|$)|\.(?:pdf|map|ts|tsx|py|log)$|(?:package(?:-lock)?\.json)$/i;
for (const f of files)
  assert.ok(
    !deniedPath.test(path.relative(out, f)),
    "Private/source payload in export: " + f,
  );
const deniedText =
  /Samsung Innovation Campus|VNNIC|CyberSubtitleTranslator|R&D Intern|R&amp;D Intern|Riadh|Benlamine|ChauAnhDung_CV_Intern\.pdf/i;
const phonePattern = /(?:\+84[ .-]?|\b0)(?:\d[ .-]?){8,10}\b/;
let textFiles = 0;
for (const f of files) {
  if (!/\.(html|txt|json|js|css|xml)$/i.test(f)) continue;
  const text = fs.readFileSync(f, "utf8");
  textFiles++;
  assert.ok(!deniedText.test(text), "Excluded content in " + f);
  if (f.endsWith(".html")) {
    assert.ok(!/href=["']tel:/i.test(text), "Telephone link in " + f);
    const visible = text
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");
    assert.ok(
      !phonePattern.test(visible),
      "Possible phone in visible page " + f,
    );
  }
}
const routes = [];
for (const locale of ["en", "vi"] as const)
  for (const key of pageKeys) {
    const route = routeFor(locale, key);
    const file = path.join(out, route, "index.html");
    assert.ok(fs.existsSync(file), "Missing " + route);
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`));
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) ?? []).length,
      1,
      "One h1 per route",
    );
    assert.ok(
      html.includes(`rel="canonical" href="${siteOrigin + route}"`),
      "Canonical " + route,
    );
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const local = decodeURIComponent(match[1]);
      const target = path.join(out, local);
      assert.ok(
        localReferenceExists(out, target),
        "Broken local href/src " + local + " on " + route,
      );
    }
    routes.push({
      route,
      file: path.relative(out, file),
      bytes: fs.statSync(file).size,
    });
  }
assert.equal(routes.length, 16);
const expectedHtml = new Set(
  routes
    .map((r) => r.file)
    .concat(["404.html", "404/index.html", "_not-found/index.html"]),
);
for (const f of files.filter((f) => f.endsWith(".html")))
  assert.ok(
    expectedHtml.has(path.relative(out, f)),
    "Unexpected HTML route " + f,
  );
const cssFiles = files.filter((f) => f.endsWith(".css"));
for (const cssFile of cssFiles) {
  const css = fs.readFileSync(cssFile, "utf8");
  for (const m of css.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)) {
    if (m[1].startsWith("data:")) continue;
    assert.ok(!/^https?:/.test(m[1]), "External runtime CSS asset");
    const target = m[1].startsWith("/")
      ? path.join(out, m[1])
      : path.resolve(path.dirname(cssFile), m[1]);
    assert.ok(
      localReferenceExists(out, target) && regularFile(target),
      "Missing CSS runtime asset: " + m[1],
    );
  }
}
assert.ok(!fs.existsSync(path.join(out, "en")), "No /en/");
assert.ok(
  !fs.existsSync(path.join(out, "CNAME")),
  "Do not copy legacy CNAME into export",
);
const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 16);
assert.ok(fs.existsSync(path.join(out, "404.html")), "Static 404");
const report = {
  status: "PASS",
  scope:
    "Local export paths/content/local links/metadata/privacy checks only, not production Artifact Policy certification",
  routes,
  routeCount: routes.length,
  fileCount: files.length,
  textFilesScanned: textFiles,
  noPdf: true,
  noSourceOrPrivateDocs: true,
  noExcludedContent: true,
  noVisiblePhone: true,
  noOldIdentity: true,
  noBrokenLocalHtmlReferences: true,
  limitations: [
    "Phone scan is bounded pattern/content verification, not a proof against arbitrary encoding.",
    "No signed release/protection/upload or production validation.",
  ],
};
fs.mkdirSync("qa", { recursive: true });
fs.writeFileSync("qa/export-validation.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
