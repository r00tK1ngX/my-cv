# Reference feature inventory

Source root: `/home/r00tK1ngX/web_CV`. Không coi CSS button-like, badge hoặc card có hover là một chức năng click. Mỗi hàng mô tả feature, source/cơ chế, thao tác → kết quả, responsive/dependency và khả năng trên GitHub Pages.

## Quy ước và bằng chứng

- `F`: chức năng frontend đã chạy trong browser; `P`: chỉ một phần/nhánh xác minh, có giới hạn cụ thể; `D`: trang trí hoặc trình bày dữ liệu; `X`: tích hợp/link ngoài; `B`: cần backend; `U`: module/nhánh chỉ thấy trong source.
- Source xác minh cơ chế; browser xác minh hành vi trong môi trường và thời điểm audit. Không chứng minh lịch sử nghề nghiệp, quyền sở hữu CVE, độ chính xác của claim exploit hay chức năng của project bên ngoài.
- Bằng chứng chính: `evidence/foreground-interactions.json`, `outbound-anchor-tests.json`, `trusted-outbound-clicks.json`, `external-url-checks.json`, `runtime-resources.json`, `responsive-measurements.json`, `browser-limitations.json`, JSON từng route/viewport và ảnh `screenshots/`.
- `interaction-log.json` lưu thử nghiệm sớm: kết quả timing của tab nền được gắn nhãn superseded, không dùng để kết luận navigation lỗi. `foreground-interactions.json` là kết quả hiệu lực. Form validation/transport-blocked vẫn hợp lệ; foreground pending/error được đo riêng.
- Link ngoài: dispatch mọi anchor instance trong DOM, ngăn default navigation; sau đó click pointer đáng tin cậy với mỗi URL đại diện và kiểm tra new tab target. GET endpoint là kiểm tra availability riêng; HTTP 200 không chứng minh tích hợp hoàn chỉnh. `mailto:` không khởi chạy mail client.

## Shell, homepage và navigation

| ID / Feature / loại | Source và mechanism | Tương tác → expected / observed | Responsive / dependencies | GitHub Pages |
|---|---|---|---|---|
| F01 — Logo home / F | `components/navbar.tsx:10-21`, Next Link | Click logo → `/`; quan sát chuyển về homepage | 18 px mobile/20 px md; Next router | Có; đổi link theo base path hoặc static home |
| F02 — 7 desktop route links / F | `navbar:23-31,81-103`, `usePathname` | About/Experience/Skills/Projects/Blog/Research/Contact → đúng route; active cyan đúng | Desktop bật từ sm 640; tablet có clipping; Next Link/lucide/react-icons | Có nếu xuất HTML từng route hoặc anchor architecture |
| F03 — Header khi cuộn / F+D | `navbar:35-44,65-75` | y>20 → nền `.97` và border `.15`; observed. Comment “shrink” không đúng: chiều cao vẫn 65 px tính border | Fixed, z1000; body main offset 64 px | Có, CSS/JS |
| F04 — Availability / D | `navbar:108-113,187-191`, `contact:113-120` | Pulse dot/text, không API lịch làm việc hoặc status control | Status desktop/mobile layout riêng | Có; dữ liệu hardcoded |
| F05 — Hire Me / F | `navbar:115-124` | Click → `/contact`; observed | Ẩn dưới 640; Next Link | Có |
| F06 — Mobile menu toggle / F | `navbar:35-53,127-153` | Open → X/overlay/drawer, body overflow hidden; close → restored. Ngoài overlay đóng đúng | Chỉ dưới 640; React state, lucide Menu/X | Có |
| F07 — Mobile route links + CTA / F | `navbar:155-205` | Cả 7 links và Get In Touch → đúng route, drawer đóng, unlock body | Active badge theo pathname; UI width full | Có |
| F08 — Mobile keyboard/resize behavior / P | `navbar:35-53,128-149,155-179` | Escape không đóng. Tab sau toggle khi drawer đóng vào About vô hình; aria-expanded absent. Mở menu390 rồi resize1440 làm toggle/drawer ẩn nhưng body vẫn overflow hidden | Observed390→1440 px; React state/native focus/body lock | Có thể làm đúng bằng focus/inert và breakpoint cleanup; không copy lỗi |
| F09 — Hero role typewriter / F+D | `app/page.tsx:11-36,244-249,309-315` | Tự gõ/xóa 4 vai trò, text thay đổi trong browser | Không có pause control; local React hook/CSS | Có |
| F10 — Hero CTA anchors / F | `app/page.tsx:325-336`; `globals.css:142-146` | View Projects/My Journey → hash + smooth scroll, target top ~80 px, observed | Same-page; responsive flex-wrap | Có native anchors |
| F11 — Social icon links / X+P | `app/page.tsx:339-347` | GitHub/LinkedIn external `_blank`, noopener noreferrer; icon-only thiếu aria-label. GitHub GET 200; LinkedIn GET 999 không đủ kết luận dead link | 40×40 px icons, react-icons | Có; external platform vẫn phụ thuộc ngoài |
| F12 — Particle background / D | `app/page.tsx:39-107` | rAF canvas, không click handler; 60 moving particles + close-distance lines | Canvas size viewport on resize; no device-pixel-ratio scaling | Có Canvas 2D; cần budget/reduced motion |
| F13 — Glitch/hero orbit/blob/float / D | `app/page.tsx:110-240` | Active CSS animation names và loaded image verified; không đánh giá pixel do vision API unavailable | Fixed orbit dimensions bị section clip ở mobile; CSS + PNG | Có, không backend |
| F14 — Hero stats / D | `app/page.tsx:351-369` | 1 CVE/4+ exploits/3+ bounties/1.5+ years là literal text; không counter API | Flex gap32; không card control | Có; không xác minh claim cá nhân |
| F15 — Scroll hint và divider / D | `app/page.tsx:377-393` | Pulsing line/label, không anchor/button | Absolute bottom; pointer visual only | Có |
| F16 — Footer / F+X+D | `app/layout.tsx:63-91` | GitHub/Medium links, Contact → route; year `new Date().getFullYear()` | Column mobile, sm row; no footer theme toggle | Có; static-generation year cập nhật theo build |

## Nội dung, cards và dữ liệu

| ID / Feature / loại | Source và mechanism | Tương tác → expected / observed | Responsive / dependencies | GitHub Pages |
|---|---|---|---|---|
| F17 — About bio/avatar / D | `app/about/page.tsx:18-134` | IO reveal header/bio; avatar RBN là CSS/text, không profile photo API | Main 1→2 columns ở lg; React/lucide/react-icons | Có |
| F18 — About capability cards / D | `about:9-16,136-160` | 5 card bodies được click, không navigation/dialog; intended informational | 1 / sm2 / lg4 cols; 5 records wrap | Có |
| F19 — About morph / P | `about:82-85` | Declares `morph` 8/10s nhưng không có keyframes; live CSS scan không thấy `morph`, active instances 0 | CSS decorative; browser limitation không giải thích missing definition | Có sau khi bổ sung keyframes, không cần backend |
| F20 — Experience timeline / D | `app/experience/page.tsx:17-58,93-204,291-296` | 3 records, badge/time/place/tags; all bodies click no action. Không link cert, không accordion/filter | Timeline max896, body card co hẹp mobile; lucide + IO | Có |
| F21 — Experience summary / D | `experience:206-235,299-315` | Derived 2 work/0 education/1 cert, literal 1.5+ years; không clickable statistics | Base2/md4 grid | Có |
| F22 — 10 skill cards / F+D | `app/skills/page.tsx:16-118,214-219` | Observer → % increments and bar fill. Settled levels 70,65,70,75,50,60,85,90,70,65; badges Expert≥85/Advanced≥70/Intermediate | 1/md2/lg3 grid gap20; React/IO/timers/lucide | Có |
| F23 — Skill summary counters / F+D | `skills:120-166,222-226` | Settled 2 Expert,4 Advanced,10 Total,70% average; counter not filter. Earlier screenshots can show mid-animation values | Base2/md4 grid; timers | Có |
| F24 — Project cards / D+X | `app/projects/page.tsx:19-58,96-182` | Apache-logger, Infostealer, Gmail-Shell, SmartMedica. All card body clicks no route/modal. Only footer anchors interactive | 1/md2/lg3; SVG icons not project screenshots; React/lucide/react-icons | Có; code/demo external |
| F25 — Code buttons / X | `projects:157-167` | 4 anchors: 3 repo URLs + SmartMedica points at author profile, not a specific source repo. GETs 200 | Equal flex buttons, no backend in portfolio | Có; don't claim own source download |
| F26 — Demo + View All / X | `projects:168-176,250-263` | Demo only SmartMedica; View All → GitHub profile. GET available. No in-page demo/runtime integration | CTA clipped polygon; React-icons | Có link; external demo functionality not audited |
| F27 — Scroll reveal / F+D | Each route IO: e.g. `projects:102-108`, `skills:42-62`, `experience:104-115` | Scrolled all sections on all sizes, cards reveal. Opacity-0 initial states depend on JS/IO; no content fallback proven | Varied index stagger, threshold .1/.05 | Có, progressive enhancement recommended |
| F28 — Card hover styles / U+P | `projects:60-94,117-129`; `skills:70-86`; `about:148`; `blog:57-70`; `research:181-205` | Source defines glow/border/translate/scale. Browser hover media=false despite pointer/pseudo/media attempts; actual hover render unverified | Tailwind hover media condition; focus is separate | Có CSS; desktop pointer review pending |

Skill animation limitation: observer callback returns cleanup rather than effect-owned timer cleanup (`skills:47-61,131-145`); repeated intersections may restart count; potential timer leakage on unmount. Đây là source-level risk, chưa chứng minh memory leak runtime. Source stats are self-assessed, not certified skill ratings.

## Blog, research và external integrations

| ID / Feature / loại | Source và mechanism | Tương tác → expected / observed | Responsive / dependencies | GitHub Pages |
|---|---|---|---|---|
| F29 — Medium RSS feed / X+F | `app/blog/page.tsx:164-199` | Client fetch rss2json endpoint for `medium.com/feed/@rbn0x00`; live 1 article Hackthebox Devvortex loaded; network resource 200 | Works at five viewport cases, React fetch/third-party service | Có browser fetch if CORS/quota/service allow; not offline/self-contained |
| F30 — Blog loading/error/empty / P | `blog:246-278` | Loading source/spinner; blocked rss2json → actual error text, zero cards; empty branch source-only, not fabricated | No Retry control; reload needed | Có; graceful fallback recommended |
| F31 — Blog card/meta/tags/thumbnail / D+X | `blog:18-146` | HTML-stripped truncated description, date, estimated read time, max3 tags; Read on Medium anchor; image fallback source verified, not force-tested | 1/md2/lg3 grid; IO/react/lucide | Có; externally hosted media/content/license dependencies |
| F32 — Blog summary / D | `blog:280-302` | Live 1 total post,4 category count,latest Jan5; count all categories even when card shows max3 | Base2/md3 grid | Có client-derived stats |
| F33 — Research tab switch / F | `app/research/page.tsx:404-444,500-544` | Click all 3 tabs desktop+mobile → 1 CVE /4 exploits /3 bounty cards, fade then swap. Not URL routing or server fetch | Single flex row clips at 390/360; no tab ARIA roles/selection semantics | Có local React/JS state |
| F34 — CVE display/details link / D+X | `research:46-63,215-283` | Literal CVE metadata, View CVE Details → NVD; link dispatch/URL verified. HTTP200 response alone not validate CVE content or claim accuracy | Research 1/md2/lg3 grid | Có; live external record optional |
| F35 — Exploit display/links / D+X | `research:65-114,287-347` | 4 records, verified badge from boolean; four Exploit-DB anchors. No exploit executed | Same grid; no backend | Có; verified label not independently authenticated |
| F36 — Bounty cards/earnings / D | `research:116-147,351-420` | 3 static disclosures; sum $100; card bodies noninteractive; no bounty platform integration | Cards same grid; stats base2/md4 | Có |
| F37 — Vercel Analytics / X+P | `app/layout.tsx:3,94` | Script resource `/_vercel/insights/script.js` loads200 in browser. Collection/event delivery/dashboard not checked | Provider integration, not visible control | UI yes; provider-relative endpoint not automatically portable to Pages |
| F38 — Google Fonts / X | `app/layout.tsx:31-36` | Font resource loads and computed font families confirmed; no local font files supplied | Network/CSP/availability affect fallback | Có external stylesheet; self-host later requires license review |

## Contact/backend và dormant functionality

| ID / Feature / loại | Source và mechanism | Tương tác → expected / observed | Responsive / dependencies | GitHub Pages |
|---|---|---|---|---|
| F39 — Contact cards / X+P+D | `app/contact/page.tsx:9-34,123-147` | GitHub works; LinkedIn is href `/` (verified wrong target); email mailto dispatch only; Location has null href/non-control | Contact main1/lg2; cards fit tested widths | Có links; fix LinkedIn target in later phase |
| F40 — Controlled form/native validation / F | `contact:39-41,156-223` | Name/email/subject/message editable; required missing blocks submit; malformed email blocks submit; no request sent | Name/email remain2 cols mobile; label lacks for/id association; React/native validation | Có client form/validation |
| F41 — Pending/error/reset UI / F+P | `contact:53-65,227-250` | Blocked transport → Transmitting disabled → Transmission Failed enabled → idle after3s. Values retained after failure. Tested without production send | Form focus border/glow computed verified; resize-y textarea | Có state UI; delivery integration separate |
| F42 — Success state / U+B | `contact:57-60,229-248` | Source: after resolved action → Message Sent, clear fields, reset4s. Not runtime-verified: no email sent | Same form | Cannot claim success until chosen transport acknowledges delivery semantics |
| F43 — Email delivery / B+P | `app/contact/actions.ts:1-32`; installed SDK `node_modules/resend/dist/index.mjs:954-960,1722-1730` | Server action uses Resend API key env, `he.encode`, recipient fixed. SDK returns `{data:null,error}` on provider HTTP failure; action ignores result, so client can show success. No server schema validation/rate limit/anti-spam in this function. Source path verified, no real error email sent | Resend/he/Next server action, secrets server-side | Không chạy nguyên trạng trên Pages; needs separately hosted endpoint/service or mailto |
| F44 — Error boundary/retry / U+P | `app/error.tsx:5-28` | Source Try again button has no onClick and doesn't call reset; failure route not forced in production | No tailored responsive styling | Có boundary after fixing retry; runtime path untested |
| F45 — Theme toggle / U (inactive) | `components/theme-switch.tsx:17-81`; `app/providers.tsx:23-31` | Defined but not rendered by layout/nav/routes; do not list as working feature | next-themes/HeroUI/React Aria only in dormant path | Could reproduce but not required by actual reference |
| F46 — Demo counter / U (inactive) | `components/counter.tsx:6-14` | Not imported/rendered; no Count button on site | HeroUI button | Trivial static frontend, not active feature |
| F47 — Alternate typewriter/Spotlight / U (inactive) | `components/ui/typewriter-effect.tsx:7-187`, `spotlight.tsx:9-56` | Dormant Motion/SVG helpers; not mechanism of visible hero | motion/react, clsx/tailwind-merge | Feasible if deliberately selected later, not verified feature |

## Toàn bộ button/link/control đã rà soát

- Desktop: logo, 7 navigation targets, Hire Me, 2 hero anchors, 2 hero social icons; project4 Code +1 Demo +1 View All; About GitHub/Blog; Blog1 Read on Medium; Research3 tabs +1 CVE +4 Exploit-DB links; Contact3 anchors +4 fields +submit; footer3 anchors. Duplicates across shared shell/homepage/standalone sections recorded in per-route inventories.
- Mobile: toggle open/close, overlay dismissal, all7 drawer routes, drawer CTA, Escape and Tab; Research3 tabs; form presence at all5 sizes. Source/body card tests cover all5 About highlights,3 timeline entries,10 skills,4 projects,1 loaded blog post and1/4/3 research cards.
- Decorative controls excluded from “works”: availability dot, category/tag/severity/status/count badges, proficiency display, timeline dots, Scroll label, floating hero tags, source-only retry/theme/counter.
- Browser action coverage is not a promise that every external destination works end-to-end or every validation/status branch ran. Success email, blog empty/fallback image, boundary failure/retry and rendered hover remain source-only or limited.

## GitHub Pages boundary

Mọi static content, canvas, typewriter, IO reveal, local tabs, anchors, native validation và outbound links có thể tái hiện trên Pages. Client RSS cần dịch vụ bên thứ ba còn hoạt động. Next Server Action/Resend không thể phục vụ từ Pages. Vercel analytics ingestion không mặc nhiên theo sang Pages. Không có login, auth session, database, CMS, project search/filter, localization, CV PDF download hoặc light/dark toggle đang render trong reference đã kiểm tra.

Đây là inventory phục vụ thiết kế, không phải danh sách tính năng đã được chọn để cài vào CV mới. Mọi thay đổi chờ duyệt Phase 2.
