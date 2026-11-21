# Release integration — final portfolio

This production-repository release branch integrates the frozen Round 3 candidate without modifying its application source, motion, content, tests, dependency lockfile or Next.js configuration. `README.md` and `SOURCE-INVENTORY.json` are retained byte-for-byte as the review snapshot's historical documents; their review-only descriptions are not the current production-repository integration status. This file describes the release-specific additions.

## Traceability

- Production repository: https://github.com/r00tK1ngX/my-cv
- Release branch: `release/final-portfolio` (prepared locally; publication requires approval).
- Production base: `f62fc0fa5c33bb65f0ac411fbfcc935294684745`.
- Frozen review input: `e8165edd814d940744154920640590b0801d6742` from `r00tK1ngX/my-cv-review`, branch `review/phase5-focus-restoration-round3`.
- Frozen input tree: `aea97ae20dda9feddfb79d006804bda79e28e20c`.
- Frozen input source snapshot SHA-256: `39adccd966ec055f672422552be92dd02525f1f7977258c95d41c36fe502b245`.

Integration preserves both ancestries in a merge commit: production base first parent, frozen Round 3 second parent. The legacy root HTML and duplicate legacy applications/assets are removed from the release tree, not rewritten out of history. Root `CNAME` is preserved unchanged. All 94 Round 3 tracked paths retain their exact bytes. Added release-only inputs are this document, `scripts/verify-release.mjs`, and the replacement deployment workflow.

## Build and static output

Use Node 24.19.0 and npm 11.19.0. From a clean checkout:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run build
npm run verify:export
node scripts/verify-release.mjs
```

`next build` performs static export to `out/`; do not run `next export`, `next start`, or upload the repository root. The extra release validator checks output classes, exact copied public-legal bytes, all 16 HTML/navigation routes, static 404 and self-hosted runtime resources. Its ignored `qa/` result is not served or uploaded. It is bounded release validation, not authenticated approval or trusted-build attestation.

The custom-domain root uses `trailingSlash: true`, no `basePath` or `assetPrefix`, and `images.unoptimized: true`. Do not silently add `/my-cv` to URLs. Preserve `_next/`, `index.txt` and `__next.*.txt` resources required by App Router navigation. Contact uses the existing mail-client draft fallback, not a backend. Blog and Research remain intentionally empty public collections.

## Deployment boundary

`.github/workflows/static.yml` validates PRs to main without upload/deploy and builds/uploads/deploys only on an authorized push to main in `r00tK1ngX/my-cv`. It installs from the lockfile, runs typecheck/lint/build and both output validators, then uploads only `out/`. Build has contents-read permission; deploy has Pages/OIDC grants and uses the existing `github-pages` environment. There is no manual-dispatch entry point.

The Pages configuration step uses `enablement: false` and does not inject framework configuration. Its host/base-path guard requires the existing `chauanhdung.id.vn` root without assuming the scheme reported by Pages settings. It does not create a site, move DNS, replace the custom domain, or change HTTPS enforcement.

Authenticated read-only Pages inspection found `build_type: legacy`, source `main:/`, custom domain `chauanhdung.id.vn`, `https_enforced: false`, and site URL `http://chauanhdung.id.vn/`. The environment branch policy permits main. Before any approved main update, the Owner must authorize and perform the switch from legacy root publishing to GitHub Actions during the release window. This source mode is a concrete activation prerequisite; do not push the new main while legacy root publishing is still active. The real browser reached the current HTTPS site, so `https_enforced: false` is recorded as preserved hosting state, not proof HTTPS is broken or permission to change it. Final guard checks host/path only; no HTTPS-enforcement change is required by source transfer. Actions-mode Pages uses the settings custom domain; root CNAME remains a preserved configuration record, not an asset copied to `out/`. No settings were changed in this preparation task. Recheck live HTTPS during the approved release; investigate only an actual failure.

The repository has Vercel deployment integrations for `my-cv` and `my-cv-web`. A branch push can create previews and a main push may create production deployments independent of this workflow. Owner checks provider production branch, framework/build/output (`out`), domain ownership and desired release behavior before publication. No provider or DNS change is authorized by preparation of this branch.

## Known limits and acceptance

The final focused Round 3 browser evidence is reused because the application source is unchanged; it is not re-executed for transfer. Manual contrast conformance, Safari/WebKit runtime compatibility, physical devices and real screen readers are not certified. Preserve historical timing failures and explicitly unexecuted coverage gaps. Checksums identify bytes, not an approving person or a trusted CI build. Actual GitHub-hosted build, artifact upload, deployment and live custom-domain smoke tests occur only after separate release authorization.

The private local handoff directory contains the exact release commit identity, source-transfer manifest, build/route evidence, complete limitations, checksums, and guarded approval-only merge commands. Do not copy those internal reports into `public/` or `out/`. No production release is claimed by this document.
