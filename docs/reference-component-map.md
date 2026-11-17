# Reference component map

Các đường dẫn source trong tài liệu này tương đối với `/home/r00tK1ngX/web_CV`. `S` = đọc source trực tiếp; `B` = browser DOM/tương tác thật. Việc một module tồn tại không chứng minh nó được render. Browser evidence: `evidence/{desktop,laptop,tablet,mobile}-<route>-<width>x<height>.json` và ảnh có cùng route/viewport.

## Cây render đang dùng

```text
app/layout.tsx — RootLayout (server layout)
  globals.css → Tailwind v4 → hero.ts → HeroUI theme CSS
  metadata ← config/site.ts (name, description)
  external Google Fonts: Oxanium / Rajdhani / JetBrains Mono
  global grid + ambient glow
  components/navbar.tsx — Navbar (client)
    RbnLogo → next/link /
    desktop navLinks + Available + Hire Me
    mobile toggle + overlay + drawer + Get In Touch
  main.pt-16 → route children
    / → app/page.tsx — Home (client)
      useTypewriter → local React hook
      hero#home
        CSS grid + ParticleField canvas
        GlitchText + typewriter + CTA anchors + social links + static stats
        HeroVisual → public/hacker.png + RBN + orbit/blob/tags/brackets
        decorative Scroll indicator
      decorative portfolio divider
      div#experience → app/experience/page.tsx — Experience
      div#skills → app/skills/page.tsx — Skills
      div#projects → app/projects/page.tsx — Projects
    /about → AboutPage
    /experience → Experience (same module as homepage section)
    /skills → Skills (same module as homepage section)
    /projects → Projects (same module as homepage section)
    /blog → Blog → BlogCard ← client RSS fetch
    /research → Research → CyberCard → CVECard / ExploitCard / BugBountyCard
    /contact → Contact → sendContactEmail server action → Resend
  shared footer (inline in layout, not a separate component)
  @vercel/analytics/next → Analytics
app/error.tsx — route error boundary (only rendered on failure)
```

Evidence: `app/layout.tsx:1-6,23-98`; `app/page.tsx:4-8,251-411`; `components/navbar.tsx:23-209`. Homepage imports page modules directly: reuse is real, but route entry and section UI are coupled in the same files.

## Bản đồ toàn bộ section/component quan trọng

| Khu vực / route | Symbol và source | Cơ chế, dữ liệu và phụ thuộc thực | Trạng thái kiểm chứng |
|---|---|---|---|
| Metadata/document | `RootLayout`, `app/layout.tsx:8-38`; `config/site.ts:3-5` | Metadata/title/icon/themeColor; English document; Google verification token của reference; fonts qua stylesheet ngoài | S; B title `Riadh Portfolio` |
| Global background | `app/layout.tsx:40-54` | Fixed grid 60×60 px, cyan/pink radial glow, pointer-events none | S+B computed CSS |
| App shell/footer | `app/layout.tsx:57-94` | Flex min-height viewport, main padding-top 64 px; footer identity, year computed during render, GitHub/Medium/contact links; Analytics | S+B, không xác nhận analytics ingestion |
| Logo | `RbnLogo`, `components/navbar.tsx:10-21` | Terminal-style text `[rbn0x00@portfolio] $_`, internal home Link, pulse cursor | S+B click về `/` |
| Desktop navigation | `Navbar`, `components/navbar.tsx:23-125` | 7 route links; active state từ `usePathname`; scroll listener đổi background khi y>20; status text hardcoded; Hire Me → `/contact` | S+B đủ 7 route; 768 px bị cắt |
| Mobile navigation | `Navbar`, `components/navbar.tsx:127-209` và effects `35-53` | React `isMenuOpen`; Menu/X lucide; backdrop click đóng; drawer link đóng; route-change effect; body overflow lock | S+B open/close/outside/all routes/CTA; Escape/focus có hạn chế; resize390→1440 giữ body lock dù drawer đã CSS-hide |
| Hero content | `Home`, `app/page.tsx:251-369` | React loaded timer, copy/static stats, `#projects`/`#experience` anchors, GitHub/LinkedIn SVG icons | S+B anchors cuộn đến khoảng 80 px dưới viewport top |
| Typewriter | `useTypewriter`, `app/page.tsx:11-36,244-249,309-315` | Local setTimeout/state, 4 role strings, 80/40/1800 ms typing/delete/pause; CSS cursor | S+B text đổi; không phải package `typewriter-effect` |
| Particle canvas | `ParticleField`, `app/page.tsx:39-107` | Canvas 2D, 60 particles, rAF, resize cleanup, line-distance <120 px | S; B canvas/animation context; không chấm FPS hay hiệu năng thiết bị |
| Glitch name | `GlitchText`, `app/page.tsx:110-146` | `data-text` + pseudo-elements + clip-path keyframes, 6 s cycles | S+B active CSS animations; pixel effects chưa review |
| Hero illustration | `HeroVisual`, `app/page.tsx:149-240` | `/hacker.png`, RBN underlay/fallback, fixed rings 340/420 px, morph blob, floating tags, scan brackets | S+B image natural size 500×500, loaded; rings vượt mobile section và bị clip |
| Scroll hint/divider | `app/page.tsx:377-393` | Text/pulsing line và cyan separator, không button/handler | S+B decorative |
| Journey timeline | `Experience`, `app/experience/page.tsx:237-319`; `ExperienceCard:93-204` | 3 hardcoded records `17-58`: CPPS, Junior Penetration Tester, IT Support; `typeConfig:60-91`; IntersectionObserver threshold .1; timeline line/dots; tags | S+B 3 card bodies không mở modal/route; không có certificate download |
| Journey stats | `app/experience/page.tsx:206-235,299-315` | Derived work/education/cert counts 2/0/1; years active hardcoded `1.5+` | S+B; số liệu do tác giả nhập, không kiểm chứng lịch sử cá nhân |
| Skill cards | `Skills`, `app/skills/page.tsx:168-231`; `SkillCard:35-118` | 10 records `16-27`; lucide icons; category/level badges; observer-triggered interval % và progress width | S+B cả 10 card, final values 70/65/70/75/50/60/85/90/70/65 |
| Skill stats | `StatCard`, `app/skills/page.tsx:120-166,222-226` | Derived counts + rounded average, animated intervals | S+B settled 2 Expert, 4 Advanced, 10 total, 70% average; không phải filter controls |
| Project grid | `Projects`, `app/projects/page.tsx:184-268`; `ProjectCard:96-182` | 4 local records `19-58`, `accentMap:60-94`; SVG icon thumbnails, tags, code/demo anchors; IO reveal; CSS scan-line | S+B card bodies decorative; 4 Code, 1 Demo, View All GitHub external |
| About bio | `AboutPage`, `app/about/page.tsx:18-134` | Bio paragraphs, RBN shape avatar, GitHub/Medium links; single observer threshold .05 controls reveal | S+B; font/copy source matches DOM |
| About capabilities | `highlights`, `app/about/page.tsx:9-16,136-160` | 5 capability cards with lucide icons; layout 1/2/4 columns; no click handler | S+B click all 5: unchanged route, no dialog |
| Blog fetching/state | `Blog`, `app/blog/page.tsx:148-203,246-302` | Client `fetch` Medium feed via rss2json; posts/loading/error; spinner/error/empty/cards/stats branches | S+B success 1 post; blocked-network error; empty branch source-only |
| Blog card | `BlogCard`, `app/blog/page.tsx:18-146` | Thumbnail or parsed img URL, `onError` fallback, date, estimated reading time, description stripped/truncated, max 3 category chips, Read on Medium | S+B 1 live article/link; 4 categories summary counts all categories although card shows max 3 |
| Research tabs/stats | `Research`, `app/research/page.tsx:404-549` | Local arrays; `selected` and animateContent; 150 ms switch then 300 ms transition; totals 1/4/3/$100 | S+B all tabs desktop+mobile; badges not remote API validation |
| Research card shell | `CyberCard`, `app/research/page.tsx:169-211` | Shared IO reveal, accent border/brackets, hover definitions | S+B card DOM; actual hover unverified |
| CVE card | `CVECard`, `app/research/page.tsx:215-283`; `cves:46-63` | 1 hardcoded CVE, severity/status/CVSS/details/date, NVD external anchor | S+B external click dispatch; does not independently verify CVE ownership, severity or disclosure accuracy |
| Exploit cards | `ExploitCard`, `app/research/page.tsx:287-347`; `exploits:65-114` | 4 hardcoded Exploit-DB entries, verified badge literal boolean, tags/date/author/external links | S+B all 4 rendered; badges are authored metadata |
| Bounty cards | `BugBountyCard`, `app/research/page.tsx:351-400`; `bugBounties:116-147` | 3 hardcoded records, payout/status text; no bounty program API or link handler | S+B all 3 bodies decorative |
| Contact info | `socialLinks`, `app/contact/page.tsx:9-34,100-147` | GitHub, LinkedIn, mailto anchors; location non-link, static availability | S+B; LinkedIn href `/` is wrong destination |
| Contact form | `Contact`, `app/contact/page.tsx:36-65,150-251` | Controlled React inputs, required/email validation; four statuses; sending/sent disabled; reset timers | S+B input/validation/pending/error/reset; actual success source-only |
| Email backend | `sendContactEmail`, `app/contact/actions.ts:1-32` | `use server`, `Resend`, env API key; `he.encode`; fixed recipient; provider call | S only; no valid production email submitted |
| Error boundary | `Error`, `app/error.tsx:5-28` | Logs exception; renders Try again button, but `reset` prop unused and button has no onClick | S only; not forced on live deployment |

## Modules tồn tại nhưng không nối vào render path hiện tại

Import scan: `evidence/dependencies.json` (`imports`) và root layout/page source. Browser inventory không tìm thấy theme/counter/spotlight controls. Đây là scaffold/dormant code, không phải feature website đã được xác minh.

| File | Symbol / vai trò | Vì sao không đưa vào active feature list |
|---|---|---|
| `app/providers.tsx:23-31` | `Providers`: HeroUIProvider + NextThemesProvider/router adapter | RootLayout không import/render Providers |
| `components/theme-switch.tsx:17-81` | `ThemeSwitch`, next-themes + HeroUI/React Aria | Không import trong active routes/navbar; không có light-mode toggle runtime |
| `components/counter.tsx:6-14` | HeroUI `Counter` | Không được route sử dụng; không có Count button runtime |
| `components/ui/typewriter-effect.tsx:7-99,101-187` | `TypewriterEffect`, `TypewriterEffectSmooth` dùng `motion/react` | Homepage dùng hook cục bộ, không import hai component này |
| `components/ui/spotlight.tsx:9-56` | SVG Spotlight + `cn` | Không render trong active pages; không phải global glow đang thấy |
| `components/primitives.ts:3-53` | Tailwind Variants `title`, `subtitle` | Các page dùng class trực tiếp, không import primitives |
| `components/icons.tsx` | SVG icon exports | Chỉ nối tới dormant ThemeSwitch; active iconography từ lucide/react-icons |
| `config/fonts.ts:1-11` | Inter và Fira Code qua next/font | RootLayout dùng Google Fonts link, không import file này |
| `lib/utils.ts:1-6` | `cn` dùng clsx/tailwind-merge | Các usage ở dormant UI helpers |
| `config/site.ts:6-68` | Template nav/menu/external config | Navbar có `navLinks` riêng. `/docs`, `/pricing`, `/dashboard`, `/logout` trong config không phải route/feature thực |
| `types/index.ts:1-5` | Shared IconSvgProps type | Type-only cho scaffold SVG icons |

## Tách component được đề xuất cho Phase 2

Chỉ đề xuất, chưa tạo code: `SiteHeader/MobileNav`, `SiteFooter`, `Hero`, `ParticleBackground`, `SectionHeading`, `Timeline/TimelineCard`, `SkillCard`, `ProjectCard`, `ResearchTabs/ResearchCard`, `ContactPanel`, dữ liệu CV tách khỏi markup và tokens tập trung. Không nhập `page` module làm section. Progressive enhancement để nội dung vẫn thấy khi JavaScript/IntersectionObserver lỗi; support reduced motion và focus/keyboard ngay từ component chung. Xem quyết định kiến trúc và rủi ro trong [reference audit](reference-audit.md).
