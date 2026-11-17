# Existing CV repository audit

Root: `/home/r00tK1ngX/my-cv-redesign`. Branch thực tế `redesign/portfolio-v2`; initial HEAD/main `f62fc0fa5c33bb65f0ac411fbfcc935294684745`; working tree đầu audit sạch. Đây là audit không chỉnh implementation. Bằng chứng: `evidence/repository-baseline.json`, `existing-files-assets-duplicates.json`, `existing-javascript-syntax-checks.json`, `existing-selector-probe.json`, `existing-runtime-parent-verification.json`, `http-readonly-checks.json`, `github-pages-public-api.json`, `final-verification.json`.

## 1. Directory structure và entry point

Trước audit có18 tracked files, không có package.json, lockfile, bundler config, tests, .nojekyll hoặc license file riêng. Audit thêm `docs/`; không di chuyển/xóa bản website nào.

```text
my-cv-redesign/
  .github/workflows/static.yml
  CNAME
  README.md
  index.html                  root entry;1410 lines,68386 bytes
  avatar.jpg                  root image referenced by root HTML
  logo.svg                    root icon/logo referenced by root HTML
  images/
    avatar.jpg                duplicate
    logo.svg                  duplicate
  web-cv/
    index.html                legacy split variant;692 lines,42146 bytes
    script.js                 legacy JS;330 lines,14312 bytes
    styles.css                legacy CSS;380 lines,11575 bytes
    avatar.jpg
    logo.svg
  html,js,css/
    index.html                byte-identical to web-cv/index.html
    script.js                 byte-identical to web-cv/script.js
    styles.css                byte-identical to web-cv/styles.css
    avatar.jpg
    logo.svg
  .git/                       repository metadata, not website code
```

Workflow uploads `path:'.'`, so root `index.html` is the natural published entry and nested directories remain candidate public subpaths. There is no step selecting `web-cv` as source (`.github/workflows/static.yml:31-43`). This is source-based deployment intent, not a claim that server-side Pages settings were fully read.

Root HTML is HTML/CSS/vanilla JS: inline stylesheet `index.html:21-398`, body markup `400-1076`, inline JS `1078-1408`. Runtime dependencies are CDN Tailwind (`16`), Font Awesome6.4.0 (`17`), Google Fonts Share Tech Mono/Ubuntu Mono (`18-20`) plus direct font-face definitions later. No React/Next/TypeScript application or build pipeline is present. Root links `logo.svg`/`avatar.jpg` relatively (`12-13,422,507`), which suits custom-root and project-subpath hosting if the relative folder layout is preserved.

## 2. Deployment workflow và CNAME — phải bảo toàn

`CNAME:1` contains exactly `chauanhdung.id.vn` (18 bytes including final newline); preserve exact domain and file at published root. Do not replace it with the reference Vercel hostname.

`.github/workflows/static.yml`:

- Name Deploy static content to Pages (`1-2`). Trigger push to main (`4-7`), manual workflow_dispatch (`9-10`). Redesign branch push is not in the declared push trigger; a manual run is still a separate potential deployment path and was not invoked.
- Token permissions contents:read, pages:write, id-token:write (`13-16`).
- Concurrency group pages, cancel-in-progress:false (`20-22`).
- github-pages environment + output page_url (`26-30`).
- checkout@v4 → configure-pages@v5 → upload-pages-artifact@v3 path'.' → deploy-pages@v4 (`32-43`). No Node install/build/export command.

Current workflow can publish plain static root files; dropping a Next source tree into it would publish source instead of generated app unless later changed deliberately. Uploading the entire repo also means nested duplicates and these audit docs/screenshots may enter the public Pages artifact if merged and deployed. In a future approved migration, narrow artifact to built public output while preserving CNAME/permissions/environment/domain behavior; Phase1 has made no such change.

Read-only HTTP observation: `https://chauanhdung.id.vn/` returned200 with server header Cloudflare; `https://tykerai.github.io/my-cv/` returned404. This does not establish exact DNS records, origin IP, Cloudflare zone settings, redirects for every hostname or the repository's configured Pages source. Public unauthenticated API `GET https://api.github.com/repos/tykerai/my-cv/pages` returned404; it can reflect endpoint visibility/auth/state and is not proof Pages is off. No token/credentials were read; no DNS request mutation/API write/config update/deploy performed.

Future path compatibility: custom domain normally runs at `/`, a default project deployment uses `/my-cv/`. Existing relative asset URLs are safer for both. Reference root-absolute links/assets would need a shared base URL strategy. Separate static routes should emit directory index HTML and be tested with direct navigation/refresh. Avoid an SPA history-only router that assumes Pages rewrites every deep path. CNAME presence alone does not configure Cloudflare DNS or prove HTTPS settings.

## 3. Duplicate files và assets

Hash comparison is exact, not based on filenames. Source evidence `evidence/existing-files-assets-duplicates.json` includes full SHA-256 for all18 files.

| Duplicate group | Copies | Bytes each | SHA-256 |
|---|---:|---:|---|
| `avatar.jpg`, `images/avatar.jpg`, `web-cv/avatar.jpg`, `html,js,css/avatar.jpg` |4|177308|`5f3d00b5411c8e78b4f61ef7636ba1d4043600f455a40c6dcc22d73b2da5446f`|
| `logo.svg`, `images/logo.svg`, `web-cv/logo.svg`, `html,js,css/logo.svg` |4|2062612|`63141766d58abc297431e273bbf44c9f9e258071ddd83e201cb9ef99f47c194c`|
| `web-cv/styles.css`, `html,js,css/styles.css` |2|11575|`73437902871de4f05522332f2657cf20e47eb0611fe41c0be4fe9a1b5ff6bcb4`|
| `web-cv/script.js`, `html,js,css/script.js` |2|14312|`37d25f0faa4ce60f0f806aa5e48e5fd9e9b64108f341cf88917b2af980803345`|
| `web-cv/index.html`, `html,js,css/index.html` |2|42146|`aa935e81283c1da579ffc5f6d67dfcc9b75011d88ed7824fef9b4f3cb0b3ef0f`|

Redundant physical bytes beyond one file per exact duplicate group:6,787,793 (Python-computed; excludes .git/docs). This is storage duplication, not a measured browser transfer total or compressed git saving. Root `index.html` is different: hash `c16271769562a85258dc516f43734831f35ce91dc3beeed78f056e02b8db3174`.

Avatar JPEG is961×1281. Logo SVG root dimensions500×500/viewBox0 0 375 374.999991,2,062,612 bytes; XML contains four image elements carrying base64 PNGs (declared1563×1600) plus masks/filters. Thus the `.svg` extension is not evidence of a lightweight vector logo. Audit parsed XML counts/metadata without dumping image data. Future optimization is advisable, but no file was recompressed or replaced.

`images/` assets are not the active root references; duplicated legacy folders use their own relative copies. No PDF download asset, local font files, video, project screenshots or backend code found. Owner review needed before deleting legacy URLs, even if content is duplicate.

## 4. Existing content inventory

These are facts about what the files say, not verified biographical credentials.

| Area | Current source content | Source evidence |
|---|---|---|
| Identity/hero | Châu Anh Dũng; Cybersecurity Student/Ethical Hacking/Future Red Teamer; Duy Tan University, Vietnam | `index.html:8-10,420-425,459-495,515-529,1110-1116` |
| About/contact | Bio mentions Samsung Innovation Campus AI and VNNIC VISY2025; public owner email/social links; Da Nang | `index.html:517-529,966-1015` |
| Skills |5 security +5 technical skill bars,8 tools tiles; Bandit20/THM Blue/Samsung/VISY progress text | `index.html:548-702` |
| Projects | Network Security Lab; Personal Website; VNNIC infrastructure study; CTF Participation; MS17-010 Lab; English for Cybersecurity | `index.html:714-842` |
| Experience |4 entries: Samsung, VNNIC, pentest practice, security-focused web development; currently labeled Work Experience | `index.html:853-901` |
| Education |4 entries: BSc cybersecurity,AI program,VISY,self-study/certifications | `index.html:904-952` |
| Contact form | Name/email/subject/message; submit button but no integration | `index.html:1020-1045`; full inline JS `1078-1408` |
| Footer | Owner name,6 anchors, copyright2025 | `index.html:1052-1071` |
| README | User profile/goals/tools/projects; claimed use of GitHub/Vercel/Cloudflare | `README.md:1-69`; not build/deployment authority |

Preserve owner identity/legitimate project and social destinations as migration input. Confirm freshness/classification before carrying text verbatim: root education start says2024-Present (`index.html:912`), nested versions/README say2025-Present (`web-cv/index.html:528`, `README.md:56`). Skills progress says Bandit20 (`index.html:698`) while practice text says Bandit16→17 (`886`). Programs/practice are not automatically employment; owner should choose accurate labels. Existing README tone and future-goal claims are content decisions, not audited achievements.

## 5. Existing interactions: implemented vs decorative

| Feature | Verified source mechanism/status | Migration implication |
|---|---|---|
| Fake preloader | DOMContentLoaded increments width by5 every100 ms, then two500 ms timers, `index.html:1080-1102`; unrelated to actual resource readiness | Remove or redesign based on meaningful loading state; no need for forced wait |
| Typewriter | Local timeout loop for owner name/roles, `1109-1152` | Can replace with lighter accessible hero role treatment |
| Mobile nav | Toggle hidden class and close on link, `1154-1168`; desktop md layout in430/440 | Rebuild shared responsive nav with keyboard/ARIA/focus |
| Smooth anchors | `a[href^='#']` prevents default and queries selector then80 px offset scroll, `1183-1198` | Has concrete invalid '#' risk, see below |
| Back-to-top | Anchor exists1074, show/hide over300 px at1170-1181 | Retain only if useful; nested variants omit matching DOM element |
| Matrix background | Canvas2D DPR sizing, random glyphs, rAF, resize listener, `1200-1407` | Decorative, potentially expensive; no performance benchmark made |
| Scanline/neon/project tilt | CSS `127-152,253-272` and other styles | Source effects, not working application features |
| Skill bars | Static text/widths; no skill state data model in root | Fix mismatched values rather than animate conflicting literals |
| Download CV | href'#', no download attribute or PDF,533-535 | Not a working download |
| Project resources | Lab Setup731, Fellowship774,Challenge Portfolio796,Learning Resources838 all href'#' | Placeholder controls; require actual URL or remove CTA |
| Contact form | No action/method/name/required fields, no form-submit listener/fetch/email service in inline JS | Visual form only; don't claim messages are sent |
| Social links | Owner GitHub/LinkedIn/TryHackMe anchor URLs,1006-1013 | Preserve validated destinations; provide accessible names |
| Theme/search/blog/research data | No active theme toggle, search, RSS or reference-style research tabs | New scope must be deliberately approved |

Existing website was source-audited with targeted local browser verification, not a full second browser UX campaign. Parent opened unchanged local files via file://: root preloader cleared and H1 rendered; clicking Download CV threw the exact '#' selector error; filling all four form fields still produced an empty FormData array because names are absent. Nested variant stayed at preloader0%, empty H1 and Script error; separate Node check identifies its exact syntax error. Evidence `existing-runtime-parent-verification.json`. These are local results, not claims about exact production deployment bytes. Public domain200 is availability only; no form submission performed.

## 6. Reproduced defects và source risks

1. Legacy external scripts are syntactically invalid. Both copies end with literal `</script>` at `web-cv/script.js:330` / `html,js,css/script.js:330`. Read-only `node --check -` returned exit1, `SyntaxError: Unexpected token '<'`; root HTML inline script passed exit0. Evidence `existing-javascript-syntax-checks.json`. Do not choose legacy split tree as the canonical app simply because its organization looks cleaner.

2. Legacy script expects `#back-to-top` (`web-cv/script.js:93-101`) but nested HTML doesn't include it before loading script (`web-cv/index.html:667-692`). If parse error were removed, null access on later scroll is another source-level issue. Not runtime-reproduced because source remains unchanged.

3. Placeholder '#' is passed to `document.querySelector(targetId)` in root (`1184-1189`) and legacy script (`106-111`); isolated browser probe throws SyntaxError and parent also reproduced it by actually clicking Download CV on unchanged local root HTML. Thus Download CV and four placeholder project links have a clear failing selector path, not real destinations. Evidence `existing-selector-probe.json` and `existing-runtime-parent-verification.json`; no claim of full production regression testing.

Form verification bổ sung: all four inputs were filled with audit values; browser `new FormData(form)` remained `[]`, all field names empty, required=false, form method=get and action=current local page. No submit was made. This confirms a visual form without a functional delivery path, beyond merely observing a missing backend in source (`index.html:1020-1045`).

4. Static skill label/width mismatch examples: Metasploit40% vs55% (`554-558`), Web30% vs50% (`564-568`), Programming55% vs45% (`618-622`), Wireshark45% vs55% (`628-632`), Nmap65% vs50% (`638-642`). Source literal conflict verified; no endorsement of either percentage. Replace with one data value or qualitative proficiency.

5. Root viewport disables zoom via maximum-scale1/user-scalable=no (`index.html:6`), while nested versions don't (`web-cv/index.html:5`). Icon-only mobile/social controls lack accessible names in markup; no first-party reduced-motion branch. Long neon effects and root font-size overrides12/14 px need readable mobile review. Source concerns, not accessibility conformance certification.

6. CDN Tailwind has no locked local dependency/build, unlike reference. Runtime availability/CSP and upstream changes affect production. Font resources are declared both stylesheet and CSS font-face; copied identities/assets/legacy routes spread maintenance across variants. `README.md` claims Vercel plus GitHub Pages, but tracked workflow shows only Pages; no supplied Vercel build config proves a second active pipeline.

7. Root HTML includes inline CSS/JS and owner contact data; no application-specific automated tests or deployment validation step. This is a maintenance/validation gap, not proof all behavior fails.

## 7. Keep / replace / review

| Preserve infrastructure or source input | Replace in redesigned implementation | Requires owner decision |
|---|---|---|
| Exact CNAME domain and published-root contract | Monolithic/repeated markup and runtime Tailwind CDN | Single-page vs separate public routes |
| main-triggered Pages deployment intent, permissions, concurrency, environment | Placeholder Download/resource CTAs and ineffective form | Approved PDF and working project URLs |
| Owner identity, real social links, current content as review input | Inconsistent skill labels/widths and duplicate content sources | CV dates/program vs employment wording and current milestones |
| Existing assets as originals until replacement approved | Large base64-raster SVG as served small icon | Updated avatar/logo and asset rights |
| Branch/rollback boundary; preserve current implementation in this phase | Zoom restriction, inaccessible controls, uncontrolled motion | Contact transport, address, analytics/privacy choices |
| Cloudflare/DNS/Pages settings untouched | Legacy broken JS/duplicate published variants in future artifact | Whether legacy paths need redirects/archive compatibility |

No duplicate cleanup, script repair, backend integration, dependency install, deployment-workflow edit or asset conversion was performed in Phase1. Hash comparison at `final-verification.json` verifies every original non-git development file, main ref and tracked git diff remain unchanged.

## 8. GitHub Pages migration recommendation

Favor static generated public output with reusable sections/data and explicit base URL handling, as described in [reference audit](reference-audit.md). Do not inherit Next server runtime/Resend merely to reproduce visual style. If Next is chosen after approval, first replace server actions then prove static export separately; the current root upload workflow cannot build it.

When implementation is approved later, generate a dedicated public artifact containing only intended routes/assets/CNAME, validate fresh deep links on custom-root/project-subpath and use an isolated review path before any production action. Keep audit/source/archive material out of deployed output through a reviewed artifact configuration. No assumption that a local CNAME alone configures DNS or that Pages public API404 authorizes any infrastructure repair.
