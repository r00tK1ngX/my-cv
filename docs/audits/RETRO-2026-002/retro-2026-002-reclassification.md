# RETRO-2026-002 — Phase Boundary Reclassification & Audit Correction

## 1. Executive Summary

**Phase 2: FAIL. Phase 3: PASS WITH CONDITIONS. Phase 4: NOT READY.** RETRO-2026-001 documented real gaps in the legacy site, but used missing implementation and deployment evidence to fail architecture design. The Project Owner has confirmed that Architecture Specification v1.0 was approved in a prior conversation. That approval establishes the design decisions; it does not establish that the specification is committed, the design is implemented, or production is ready. This addendum supersedes the Phase 3 verdict and phase assignments only. The original audit and its evidence are preserved.

## 2. Audit Scope and Evidence

- **Owner decision record:** the RETRO-2026-002 brief explicitly attests to approval of Architecture Specification v1.0 and records `stack=next`, `contact=mailto`, and `approval=approve`. This audit accepts that attestation as the design authority; it did not independently recover the earlier conversation or the full approved document.
- **Repository history:** `audit/retro-2026-001` at `f29d88fed3dbee75927e077de9a12332cd408a92` has parent `f62fc0fa5c33bb65f0ac411fbfcc935294684745` (the checked `main`). The diff adds only the three RETRO-2026-001 documents. The base tree has a legacy root `index.html` and a Pages workflow, no tracked Next.js scaffold or committed standalone Phase 2/3 specification. Neither the tree nor the diff is a record of what was approved in conversation.
- **[Original audit](../RETRO-2026-001/retro-2026-001-audit.md):** examined all 20 finding IDs, current-state evidence, and §§11–13 for the original verdicts. References to legacy content describe what the old site showed, not proof of personal claims.
- **[Public route probe](../RETRO-2026-001/public-route-probe.json):** dated 2026-11-18. Of the 16 planned URLs, `/` returned 200 and the other 15 returned 404; `/sitemap.xml` returned 404 and `/robots.txt` returned 200. The homepage markers record the presence of excluded legacy material and outdated contact indicators without publishing values. These observations are historical, not a test of the redesign or a new production check.
- **[Final audit verification](../RETRO-2026-001/final-audit-verification.json):** identifies 20 findings, 16 distinct planned URLs, one matching source HTML route, and the previous verdicts. This published JSON is a filtered historical summary, not a QA sign-off.
- **Local Phase 0/1 records:** `docs/project-setup.md:5–14,22–38`, `docs/evidence/coverage-summary.json:2–15` and `docs/evidence/final-verification.json:97–119` corroborate the setup and reference audit. These are local baseline records, not part of the public addendum.
- **Deployment source:** `.github/workflows/static.yml:4–10,31–43` restricts push-triggered deployment to `main`, also allows manual dispatch, and uploads `.` with no Next build stage. `CNAME:1` is a repository domain marker, not proof of provider-side settings.

## 3. Original RETRO-2026-001 Verdict

RETRO-2026-001 §§11–13 recorded **Phase 2 FAIL**, **Phase 3 FAIL**, and **Phase 4 NOT READY**. The Phase 3 rationale combined missing design documentation with missing Next.js configuration, route output, locale features, build/deploy workflow, and production checks. The observations stand at their original scope; the inference that missing implementation means architecture failed does not. Phase 2's verdict and the Phase 4 gate stand, for the reasons below.

## 4. Corrected Phase 2 Verdict

**FAIL — no complete, formally approved bilingual Content Specification and evidence matrix were established in the materials reviewed.** The Owner's architecture approval cannot substitute for content sign-off (PH2-01).

Keep PH2-02 through PH2-09 as evidence for what the content specification must resolve: positioning and skill coverage; excluded material in legacy source and the historical homepage; stale contact information (the original audit records that the approved LinkedIn destination was already present); unconfirmed experience, employment, research or achievement claims; project descriptions and links not yet validated; and the missing approved replacement PDF. The audit does not certify or disprove those personal claims and does not infer an internship from generic research wording. Unverified claims must be substantiated by the Owner or omitted. The PDF decision can be closed in the spec by explicitly deferring it and omitting the download control; actual PDF integration is Phase 5.

The Phase 2 gate is approval of the final EN/VI wording and a claim-by-claim matrix of evidence, publication status, and exclusions. Replacing legacy content on the website is not a prerequisite for approving that specification.

## 5. Corrected Phase 3 Verdict

**PASS WITH CONDITIONS — design approved; documentation and technical policy still need closure.** The following are accepted design decisions, not claims about tracked files or runtime behavior:

- Next.js App Router, React, TypeScript, Tailwind CSS v4; no runtime database, backend API, or Next.js Server Actions.
- `output: 'export'` with static output in `out/`; GitHub Pages serves the generated files; retain the existing Cloudflare DNS. Current provider configuration is a separate verification question.
- Contact is `mailto:` to the Owner-approved address (literal omitted from this public addendum), with no contact API or Server Action. Opening a mail client is not a delivery guarantee.
- English at root, Vietnamese under `/vi/`; no `/en/` prefix, no automatic browser-language redirect, and language switching preserves the equivalent page.
- Design baseline: [reference portfolio](https://rbn0x00.vercel.app/) with blue-black background, cyan/pink accents, Rajdhani and Oxanium direction, angular panels, a grid background, and responsive navigation. Implementation must avoid tablet header clipping, mobile Research tab overflow, hidden drawers staying keyboard-focusable, and scroll lock persisting on resize to desktop. Verify those in Phase 6 rather than assuming the reference behavior transfers correctly.

| Page | English | Vietnamese |
|---|---|---|
| Home | `/` | `/vi/` |
| About | `/about` | `/vi/about` |
| Experience | `/experience` | `/vi/experience` |
| Skills | `/skills` | `/vi/skills` |
| Projects | `/projects` | `/vi/projects` |
| Blog | `/blog` | `/vi/blog` |
| Research | `/research` | `/vi/research` |
| Contact | `/contact` | `/vi/contact` |

The matrix specifies 16 planned routes; it does not select a trailing-slash policy or prove any route was exported.

### Genuine Phase 3 closure conditions

| ID | Closure condition | Evidence needed to close at design stage |
|---|---|---|
| C3-01 | Commit the approved Architecture Specification v1.0 or an Owner-confirmed canonical ADR | Versioned document, approval provenance, and clear separation of approved decisions from the follow-up decisions below. This addendum is not that specification. |
| C3-02 | Record URL and locale policy | Decide canonical host, custom-root vs project-subpath support, explicit `basePath` and `trailingSlash`, URL/asset resolution and slash behavior. Record one route-pair source, equivalent-page switching, document `lang`, and unknown-route/404 policy. Document how any future dynamic route would enumerate build-time paths; no dynamic route is assumed. |
| C3-03 | Record static asset and export policy | Define the expected `out/` layout and public asset boundaries; choose a static-compatible image path, font loading/fallbacks and licensing requirements, and handling of public documents. Record reproducible Node/dependency/lockfile policy. No installation or successful build is required to close this design item. |
| C3-04 | Record CI/CD and hosting architecture | Specify validation/build flow, deploy triggers and authorization, GitHub Pages publication and rollback boundary, and an `out/`-only artifact allowlist with only approved public files and any required hosting markers; exclude audit evidence, legacy trees and source-only files. Record who can inspect/change Pages and Cloudflare, which checks require provider access, and that existing DNS is retained unless separately approved. Workflow edits and provider checks belong to Phase 7. |
| C3-05 | Record SEO and metadata architecture | Define per-locale titles/descriptions, canonical and reciprocal `hreflang` URLs, locale-aware Open Graph, sitemap and robots policy from the route map. Define Phase 5 implementation and Phase 6 acceptance checks without requiring those outputs yet. |
| C3-06 | Record contact and reference-design constraints | Capture the approved `mailto:` destination in the appropriate owner-controlled record, no backend/delivery-success claim, and acceptance criteria for the four reference defects. This is documentation of decisions, not a request to reopen approval of the stack or transport. |

## 6. Reclassified Implementation Findings

The following mapping preserves each original ID. A finding can span design, implementation, testing and release. **Confirmed failure** refers to an observed mismatch at a specified snapshot; **missing implementation** means the legacy tree does not contain the redesign feature; **conditional risk** depends on future choices or actions; **not verifiable** means the evidence cannot establish the claim; **accepted design decision** means Owner approval, not code or deployment.

| Original Finding | Original Phase | Corrected Phase | Classification | Rationale |
|---|---|---|---|---|
| PH2-01 | 2 | 2 | Confirmed gate failure | No completed approved EN/VI spec and claim-evidence matrix in the reviewed record. |
| PH2-02 | 2 | 2 → 5 | Confirmed legacy mismatch | Decide both language versions of the positioning in Phase 2; integrate them in Phase 5. |
| PH2-03 | 2 | 2 → 5 | Confirmed legacy gaps; proficiency not verifiable | Keep skills only with approved wording/evidence; integrate the approved data in Phase 5. |
| PH2-04 | 2 | 2 → 5 → 6 | Confirmed legacy mismatch; project details not fully verified | Approve project descriptions/URLs, then integrate project data and check links. |
| PH2-05 | 2 | 2 → 5 → 6/7 | Confirmed legacy violation at audit snapshot | Preserve exclusions in the spec; omit from the redesign and check the export and final public artifact. |
| PH2-06 | 2 | 2 → 5 | Confirmed legacy wording; claims not verifiable | Owner verifies or omits experience/research claims; do not equate historical copy with employment evidence. |
| PH2-07 | 2 | 2 → 5 → 6/7 | Confirmed legacy privacy/contact mismatch | Approve the public contact allowlist; integrate links and check output/production without repeating legacy contact values. |
| PH2-08 | 2 | 2 → 5 → 6 | Confirmed legacy placeholder; missing approved asset | Specify approved replacement or defer the CTA; integrate only an approved PDF and test the resulting link. |
| PH2-09 | 2 | 2 → 5 | Confirmed legacy claims; achievement/proficiency not verifiable | Approve evidence-backed bilingual entries or empty states before integration. |
| PH3-01 | 3 | 3 → 4 → 6 | Accepted stack; missing implementation | Legacy HTML is not the target stack. Scaffold and configure components/TypeScript/Tailwind in Phase 4; validate dependencies/build in Phase 6. |
| PH3-02 | 3 | 3 → 4 → 6 → 7 | Accepted export architecture; missing implementation/workflow | `output: 'export'` and `out/` are decided. Implement config in Phase 4, verify export in Phase 6, and add CI build/upload in Phase 7. |
| PH3-03 | 3 | 3 → 4/5 → 6/7 | Accepted route matrix; missing implementation; confirmed historical 404s | Phase 4 builds route shells/nav, Phase 5 integrates content, Phase 6 tests export/deep refresh, Phase 7 checks production. Historical 404s are not a redesign regression or a design failure. |
| PH3-04 | 3 | 3 → 4/5 → 6 | Accepted locale rules; open metadata policy; missing implementation | Equivalent-page switch/nav is Phase 4, translated content and metadata are Phase 5, parity and HTML checks are Phase 6. Absence in source does not negate Owner approval. |
| PH3-05 | 3 | 3 → 4 → 6/7 | Open design condition; conditional path risk | Record explicit URL policy in C3-02; apply it in code and validate routing, assets and redirects on static preview and target host. |
| PH3-06 | 3 | 3 → 5 → 6 | Accepted `mailto:` design; confirmed legacy form gap | Integrate the approved contact link without a server in Phase 5; verify destination and behavior in Phase 6, not email delivery. |
| PH3-07 | 3 | 3 → 4/5 → 6 | Open asset/SEO policy; legacy dependency risk; missing implementation | Specify policy in C3-03/C3-05; implement fonts/assets in Phase 4 and localized SEO in Phase 5; validate emitted assets and metadata in Phase 6. |
| PH3-08 | 3 | 3 → 7 | Confirmed root upload; conditional publication risk | Design the artifact allowlist now. Change and inspect the deploy artifact later; audit URLs on GitHub are not proof the docs were deployed to Pages. |
| PH3-09 | 3 | 3 / 7 | Accepted hosting/DNS boundary; NOT VERIFIABLE configuration | Define responsibilities in Phase 3; verify actual Pages and Cloudflare settings in Phase 7 with authoritative access. |
| PH3-10 | 3 | 3 → 4 → 6/7 | Accepted Tailwind v4; open version policy; missing implementation | Define supported runtime/lockfile policy, configure PostCSS/Tailwind in Phase 4, prove clean builds in Phase 6 and wire the runtime into CI in Phase 7. |
| PH3-11 | 3 | 3 → 4 → 6 | Conditional risk, not a missing feature | Explicit static routes need no dynamic parameter generator. If dynamic routes are later selected, document and implement finite prerender paths and test them. |

Phase 4 also owns design tokens, visual components and responsive layout; Phase 5 owns Blog/Research content (including honest empty states); Phase 6 owns responsive, keyboard, cross-browser, broken-link and static-export tests; Phase 7 owns Actions, artifact upload, Pages/custom-domain configuration, Cloudflare DNS validation and production smoke tests. None were performed for the redesign by this addendum.

## 7. NOT VERIFIABLE Findings

| Subject | Classification | Evidence boundary / next check |
|---|---|---|
| Actual GitHub Pages enablement, publishing source, domain and deployment state | NOT VERIFIABLE | PH3-09 records an unauthenticated API 404. That does not establish Pages is disabled; `CNAME` and workflow intent do not establish site settings. Phase 7 needs authorized read-only settings and deployment records. |
| Actual Cloudflare DNS, proxy, origin and TLS settings | NOT VERIFIABLE | Historical public resolution/response headers do not establish zone configuration. Phase 7 needs authoritative provider records or an Owner-supplied verified summary. |
| Exact deployment commit and origin for the historical route probe | NOT VERIFIABLE | Public HTTP establishes only the observed responses. Correlate with authorized deployment/hosting records if needed. |
| Full prior v1.0 text and private approval transcript | Not independently verified | Approval itself is accepted on the Owner's authority in this task. Commit the canonical artifact with appropriate approval provenance under C3-01. |
| Unconfirmed personal claims | NOT VERIFIABLE | Legacy markup proves publication of wording, not the truth of the underlying claim. The Phase 2 evidence matrix must substantiate or exclude it. |

## 8. Updated Phase Readiness Matrix

| Phase | Verdict | Basis |
|---|---|---|
| 0 — Setup | Complete | Project's recorded setup baseline; repository and exact base rechecked. Not a fresh audit of all historical setup activities. |
| 1 — Reference audit | Complete with conditions | Local evidence records 40 route/viewport cases and 109 screenshots; human screenshot review and rendered hover verification remain limited. This is reference coverage, not a redesigned-site QA pass. |
| 2 — Content specification | FAIL | Final approved bilingual spec and evidence matrix not established. |
| 3 — Architecture and i18n design | PASS WITH CONDITIONS | Owner approval is established for the core design; C3-01–C3-06 document what remains to close. |
| 4 — UI/UX implementation | NOT READY | Phase 2 and remaining Phase 3 gates are open; a separate Owner go-ahead is required. |
| 5 — Content and feature integration | NOT STARTED | No redesign integration verified in this review. |
| 6 — Testing and QA | NOT STARTED | Prior tests covered legacy/reference behavior, not the redesigned export. |
| 7 — Deployment and infrastructure | NOT STARTED | Legacy publishing setup is not a redesigned-site release; provider settings remain unverified. |
| 8 — Subsequent phase | NOT STARTED | Outside this correction's scope; no completion evidence. |

## 9. Remaining Blockers

Before starting Phase 4: obtain Owner approval for the complete Phase 2 bilingual spec and content evidence matrix; commit the canonical Phase 3 specification and close its documented conditions; then obtain explicit authorization to implement. The lack of a tested export, live routes, or verified provider settings is a later QA/release gate, not evidence against the architecture approval. The legacy privacy issue remains actionable, but this audit does not authorize a production hotfix.

## 10. Recommended Next Tasks

1. Finalize the EN/VI content and evidence matrix for Owner review, including exclusions, which contact details may be published, project descriptions and links, and the PDF decision.
2. Commit the approved architecture specification and record outstanding policy decisions against C3-01–C3-06. Keep all implementation and deploy permissions separate.
3. After explicit approval, scope Phase 4 scaffolding and layout against the approved reference direction. Queue Phase 5 integration, Phase 6 validation of the 16-route export, and Phase 7 authorized provider verification and production checks as separate gates.

## 11. Limitations

This was a repository/evidence review, not a repeat of the live probe or an independent check of provider dashboards or personal credentials. No Next.js code was authored, dependency installed, build run, form submitted, QA pass claimed, workflow dispatched, or hosting/DNS setting changed. This public addendum does not republish raw evidence, local paths, private contact values or a personal phone number. The prior report is retained as written, including its historical verdict.

## 12. Owner Approval Required

The prior architecture approval stands; it does not authorize implementation. The Owner must approve the Phase 2 content specification and the remaining Phase 3 decisions, then explicitly authorize Phase 4. Deployment and infrastructure changes require their own authorization. Publishing this addendum is a documentation-only operation, not sign-off for a later phase.
