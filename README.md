# Bilingual CV website — source review copy

This repository is an isolated source-code review copy. It is not connected to production hosting or automatic deployment.

This is a review candidate, not a production-ready release or final product acceptance. No GitHub Actions workflow, GitHub Pages configuration, Vercel project connection, deployment secret or domain configuration is included.

## Overview and stack

A bilingual personal portfolio built with Next.js 16.4.6 App Router, React 19.3.1, TypeScript 5.9.3 and Tailwind CSS 4.3.5 through the PostCSS plugin. Fonts are self-hosted with Fontsource. Tailwind's configuration is CSS-first in `src/styles/globals.css`; no separate Tailwind JavaScript configuration is required.

The application is statically exported. Contact prepares an encoded `mailto:` draft, not a server-delivered message. Blog and Research intentionally have empty public collections. No replacement CV PDF or unsupported achievement data is supplied.

## Routes and language architecture

| Page | English | Vietnamese |
|---|---|---|
| Home | `/` | `/vi/` |
| About | `/about/` | `/vi/about/` |
| Experience | `/experience/` | `/vi/experience/` |
| Skills | `/skills/` | `/vi/skills/` |
| Projects | `/projects/` | `/vi/projects/` |
| Blog | `/blog/` | `/vi/blog/` |
| Research | `/research/` | `/vi/research/` |
| Contact | `/contact/` | `/vi/contact/` |

English is the root language. The language switch preserves the equivalent page. Separate root layouts set the actual HTML language. The global static 404 is English. Route helpers and metadata live in `src/lib/`; content is in `src/data/portfolio.ts`.

## Clean installation and checks

Use Node **24.19.0** from `.node-version` and npm **11.19.0** from `packageManager`. Python 3.9+ is needed only for the local preview and its containment test. Do not supply production credentials or an environment file.

Run from a clean checkout:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run test:unit
python3 -B -W error::ResourceWarning -m unittest discover -s tests/python -v
npm run build
npm run verify:export
```

`npm run build` already performs the static export because `next.config.ts` sets `output: "export"`. The expected output is **`out/`**, with directory-index HTML for the sixteen public page routes, `404.html`, sitemap, robots, JS/CSS, self-hosted fonts, legal notices and App Router navigation payloads. No separate `next export` command or running Next server is required.

`verify:export` is a bounded local check of routes, metadata, links, assets and content/privacy exclusions. It is not an independent production artifact-policy or release-approval system. It writes ignored local QA output, which must not be committed or served as part of the site.

## Local development and static preview

```sh
npm run dev -- --port 4174
```

For the built static site, stop development and run:

```sh
npm run preview
```

Preview binds only `http://127.0.0.1:4173` and serves `out/`, never the repository root. Do not run development and a production build concurrently against the same `.next/` directory.

Optional browser tests are source tests, not recorded evidence. With preview running and Chromium installed locally:

```sh
npx playwright install chromium
npm run test:integration
```

These commands do not deploy the website. Test reports, screenshots, caches and recordings generated locally are ignored and excluded from the source-review inventory.

## GitHub Pages compatibility assumptions

The architecture supports static directory-index hosting at a custom-domain root with `trailingSlash: true` and root-relative assets. The production-origin metadata and existing public project/contact URLs are preserved as application content; their presence does **not** configure a domain or connect this review repository to hosting.

Serving this build under a GitHub project subpath would require a separately reviewed configuration and rebuild. Valid `_next/`, `index.txt` and `__next.*.txt` navigation resources must be retained. Unknown paths should return the static `404.html` with HTTP 404, not a catch-all SPA response. Real Pages MIME types, HTTPS, redirects, deep refresh and proxy/cache behavior have not been verified for this isolated repository. There is no deployment workflow here; do not enable hosting as part of code review.

## Review scope and packaging

This Round 2 accessibility-remediation candidate is based on immutable review commit `a2f175dbe0f55268fdd734afb460a860f77b5a6c` (whose parent is `da419d73a1cbc58e3e3929f4b4e29001fe8ee87a`). It fixes mixed pointer/keyboard modal focus containment, narrows the modal semantic boundary to the existing header close control and mobile drawer, and advertises the controls relationship only while its target is mounted. Permanent EN/VI regression tests cover the exact pointer-down/drag/release then Shift+Tab reproduction. The visible wordmark, CSS, typography, layout, animation definitions, personal claims, dependencies and static-export configuration are unchanged. This local-only branch is not authorized for publication or deployment.

The original source-review packaging remains: public inventory, generated-file ignores, sanitized third-party notice provenance, and omission of internal QA recordings and private/obsolete data. The public inventory is refreshed for this candidate; it is not a deployment approval. The modal uses native `inert` for background interaction plus synchronized accessibility state, and both existing close controls remain available within the modal scope.

Known limits include the need for real screen-reader/device validation, WebKit host-library availability, residual cold-font layout shifts, experimental global-not-found support, the mail-client dependency and remaining content/release decisions. Chromium/Firefox regression tests are source assertions, not a conformance certificate. Lint and installation warnings must be read rather than treated as a zero-warning guarantee.

See `SOURCE-INVENTORY.json` for the exact intended source-review paths and hashes. It excludes itself to avoid a circular hash. Licensing and attribution are in `THIRD-PARTY-NOTICES.md` and `public/legal/`.
