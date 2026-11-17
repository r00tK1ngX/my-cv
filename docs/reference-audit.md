# Reference audit — Phase 1 final report

Reference: https://rbn0x00.vercel.app/ · Local source: `/home/r00tK1ngX/web_CV` (read-only). Development: `/home/r00tK1ngX/my-cv-redesign`, branch `redesign/portfolio-v2`. Audit observation date from live clock: 2026-11-17 UTC. Source paths below are relative to reference unless explicitly prefixed `my-cv-redesign/`.

## 1. Executive summary

Reference là portfolio Next.js App Router/React/TypeScript với Tailwind CSS v4, phong cách nền navy tối, cyan/magenta, hình học góc cắt, typography Oxanium/Rajdhani. Homepage tái sử dụng trực tiếp các page Experience, Skills, Projects; About, Blog, Research, Contact là các route riêng. Hành vi nổi bật là canvas particles, typewriter tự viết, CSS glitch/orbit/scan-line, reveal qua IntersectionObserver, skill counters, menu mobile, research tabs và Medium feed client-side.

Đã kiểm tra tám route ở cả năm viewport, tổng 40 trường hợp, lưu 109 PNG gồm top đúng kích thước và full-page/section/state. Đã thử links/navigation/card bodies/tabs/menu/inputs/validation và nhánh lỗi mạng. Không gửi email thật. Không cài package, build, lint autofix, triển khai website mới hoặc thay đổi hạ tầng. Các chứng cứ runtime nằm trong `docs/evidence/`; checksum/metadata xác nhận ranh giới thay đổi tại `evidence/final-verification.json`.

Bốn điểm cần quyết định trước Phase 2: frontend tĩnh có thể tái hiện trên GitHub Pages nhưng Resend server action không thể chạy nguyên trạng; content và tài sản nhận diện reference không được mặc nhiên mang sang CV của Dũng; breakpoint header/tab mobile có lỗi clipping cần sửa thiết kế; image-analysis API và hover emulation chưa cho phép xác nhận đầy đủ visual fidelity.

Đây là audit đã hoàn tất ở mức source/DOM/CSS/browser nêu rõ; không tuyên bố production build, email delivery, image pixel review hoặc hover render đã được chứng nhận.

## 2. Phương pháp và mức chứng minh

- `S`: source đã đọc/truy vết; file:line là evidence trực tiếp.
- `B`: browser thật/DOM/computed CSS/interaction observed; JSON và screenshots là bằng chứng.
- `H`: read-only HTTP/API lookup; không đồng nghĩa backend integration hoạt động.
- `R`: kiến nghị; chưa triển khai.
- `U`: chưa xác minh; không dùng làm kết luận khẳng định.

Phạm vi filesystem: 75,456 files được kiểm kê metadata, gồm 75,400 vendor files trong node_modules và 56 files ngoài vendor. Toàn bộ first-party source/config/docs/assets được phân loại; không đọc memory core dumps, credentials hoặc mọi dòng vendor source. 14 core dumps tổng 9,675,776,000 bytes được ghi metadata, không suy đoán nguyên nhân crash từ tên file. Reference không có `.git`, vì vậy không có local reviewed commit; dùng hash baseline cho source. Development reviewed HEAD `f62fc0fa5c33bb65f0ac411fbfcc935294684745`.

Evidence: `evidence/repository-baseline.json`, `source-file-index.json`, `dependencies.json`, `reference-assets.json`, `browser-protocol.json`, `coverage-summary.json`. Quy trình/giới hạn đầy đủ: [project setup](project-setup.md).

## 3. Technology stack đã xác minh

Không chấp nhận README làm version truth. `README.md:3,11` vẫn ghi Next.js14/template; code và package metadata mới hơn.

| Công nghệ | Khai báo package.json | Lock + installed local | Usage thực |
|---|---|---|---|
| Next.js | `^16.1.6` (`package.json:65`) | `16.4.3` (`package-lock.json:10358` entry; installed package manifest) | `app/layout.tsx`, 8 app routes, next/link/navigation, server action |
| React / React DOM | `^19.2.4` (`67-68`) | `19.3.1` cả hai (`lock:10784,10794`) | Function components, hooks, event handlers |
| TypeScript | `5.6.3` (`100`) | `5.6.3` (`lock:11464`) | `.tsx`, interfaces/types; strict/noEmit/bundler aliases |
| Tailwind CSS | `4.1.11` (`98`) | `4.1.11` (`lock:11356`) | `globals.css:1`; CSS-first theme/plugin/source directives |
| Tailwind PostCSS | `4.1.11` (`77`) | xem full version matrix | `postcss.config.js:1-5` |
| HeroUI React | `^2.8.8` (`38`) | `2.8.10` (`lock:1376`) | Theme CSS active via `hero.ts`; many installed component packages; provider/components scaffold mostly dormant |
| NextUI legacy | `^2.6.11` (`54`) | `2.6.11` (`lock:5358`) | Declared/installed; not imported by active route rendering |
| lucide-react | `^0.563.0` (`63`) | `0.563.0` | Active nav/cards/research/forms icons |
| react-icons | `^5.5.0` (`69`) | `5.7.0` | Active social/project/research icons |
| Framer Motion | `11.18.2` (`60`) | `11.18.2` (`lock:9568`) | Direct dependency/scaffold ecosystem, not visible homepage animation mechanism |
| Motion | `^12.29.2` (`64`) | `12.43.0` (`lock:10238`) | `motion/react` in dormant typewriter helper |
| next-themes | `0.4.6` (`66`) | `0.4.6` | Dormant Providers/ThemeSwitch; no rendered theme control |
| Resend | `^6.9.1` (`70`) | `6.37.0` (`lock:10865`) | Active imported server action `app/contact/actions.ts:3-31` |
| he | `^1.2.0` (`61`) | `1.2.0` | HTML encode email content in server action |
| Vercel Analytics | `^1.6.1` (`57`) | `1.6.1` (`lock:8102`) | Layout Analytics; script loaded200 in browser, ingestion unverified |
| Google Fonts | stylesheet external | Not npm asset | Oxanium/Rajdhani rendered; JetBrains Mono requested but no active usage shown |

Full matrix covers 61 dependencies,26 devDependencies, declared/locked/installed versions and installed license fields in `evidence/dependencies.json`; all87 direct entries are recorded rather than omitted. Lockfile v3 has1,128 package entries including root. Installed package versions are local facts, not proof of exact deployed framework version. Deployment markup/components match inspected paths, but source commit/build identity remains unknown.

Notable tooling mismatch: React runtime19 with `@types/react18.3.3`/react-dom18.3.0; Next16 runtime with Next ESLint15.5.9 (`package.json:75,80-85`). Potential compatibility/maintenance risk, not claimed compiler failure because no build was executed. Local Node24.19.0/npm11.19.0 were read only; installed Next requires Node≥20.9.0. These versions are not requirements already selected for redesign.

## 4. Directory structure và entry points

```text
web_CV/
  README.md                   template instructions; version claim stale
  LICENSE                     MIT, Copyright 2023 Next UI
  package.json                website1.1.0, private, scripts/dependencies
  package-lock.json           npm lockfile v3
  .npmrc                      package-lock=true
  .gitignore                  ignores build/vendor/env and all common lockfiles
  next.config.js              empty nextConfig
  postcss.config.js           @tailwindcss/postcss
  tsconfig.json               strict, noEmit, aliases @/*, bundler resolution
  eslint.config.mjs           ESLint flat config/react/a11y/prettier
  components.json             shadcn registry/scaffold config
  hero.ts                     heroui() CSS plugin
  app/
    layout.tsx                RootLayout + metadata/background/nav/footer/Analytics
    page.tsx                  homepage + hero functions/canvas/typewriter
    providers.tsx             dormant HeroUI/next-themes adapter
    error.tsx                 error boundary, Try again button not wired
    about/page.tsx            biography/capabilities
    experience/page.tsx       timeline + derived stats
    skills/page.tsx           skill cards/progress/counters
    projects/page.tsx         project cards/code/demo CTA
    blog/page.tsx             RSS fetch/cards/states/stats
    research/page.tsx         CVEs/exploits/bounties + tabs
    contact/page.tsx          controlled form + contact cards
    contact/actions.ts        use server / Resend email
  components/
    navbar.tsx                active logo/header/mobile drawer
    icons.tsx                 scaffold SVG exports
    counter.tsx               dormant HeroUI count demo
    primitives.ts             dormant Tailwind Variants title/subtitle
    theme-switch.tsx          dormant theme control
    ui/spotlight.tsx           dormant SVG helper
    ui/typewriter-effect.tsx   dormant Motion helpers
  config/fonts.ts             dormant Inter/Fira_Code config
  config/site.ts              name/description active; template nav arrays unused
  lib/utils.ts                cn helper used in dormant UI modules
  styles/globals.css          imports/theme variables/base/scroll/animations
  types/index.ts              IconSvgProps type
  public/hacker.png            active 500×500 hero asset
  public/favicon.ico          served icon,3 resolutions
  hacker.png                  duplicate outside public
  favicon.ico                 duplicate outside public
  dev.log, next.log           historical existing local dev output
  core.<pid> ×14               crash artifacts; not read/executed
  node_modules/               existing installation, not redistributed audit code
```

Tree exhaustive at first-party file level; repeated core filenames and complete counts/sizes in baseline manifest. No `.git`, `.next`, `out`, Vercel config, GitHub workflow, route-handler files, middleware/proxy, data-store config, application tests or test script found in supplied first-party tree. `components.json` specifies `rsc:true`/tsx/new-york/neutral/lucide/Aceternity registry, but does not prove the active UI uses every library/registry component.

Main rendering path: `app/layout.tsx:23-98` → Navbar + `<main>{children}</main>` → route default export. Homepage `app/page.tsx:6-8,395-408` imports Experience/Skills/Projects page modules directly. [Complete component map](reference-component-map.md) records every major section, symbol and active/dormant distinction.

## 5. Architecture, routing và state

Eight file-based routes, no dynamic route params discovered. Header uses route links `/about`, `/experience`, `/skills`, `/projects`, `/blog`, `/research`, `/contact` (`components/navbar.tsx:23-31`). Homepage hero instead uses hash anchors `#projects`, `#experience` (`app/page.tsx:327,332`); wrappers at396/401/406 provide targets. Footer contact is route link, not homepage contact section. No auth/private dashboard routes despite unused scaffold entries in `config/site.ts:6-60`.

State is component-local React `useState`/effects/refs: menu/scrolled/pathname, hero loaded and typewriter, IO visibility, skill/stat timers, RSS loading/posts/error, research selected/animateContent, contact form/status. No Redux/Zustand/global domain state, database, persisted user settings or first-party localStorage path found. Providers/next-themes exist but RootLayout does not mount them (`app/layout.tsx:1-6,57-61` vs `app/providers.tsx:23-31`).

Rendering primarily uses semantic HTML + inline Tailwind classes, lucide/react-icons and locally defined functional components. Source values and styles are duplicated across route modules. Source hero typewriter is custom hook, not installed `typewriter-effect`; visible animations are CSS + canvas + IO/timers rather than Motion page orchestration. See [feature inventory](reference-feature-inventory.md), F09–F47.

External boundaries: Medium→rss2json→client fetch (`blog:164-199`); Resend via Next server action (`contact/actions.ts:1-32`); external fonts (`layout:31-36`); Vercel Analytics (`layout:3,94`); simple outbound GitHub/LinkedIn/NVD/Exploit-DB/demo links. No CMS, project API, live skill API or vulnerability database query in research cards.

## 6. Build process và deployment compatibility

Scripts (`package.json:5-9`):

- `dev`: `next dev -H 0.0.0.0 --turbopack`, development server exposed on all interfaces. Not started by this audit.
- `build`: `next build`, not a static export by current config.
- `start`: `next start`, expects Next server deployment.
- `lint`: `eslint --fix`, mutating; deliberately not run.

CSS pipeline is `styles/globals.css:1-8` → tailwindcss/tw-animate-css → HeroUI plugin `hero.ts` and `@source` theme scan; PostCSS plugin `postcss.config.js`. TS configuration `tsconfig.json:2-33` includes strict/noEmit/bundler/React JSX and incremental=true. A build/dev/typecheck could create generated files, which is why no command was run in read-only reference.

Only npm lockfile supplied. `.gitignore:37-40` ignores pnpm/yarn/npm/bun lockfiles despite `.npmrc:1` enabling package-lock. This conflicts with durable reproducibility if source is later put under git without adjusting policy; do not silently remove the supplied lock. `README.md:29-51` lists alternative package managers generically but does not prove they were used. `dev.log:6-10` and `next.log:1-5` show historical Next16.4.3 readiness, not fresh audit build success or crash diagnosis.

GitHub Pages is static hosting per https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages . Next static export requires `output:'export'` and produces out HTML/assets; official unsupported list includes Server Actions: https://nextjs.org/docs/app/guides/static-exports (read-only captured text in `evidence/platform-docs.json`). Supplied `next.config.js:1-4` is empty. `sendContactEmail` is a server action imported by Contact: unchanged reference is not a drop-in Pages artifact.

Frontend feasibility is high by mechanism: static content/routes, CSS/canvas/timers, local tabs, native validation and anchors can run as HTML/CSS/JS. This is an architectural assessment, not a proven export build. RSS depends on public CORS/quota; email requires external endpoint or mailto; Vercel relative analytics endpoint is not automatically available on Pages. Root-absolute links/assets (`/hacker.png`, `/favicon.ico`, route hrefs) need base-path handling for a project subpath, while custom domain normally serves root. Multi-page static route directories with trailing slashes are safer on Pages than history-only SPA routing. No deployment configuration was changed to test these proposals.

## 7. Assets và licensing

Assets: `public/hacker.png`500×500,170,164 bytes; favicon15,086 bytes containing48/32/16 px ICO entries. Root copies byte-identical by SHA-256 (`evidence/reference-assets.json`). Only public copies are conventional served assets. Hero plain `<img src='/hacker.png'>`, hides image on error and includes RBN text underlay (`app/page.tsx:195-209`). Project illustrations are SVG icons/CSS gradients, not screenshot files. Blog thumbnails come from feed URLs with error fallback (`blog:42-78`). No local WOFF/TTF/PDF/video assets in supplied first-party tree.

`LICENSE:1-21` grants MIT use/copy/modify/distribute/sublicense/sell with retention of copyright and permission notices in copies/substantial portions; copyright is `2023 Next UI`. `README.md:53-55` links HeroUI template MIT license. This supports reuse of supplied template code subject to notices. It does not demonstrate that the template author owns every later portfolio paragraph, hacker illustration, avatar, icon source or Medium article. No author-specific asset attribution/permission evidence was supplied.

Direct dependency license fields are recorded per package. Examples: Next/React/Tailwind/HeroUI/Resend MIT; TypeScript Apache-2.0; lucide-react ISC; Vercel Analytics MPL-2.0. react-icons is MIT as a package but bundled icon sets have their own terms: active `react-icons/fa` maps to Font Awesome5, listed CC BY4.0 in `node_modules/react-icons/README.md:72` and `node_modules/react-icons/LICENSE:10-17`; active `react-icons/si` maps to Simple Icons, listed CC0 1.0 Universal at `README.md:91` in that package. Preserve applicable attribution and check brand/trademark terms separately. Google Fonts licenses/redistribution terms must be checked for the exact families/files if self-hosted later; do not treat the repo MIT notice as blanket permission for remote media. This is an engineering license assessment from supplied files, not legal certification.

Recommendation: reimplement visual patterns with Dũng's own text/assets/links; retain notices for copied substantial code; document original sources. Resolve artwork/remote-media rights before copying. No reference author identity, Google verification token, recipient email, CVE history or paid-bounty claims should be transferred to the redesigned CV.

## 8. Visual design và responsive findings

[Design tokens](reference-design-tokens.md) contains actual colors, font scales/weights, spacing, radius/shadows, layout dimensions, breakpoints, component styles and timing/easing, separating active cyber colors from unused template tokens. Key extracted values: background#040810, panel#070d1a/80, Tailwind cyan400/pink500 plus separate rgba neon glows; body Rajdhani16 px, headings Oxanium800, hero clamp3rem/6vw/5.5rem; container1280 px at desktop/laptop with24 px horizontal padding; header64 px content/65 px border-box; grid60 px; square panels and clipped-polygon CTAs.

| Viewport | Homepage DOM height | Hero / skill / project columns | Nav | Runtime note |
|---|---:|---|---|---|
| Desktop1440×900 | 5309 px | 2 /3 /3 | Desktop | No nav item offscreen in measured state |
| Laptop1366×768 | 5177 px | 2 /3 /3 | Desktop | Same1280 px container |
| Tablet768×1024 | 5747 px | 2 /2 /2 | Desktop | Last nav items/CTA outside right viewport; no mobile toggle |
| Mobile390×844 | 8549 px | 1 /1 /1 | Drawer | Fixed hero rings clipped; research tabs clipped |
| Small mobile360×800 | 8834 px | 1 /1 /1 | Drawer | Same defects, narrower form/labels |

Sizes measured in CSS viewport emulation, DPR1, classic scrollbar often15 px. Document widths may initially vary15 px during reveal overflow; layout evidence after load/scroll is kept verbatim. A matching scrollWidth/clientWidth does not prove no clipping because body and sections hide overflow.

Breakpoints observed at639/640,767/768,1023/1024,1279/1280,1535/1536; source defaults sm640/md768/lg1024/xl1280/2xl1536. Header switches at640; content grids later. About/contact main grids switch atlg; footer atsm. Hover source defines white CTA/glow/card lift/scale, but rendered hover is unverified because this browser reports hover/pointer media false. Input focus border/glow was verified.

Screenshots: `screenshots/desktop/`28, `laptop/`20, `tablet/`20, `mobile/`41, total109; index/dimensions/hashes in `evidence/screenshot-manifest.json`. Human/image pixel review remains pending because vision API403. DOM measurements are the basis for visual claims, not fabricated observation of screenshot pixels.

## 9. Functional verification và technical risks

Complete feature-level inventory: [reference-feature-inventory.md](reference-feature-inventory.md), F01–F47. Every major feature includes source mechanism, interaction/expected/observed, responsive behavior, dependencies and Pages boundary. Fully working frontend, partial/untested branches, decoration, external links and backend are explicitly distinct.

| Risk / finding | Verified evidence | Implication |
|---|---|---|
| Contact cannot run unchanged on Pages | `contact/actions.ts:1-32`, empty `next.config.js`, official export unsupported list | Separate delivery service/endpoint or mailto required |
| Possible false email success | `app/contact/actions.ts:19-31` ignores provider result; `app/contact/page.tsx:57-60` treats resolve as sent; installed SDK `node_modules/resend/dist/index.mjs:954-960,1722-1730` resolves HTTP errors as `{data:null,error:...}` | Need explicit provider-error handling and trusted server validation later; no real false-success incident claimed |
| Server validation/anti-spam absent in supplied function | `contact/actions.ts:8-31` only encodes strings; no schema/rate-limit path | Static UI validation alone does not protect public action; backend design needed if keeping form |
| Tablet header offscreen | `navbar:81,106,130`, `responsive-measurements.json`, tablet top screenshot | Change nav breakpoint/layout in redesign |
| Mobile research tabs clip | `research:500-524`, measurements x negative/right beyond viewport | Wrap/scroll or compact tabs |
| Hidden drawer receives keyboard focus | `navbar:147-179`; browser Tab selects invisible About | Use hidden/inert + managed focus, aria-expanded/controls; Escape close |
| Body lock persists across mobile-to-desktop resize | `components/navbar.tsx:35-53,128-149`; browser opens at390, resizes1440: toggle/drawer display none but body overflow hidden | Close menu/release lock when crossing desktop breakpoint; verified in foreground-interactions.json |
| Missing accessible form/icon names | `contact:160-187` labels without for/id; hero SVG links `page:340-346`; inventory confirms no labels | Proper accessible labels/associations needed |
| About morph inert | `about:82-85`; runtime no keyframe morph or active instances | Either supply keyframes or remove advertised motion |
| Contact LinkedIn wrong | `contact:17-20`, trusted click opens homepage | Replace with actual owner link |
| Error retry inert | `app/error.tsx:7,21-25`; reset not invoked | Wire retry if reusing boundary |
| Animation cleanup/reduced-motion concerns | `skills:47-61,131-145`; no first-party reduced-motion branch | Timer cleanup/retrigger controls and motion preference needed; no benchmark/leak claim |
| Redundant packages/template leftovers | manifest + active import map; dormant modules | Avoid copying unnecessary UI stacks/unused providers into redesign |
| Generic SEO and identity remnants | `config/site.ts:5`; `layout:28`; hardcoded source identity throughout | Replace metadata/verification/links/content deliberately |
| Source/deployment version identity unknown | no reference.git; local manifests differ from README | Record source hashes; don't claim exact deployed package version |
| Local crash artifacts | baseline14 huge cores; logs only readiness | Do not deploy/copy artifacts; reason for crashes not diagnosed |
| Workflow uploads entire development repo | `my-cv-redesign/.github/workflows/static.yml:36-43` | If later merged as-is, audit docs/screenshots and duplicate sites may enter Pages artifact; production artifact scope requires approved later change |

Read-only GET checks show public custom domain200 with Cloudflare response header; default project URL404; unauthenticated Pages API404. These results don't prove DNS records/origin or server-side Pages settings. Reference raw requests get Vercel429 while browser works. See `http-readonly-checks.json`, `github-pages-public-api.json`. No DNS/Pages mutation performed.

## 10. Reference so với CV hiện tại

[Existing CV audit](existing-cv-audit.md) is the detailed baseline and migration-risk report, with root vs duplicate variants and exact hashes.

| Axis | Reference | Current development source |
|---|---|---|
| Rendering | Next App Router8 routes, React/TS | Static root index.html with inline CSS/JS; two identical legacy split-code directories |
| Styling | Tailwind4 build + HeroUI theme; Oxanium/Rajdhani, controlled cyan accents | CDN Tailwind/runtime, Font Awesome, Share Tech Mono/Ubuntu Mono, brighter blue/pink/purple neon |
| Identity | Riadh Benlamine, Algeria, published-work portfolio | Châu Anh Dũng, Duy Tan University, Vietnam, student/CTF/lab/AI/VNNIC content |
| Background | Particle canvas + grid/glow | Matrix rain canvas + scanline/grid |
| Navigation | Routes + hero anchors; mobile sm threshold | Six same-page sections; mobile md threshold |
| Projects/research/blog |4 code cards, local disclosure tabs, Medium feed |6 own lab/learning project cards, several placeholder anchors; no reference-style blog/research route |
| Contact | Next server action Resend, delivery unverified | Root HTML form with no backend/submit integration in its inline JS |
| Distribution | Vercel-hosted reference; no local deployment config | Existing GitHub Pages Action uploads repo root; CNAME custom domain |
| Repository maintenance | Extensive dependency tree/scaffold/core artifacts | No package manager/build manifest; duplicate assets/sites and large embedded-image SVG |

Preserve owner content/links/domain and rollback boundary, not the reference author's CV claims. Migrate skills/content into one maintained data source; replace placeholder download/project controls with real destinations or explicit informational presentation.

## 11. Recommended implementation architecture — proposal only

R: Preserve GitHub Pages/custom domain as the production hosting contract. Prefer a static multi-page/content-first architecture with reusable templates/components, a typed CV data file and centrally defined design tokens. An Astro-style static build is a good fit for mostly content pages with small hydrated islands for menu/typewriter/research tabs; this is a candidate, not installed or approved. A plain HTML/CSS/ES-module implementation is also sufficient for a smaller single-page scope. Select the tool only in Phase2 after confirming desired routes and maintenance preference.

If React/Next parity is required, use Next static export only after removing/replacing server actions, handling basePath/trailingSlash/assets and verifying export in an isolated approved build. Do not reproduce the full NextUI+HeroUI+Motion+Framer stack just to match CSS patterns.

Proposed component/data boundaries (no files created): AppLayout/SiteHeader/MobileNav/Footer; Hero/ParticleBackground; SectionHeading; ExperienceTimeline; SkillGrid; ProjectGrid; optional BlogList/ResearchTabs; ContactPanel; `cv` data and tokens separated from rendering. Shared semantic components own keyboard/focus/reduced-motion and reveal fallback, instead of each page repeating effects.

Contact should default to accurate mailto/social links until a delivery integration is explicitly chosen; if a working form is required, a separate hosted endpoint owns credentials, server validation, anti-spam and provider error handling. Browser success must reflect an acknowledged outcome, not a decorative text switch. Blog can use curated own links first, with optional RSS progressive enhancement and visible failure fallback. Analytics is optional and provider-independent if selected later.

Build artifact should contain only public site output, required CNAME, .nojekyll when appropriate and route assets; no audit/core/vendor/source-only copies. Keep current CNAME value `chauanhdung.id.vn`, main-triggered Pages permissions/concurrency/environment and domain infrastructure until reviewed migration explicitly updates the build stage/artifact path. Audit documents/PNGs do not authorize deployment changes.

Verification gates proposed for Phase2: deterministic approved install+build; HTML route directories; direct deep-link refresh under custom-root and project-subpath cases;404/assets; mobile header/tabs; keyboard/labels/focus; prefers-reduced-motion/no-JS content; meaningful contact behavior; owner-reviewed CV facts; screenshot review at all5 sizes; staged diff and no DNS mutation. None of these implementation gates is represented as already passed here.

## 12. Unresolved questions / limits for review

1. Pixel-level layout and hover need review with a working image/pointer environment. Existing PNGs are available; no need to trust imagined visual details.
2. Choose route scope for the redesigned CV: single landing vs separate About/Projects/Research/Blog. Reference features are inventory, not acceptance of every feature.
3. Choose actual contact delivery vs mailto, destination address and spam/privacy requirements; no key should be put in frontend.
4. Confirm current owner CV facts, education dates, skill claims, project URLs and an actual downloadable PDF. Existing source has inconsistent historical fields; neither reference claims nor stale current copy should become verified personal facts automatically.
5. Confirm artwork/font/icon rights if substantial reuse; template MIT doesn't settle every asset/content origin.
6. Server-side Pages/Cloudflare settings and default URL behavior remain unverified; API404 and public headers are not configuration authority. No credential access performed.
7. Exact deployed framework version/commit, baseline clean install/build/static export, delivery success, performance and cross-browser behavior are untested by design in this read-only phase.

These do not require implementation now; they are review inputs for subsequent phase authorization. Three independent source reviews were reconciled with the parent audit; substantive extra claims were checked against source or repeated browser tests. Review handles/hashes and reconciliation outcomes are recorded in `evidence/peer-review-reconciliation.json`; subagent self-reports alone are not treated as successful verification.

## 13. Phase 1 acceptance checklist

- [x] Source tree inventoried, README/LICENSE/manifests/lock/configs/assets/source modules inspected and classified.
- [x] Actual rendering path, routes, local state/handlers/animation/responsive rules traced with file:line evidence.
- [x] All8 routes inspected top-to-bottom at1440×900,1366×768,768×1024,390×844,360×800;40 route/viewport cases recorded.
- [x] Original screenshots captured to required4 folders;109 PNG dimensions/hashes/index verified.
- [x] Visible button/link/card/menu/input mechanisms tested; functional vs decorative/external/backend/source-only clearly marked.
- [x] Actual tokens extracted including typography/spacing/borders/shadows/layout/breakpoints/timing; no package.json-only summary.
- [x] Existing CV entry/deployment/CNAME/duplicate assets/content/risks documented.
- [x] Six required Markdown deliverables created; machine-readable evidence and screenshot manifest included.
- [x] Significant conclusions cite source or runtime/HTTP evidence; assumptions and proposals labeled.
- [x] No dependency installation/upgrade, reference mutation, production main mutation, DNS/Pages config change, commit/push or Phase2 code implementation.
- [x] Final verification checks filesystem/Git boundary and document/asset coverage; see `evidence/final-verification.json`.
- [ ] Human pixel/hover review pending because tooling limitations; explicitly not fabricated or passed.
- [ ] Production email success/build/static export/remote infra settings not certified in this phase.
- [ ] User review/approval for Phase2 pending. Stop condition respected: Phase1 documents only.
