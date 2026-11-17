# Reference design tokens

Source root: `/home/r00tK1ngX/web_CV`. Đây là giá trị trích xuất, chưa phải token implementation của website mới. Source hardcode khá nhiều arbitrary values; không có một bộ cyberpunk CSS variables tập trung. Các biến shadcn trong `globals.css` không đại diện chính xác cho màu đang render trên đa số page.

Bằng chứng đầy đủ: `evidence/source-style-values.json`, `evidence/live-design-tokens.json`, `evidence/breakpoint-measurements.json`, `evidence/responsive-measurements.json`, và layout arrays của 40 JSON route/viewport. Không tự đổi màu OKLCH/Lab sang mã hex gần đúng rồi gọi đó là source value.

## Màu chính và màu phụ

| Vai trò | Giá trị source thực | Vị trí / cách dùng |
|---|---|---|
| Nền chính | `#040810` | `app/layout.tsx:20,38`; tất cả route sections |
| Panel | `#070d1a` với `/80` alpha | `app/projects/page.tsx:117`; `app/skills/page.tsx:70`; form/contact cards |
| Thumbnail gradient | `from-[#0a1128] to-[#070d1a]` | `app/projects/page.tsx:124`; `app/blog/page.tsx:65` |
| Chữ chính | `white`, `text-slate-200` | `app/layout.tsx:38`; headings h1/h2/h3 |
| Chữ phụ | `slate-400`, metadata `slate-500`, footer `slate-600`, divider `slate-700` | `app/page.tsx:295,319,364,388`; `app/layout.tsx:70,84` |
| Primary UI | Tailwind `cyan-400`: `oklch(78.9% 0.154 211.53)` | Installed `node_modules/tailwindcss/theme.css:110`; CTA/header/section accents |
| Secondary UI | Tailwind `pink-500`: `oklch(65.6% 0.241 354.308)` | `theme.css:195`; project accents, error, hero `~/` |
| Positive/expert | `green-400`: `oklch(79.2% 0.209 151.711)` | `theme.css:74`; availability/expert/exploits |
| Certification/advanced/bounty | `amber-400`: `oklch(82.8% 0.189 84.429)` | `theme.css:38`; timeline badges/skill levels |
| Critical | `red-400`: `oklch(70.4% 0.191 22.216)` | `theme.css:14`; CVE card/severity |
| Explicit glow cyan | `rgba(0,245,255,a)` | Grid/borders/shadows; separate from `cyan-400` palette value |
| Explicit glow magenta | `rgba(255,0,110,a)` | Hero glitch/ambient/project glow; separate from `pink-500` |
| Explicit neon green | `#39ff14` / `rgba(57,255,20,a)` | `app/skills/page.tsx:30`; positive glow |
| Explicit amber glow | `rgba(255,214,10,a)` | `app/skills/page.tsx:31`; timeline/research |

Slate source OKLCH: 400 `oklch(70.4% 0.04 256.788)`; 500 `oklch(55.4% 0.046 257.417)`; 600 `oklch(44.6% 0.043 257.281)`; 700 `oklch(37.2% 0.044 257.287)`, installed `theme.css:218-221`.

Live browser xuất màu palette dạng CSS Lab: cyan `lab(76.6045% -40.9406 -29.6231)`, pink `lab(56.9303% 76.8162 -8.07021)`, green `lab(78.503% -64.9265 39.7492)`, amber `lab(80.1641% 16.6016 99.2089)`, red `lab(63.7053% 60.745 31.3109)`. Đây là format computed CSS browser ghi lại, không phải bằng chứng source/live dùng cùng phiên bản build. Theme breakpoint custom properties bị compiler bỏ khỏi runtime variables, nhưng media được đo trực tiếp.

## Typography

`app/layout.tsx:30-38` tải Google Fonts qua link stylesheet: Oxanium weights 200–800, Rajdhani 300–700, JetBrains Mono 300/400/500. Body dùng `Rajdhani,sans-serif`; headings/navigation/badges/stats đa số dùng `Oxanium,monospace`. Browser đã tải Oxanium và Rajdhani. JetBrains Mono được yêu cầu trong URL nhưng chưa có usage active chứng minh nó render. `config/fonts.ts:1-11` khai báo Inter/Fira Code nhưng không import vào layout.

| Thành phần | Giá trị / scale | Evidence |
|---|---|---|
| Root/body | 16 px; line-height 24 px; weight 400 | Live computed CSS; body class `app/layout.tsx:38` |
| Hero name | `clamp(3rem,6vw,5.5rem)`; leading-none; 800 | `app/page.tsx:298-305`; 86.4 px tại 1440 px, min 48 px mobile |
| Route/section heading | `text-4xl md:text-6xl` = 36/60 px; 800 | e.g. `app/skills/page.tsx:203`; About h1 `about:67` |
| Hero role | `text-lg` = 18 px, 600, tracking-wide | `app/page.tsx:309-315` |
| Section lead | 18 px, weight 300, leading-relaxed 29.25 px, max-width 42 rem | `app/projects/page.tsx:238`; live DOM |
| Hero paragraph | 16 px, weight 300, leading-relaxed 26 px, max-width 32 rem | `app/page.tsx:319` |
| Project/timeline title | 20 px/28 px, 700 | `app/projects/page.tsx:143`; `experience:159` |
| Skill title | 14 px/20 px, 700 | `app/skills/page.tsx:86` |
| Body small | 14 px; metadata 12 px | Project description `146`; experience meta `168` |
| Statistics | 30 px mobile / 36 px md; 800 | `app/skills/page.tsx:157`; hero stats 20 px |
| Overline/badge | .65 rem (10.4 px), tracking 3 px, uppercase | Shared route header markup e.g. `projects:228` |
| Micro labels | .55/.58/.6/.62/.65/.68/.7/.72/.75/.8 rem | Actual arbitrary class literals in `source-style-values.json`; example footer .62 rem = 9.92 px |
| Nav link | .72 rem (11.52 px), 600, tracking 1.5 px | `components/navbar.tsx:89` |
| Button label | .68–.75 rem, 700, tracking 2–3 px, uppercase | Navbar `117`, hero `328`, projects `163` |

Weights active: light 300, normal 400, medium 500, semibold 600, bold 700, extrabold 800. Default line-height comes from Tailwind; `leading-none`, `leading-snug`, `leading-relaxed` override per component. No Vietnamese glyph coverage claim: test actual CV content/font fallback in later phase.

Raw font scale from installed `node_modules/tailwindcss/theme.css:299-318` (size / default line-height): xs `.75rem / 1rem`, sm `.875rem / 1.25rem`, base `1rem / 1.5rem`, lg `1.125rem / 1.75rem`, xl `1.25rem / 1.75rem`, 2xl `1.5rem / 2rem`, 3xl `1.875rem / 2.25rem`, 4xl `2.25rem / 2.5rem`, 5xl `3rem / 1`, 6xl `3.75rem / 1`. Heading `md:text-6xl` thus has line-height1, while mobile `text-4xl` normally uses2.5rem; do not force one line-height across both. Tracking-wide is `.025em`; leading-snug `1.375`, leading-relaxed `1.625` (`theme.css:339,344-346`).

## Spacing và kích thước layout

Tailwind base `--spacing:.25rem` = 4 px at root 16 px, `node_modules/tailwindcss/theme.css:277`, live token confirmed. Arbitrary positioning/timing coexist; not a strictly enforced grid system.

- Common space steps used: .5=2 px, 1=4, 1.5=6, 2=8, 2.5=10, 3=12, 4=16, 5=20, 6=24, 7=28, 8=32, 10=40, 12=48, 14=56, 16=64, 20=80, 24=96 px.
- Page `.container.mx-auto.px-6.py-8`: horizontal padding 24 px, vertical 32 px, e.g. `app/page.tsx:279`, `projects:222`. At 1440 and 1366 viewport, measured border-box 1280 px, content 1232 px. At 768, container 753 px with 705 px content because classic vertical scrollbar consumes 15 px in this browser.
- Header inner `max-w-7xl` = 80 rem/1280 px, `px-4 sm:px-6`, content row h-16=64 px; nav bounding box 65 px including bottom border. Main `pt-16`=64 px. `components/navbar.tsx:65-75`; `app/layout.tsx:59`.
- Hero `min-h-screen`, followed below the header's main padding, so first section is not simply viewport minus nav height. Grid two columns at md, gap-16=64 px; text internal gap-7=28 px, `app/page.tsx:263-283`.
- Common route header bottom margin 64 px; journey/about 80 px. Section title margin-bottom 16 px, badge bottom 24 px.
- Timeline and stats max-w-4xl=56 rem/896 px, `experience:292,299`; about/contact max-w-5xl=64 rem/1024 px, `about:57`, `contact:100`; blog stats max-w-3xl=48 rem/768 px, `blog:282`; lead max-w-2xl=42 rem/672 px.
- Skill grid gap 20 px, project/blog/research gap 24 px; contact two-column gap 48 px; about main grid gap 48 px.
- Panel/card padding normally 24 px; blog body 20 px; contact form shell 32 px. Name/email remain a two-column grid even on narrow screens (`contact:157`).
- Project/blog thumbnail h-44=176 px. Icon tiles 36/40/44/48 px; project graphic w/h-20=80 px.
- Hero image 224×224 px in 256×256 px wrapper; brackets 288×288; orbits 340×340 and 420×420 px, not scaled to mobile (`app/page.tsx:176-218`).
- Html smooth anchor scroll offset 80 px, `styles/globals.css:142-146`; observed target top about 80 px after CTA click.
- No claim of absent overflow based only on scrollWidth: body `overflow-x-hidden` can conceal clipping. Tablet header and mobile tabs are concrete examples.

## Borders, shapes và shadows

| Element | Giá trị thực |
|---|---|
| Standard card border | 1 px `rgba(0,245,255,.12)`; often left border 2 px accent/40 |
| Quiet global/header border | `rgba(0,245,255,.08)`; scrolled header `.15` |
| Input border | `rgba(0,245,255,.15)`; focused `cyan-400/50` |
| Badge border/fill | palette `/25` hoặc `/30`; fill `/10` |
| Main card corners | Square (`border-radius:0` computed); 16×16 px 2 px L-brackets |
| Form brackets | 20×20 px, cyan, top-left/bottom-right |
| Primary CTA shape | `polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)` |
| Hire Me shape | same clipped parallelogram, 8 px cut |
| Overline hexagon | `polygon(8px 0%,calc(100% - 8px) 0%,100% 50%,calc(100% - 8px) 100%,8px 100%,0% 50%)` |
| Icon hexagon | same pattern, 5 px cut |
| Circular accents | `rounded-full`: dots, rings, spinners/avatar; not general panel rounding |
| Hero blob | `30% 70% 70% 30% / 30% 30% 70% 70%`, animated variants |
| Common hover card glow (source) | `0 0 30px rgba(0,245,255,.08)`; experience `.06`; pink/green variants |
| Main title cyan text glow | `0 0 30px rgba(0,245,255,.5)` |
| Button hover glow (source) | `0 0 20px rgba(0,245,255,.4)` / 30px `.5` hero primary |
| Input focus glow (runtime verified) | `0 0 12px rgba(0,245,255,.08)` |
| Positive dot glow | `0 0 6px rgba(57,255,20,.8)` |
| Panel blur | `backdrop-blur-md`=12px; nav `md` default then `xl`=24px after scroll; installed `node_modules/tailwindcss/theme.css:430,432` |

Source references: `app/projects/page.tsx:60-94,117-175,228-260`; `app/skills/page.tsx:70-111`; `components/navbar.tsx:65-75,117-130`; `app/contact/page.tsx:151-239`.

## Backgrounds

Global grid: two linear-gradients with 1 px lines `rgba(0,245,255,.025)`, period 60×60 px, fixed pointer-events none (`layout:40-47`). Each route adds own grid `.03` and ambient radial gradients, so layers are repeated rather than one reusable background component. Hero grid is absolute; child route backgrounds fixed. Ambient cyan/pink opacity .04/.05/.06/.07 varies, ending at transparent 70%. Project/blog thumbnail uses repeating diagonal stripes, 10 px transparent + 1 px `.015` cyan, 45 degrees.

## Responsive breakpoints và component behavior

Tailwind source `theme.css:279-283`: sm 40rem=640 px, md 48rem=768 px, lg 64rem=1024 px, xl 80rem=1280 px, 2xl 96rem=1536 px. No custom breakpoint override found. Browser tests immediately below/at every boundary support these values (`breakpoint-measurements.json`).

| Component | Base | sm ≥640 | md ≥768 | lg ≥1024 |
|---|---|---|---|---|
| Navigation | Mobile toggle/drawer | Desktop links + status/CTA; toggle hidden | unchanged | unchanged |
| Hero | 1 column | 1 | 2 | 2 |
| Skills/projects/blog/research grids | 1 | 1 | 2 | 3 |
| Summary stats | 2 | 2 | usually 4, blog 3 | same |
| About main / Contact main | 1 | 1 | 1 | 2 |
| About capabilities | 1 | 2 | 2 | 4 (5 records wrap) |
| Footer | vertical | horizontal | same | same |
| Main heading | 36 px | 36 | 60 | 60 |

Measured defects, not proposed design rules: tablet header at 768 has Blog partially beyond right edge and Research/Contact/CTA offscreen, because it switches at sm while content needs more width. Research tabs are single flex row without wrap/scroll treatment: first x≈−53.8 and last right≈428.8 at 390, and x≈−68.8/right≈413.8 at 360. Hero fixed rings also extend beyond mobile content and section clips them. See `responsive-measurements.json` and relevant screenshots.

## Animation / transition tokens

| Animation | Duration/easing/delay | Source |
|---|---|---|
| Default transition | 150 ms; `cubic-bezier(.4,0,.2,1)` | Tailwind `theme.css:444-445`, live variables |
| Hover/button/nav | 200/300 ms; normal Tailwind easing | Navbar/CTA classes |
| Reveal cards | 700 ms; 60/100/120 ms index stagger varies | Skill `67-68`, project `114-115`, blog `54-55`, research `200-201` |
| Header/hero entrance | 1000 ms; hero loaded after 100 ms; illustration delay 300 ms | `app/page.tsx:151,255-257,283` |
| Typewriter | type 80 ms, delete 40 ms, pause 1800 ms | `app/page.tsx:11` |
| Cursor blink | 1 s step-end infinite | `app/page.tsx:314-315` |
| Glitch layers | 6 s ease-in-out infinite; second delay .5 s | `app/page.tsx:115-141` |
| Orbit | 25 s linear forward; 35 s linear reverse | `app/page.tsx:176-182` |
| Hero morph | 10 s ease-in-out infinite | `app/page.tsx:155-159,186-187` |
| Hacker float | 4 s ease-in-out, −18 px and ±2° | `app/page.tsx:169-171,191-192` |
| Core glow pulse | 3 s ease-in-out | `app/page.tsx:165-168,193-194` |
| Floating tags | 3 s ease-in-out; delays 0/1.5/.8/2 s; −10 px | `app/page.tsx:161-164,223-234` |
| Scan-line | 3 s ease-in-out infinite, top 0→100% | `app/projects/page.tsx:199-209`; blog `207-212` |
| Particle field | requestAnimationFrame; no fixed CSS duration | `app/page.tsx:66-102` |
| Skill percent | +1 every 14 ms, index×80 ms start delay; progress transition 1000 ms | `app/skills/page.tsx:47-54,108` |
| Skill stats | +1 every 40 ms, index×100 ms delay | `app/skills/page.tsx:131-138` |
| Research tab | setTimeout 150 ms; content transition 300 ms | `app/research/page.tsx:438-443,529` |
| Mobile drawer | 300 ms ease-in-out; overlay entry .25 s ease | `components/navbar.tsx:58-62,148-149` |
| Global dormant float | 3 s ease-in-out, −20 px | `styles/globals.css:149-160`; not active hero float |
| About morph declaration | 8/10 s ease-in-out, but `@keyframes morph` absent | `app/about/page.tsx:82-85`; runtime keyframe scan confirms no active `morph` |

No active `prefers-reduced-motion` branch found in first-party source. Browser animation list confirms running pulse/glitch/blink/orbit/morph-hero/hacker-float/pulse-core/float-tag/scan-line; does not certify their pixel appearance. Counter screenshots can capture intermediate values: separate settled `/skills` evidence proves final values; do not read an intermediate percentage as a data error.

## Generic template variables — không nhầm với active design

`styles/globals.css:64-97,99-131` defines light/dark OKLCH shadcn tokens, radius .625rem=10 px, plus radius derivatives −4/−2/+4/+8/+12/+16 px (`55-61`). Light `--background:oklch(1 0 0)` and `--primary:oklch(.205 0 0)` do not make the actual reference white/black: the layout and cards override with explicit cyber colors. Do not carry charts/sidebar/light-theme features into the inventory solely because these tokens exist.

## Giới hạn visual

Ảnh thật đã lưu ở đủ năm kích thước, nhưng image inspection API bị 403. Actual hover chưa xác minh do false hover media, dù source definitions được trích đầy đủ. Không có perceptual diff, contrast audit tự động, benchmark, screen-reader certification hay cross-browser certification trong Phase 1.
