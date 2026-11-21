import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

// Hosting-only checks complement the unchanged Round 3 verify:export gate.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");
const packageInfo = JSON.parse(fs.readFileSync(path.join(root, "package.json")));
assert.equal(packageInfo.dependencies.next, "16.4.6", "Review output adapter after Next upgrade");
assert.ok(fs.lstatSync(out).isDirectory() && !fs.lstatSync(out).isSymbolicLink());
assert.equal(fs.readFileSync(path.join(root, "CNAME"), "utf8").trim(), "chauanhdung.id.vn");
const routeNames = ["", "about/", "experience/", "skills/", "projects/", "blog/", "research/", "contact/"];
const routes = ["", "vi/"].flatMap((locale) => routeNames.map((route) => locale + route));
const routeSet = new Set([...routes, "_not-found/"]);
const allowedHtml = new Set(routes.map((route) => route + "index.html"));
for (const name of ["404.html", "404/index.html", "_not-found/index.html"]) allowedHtml.add(name);
const publicFiles = new Map();
const legalFiles = new Set([
  "brand-icons-attribution.txt", "jetbrains-mono-OFL.txt", "lucide-license.txt",
  "oxanium-OFL.txt", "rajdhani-OFL.txt", "react-icons-license.txt", "reference-MIT.txt",
]);
function walk(directory, callback) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const stat = fs.lstatSync(absolute);
    assert.ok(!stat.isSymbolicLink(), "No symlinks: " + absolute);
    if (stat.isDirectory()) walk(absolute, callback);
    else {
      assert.ok(stat.isFile() && stat.nlink === 1, "Regular unlinked file: " + absolute);
      callback(absolute, stat);
    }
  }
}
walk(path.join(root, "public"), (absolute) => {
  const relative = path.relative(path.join(root, "public"), absolute).split(path.sep).join("/");
  assert.ok(relative.startsWith("legal/") && legalFiles.has(relative.slice(6)), "Unexpected public input: " + relative);
  publicFiles.set(relative, hash(fs.readFileSync(absolute)));
});
assert.equal(publicFiles.size, legalFiles.size, "Missing legal input");
const files = [];
walk(out, (absolute, stat) => {
  const name = path.relative(out, absolute).split(path.sep).join("/");
  assert.ok(stat.size > 0, "Empty output: " + name);
  assert.ok(!name.split("/").some((part) => part.startsWith(".")), "Hidden output: " + name);
  let kind;
  if (allowedHtml.has(name)) kind = "page";
  else if (["sitemap.xml", "robots.txt"].includes(name)) kind = "metadata";
  else if (publicFiles.has(name)) {
    kind = "public-legal";
    assert.equal(hash(fs.readFileSync(absolute)), publicFiles.get(name), "Public bytes changed");
  } else if (/^_next\/static\/[A-Za-z0-9_./%()-]+\.(?:js|css|woff2?|ttf|otf)$/.test(name)) kind = "runtime";
  else if (/\.txt$/.test(name)) {
    const dir = path.posix.dirname(name);
    const route = dir === "." ? "" : dir + "/";
    const basename = path.posix.basename(name);
    assert.ok(routeSet.has(route), "Unexpected navigation payload route: " + name);
    assert.ok(basename === "index.txt" || /^__next\.[A-Za-z0-9_.!()%-]+\.txt$/.test(basename), "Unknown Next payload: " + name);
    kind = "navigation";
  } else assert.fail("Unapproved static output path: " + name);
  files.push({ path: name, bytes: stat.size, sha256: hash(fs.readFileSync(absolute)), kind });
});
for (const name of publicFiles.keys()) assert.ok(files.some((file) => file.path === name), "Missing public asset: " + name);
for (const route of routes) {
  assert.ok(files.some((file) => file.path === route + "index.html"), "Missing route: /" + route);
  assert.ok(files.some((file) => file.path === route + "index.txt"), "Missing navigation payload: /" + route);
}
for (const kind of ["page", "metadata", "public-legal", "runtime", "navigation"]) {
  assert.ok(files.some((file) => file.kind === kind), "Missing output class: " + kind);
}
assert.ok(files.some((file) => file.path.endsWith(".js")), "Missing JavaScript");
assert.ok(files.some((file) => file.path.endsWith(".css")), "Missing CSS");
assert.ok(files.some((file) => file.path.endsWith(".woff2")), "Missing self-hosted fonts");
assert.ok(files.some((file) => file.path === "404.html"), "Missing custom 404");
files.sort((a, b) => a.path.localeCompare(b.path, "en"));
const report = {
  status: "PASS",
  scope: "Next 16.4.6 static release output classes and input asset equality; not authenticated approval, uploaded-artifact readback or live hosting certification",
  routes: routes.map((route) => "/" + route),
  routeCount: routes.length,
  fileCount: files.length,
  totalBytes: files.reduce((total, file) => total + file.bytes, 0),
  files,
};
fs.mkdirSync(path.join(root, "qa"), { recursive: true });
fs.writeFileSync(path.join(root, "qa/release-output.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, files: undefined }, null, 2));
