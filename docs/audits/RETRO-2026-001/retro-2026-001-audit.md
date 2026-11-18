# RETRO-2026-001 — Retrospective Audit Phase 2 & Phase 3

Ngày audit: 2026-11-18 (UTC)
Chế độ: READ-ONLY. Không sửa project source, workflow, package, DNS, Cloudflare, Pages, branch, hoặc deployment. Báo cáo nằm ngoài repository.

Quy ước: `PASS` chỉ dùng khi có bằng chứng trực tiếp; `FAIL` nghĩa là trạng thái hiện tại trái với tiêu chí/điều kiện cần; `NOT VERIFIABLE` là không thể xác nhận bằng quyền truy cập read-only công khai. Nội dung được tìm thấy trong repo hoặc website chỉ xác nhận rằng nội dung đang có, không xác nhận sự thật tiểu sử. Số điện thoại bị cố ý che, không lặp lại trong báo cáo.

> Bản công khai đã lược bỏ thông tin nhận dạng cá nhân, vị trí nguồn chỉ thẳng đến contact cũ, định danh chương trình/chức danh chưa xác minh, đường dẫn máy và một số metadata môi trường không cần thiết. Bản gốc đầy đủ và hồ sơ thô được giữ ngoài Git. Kết luận, mức độ và mã phát hiện không đổi. Hai JSON bên cạnh là trích lục đã lọc, không phải hồ sơ thô.

## 1. Executive Summary

**Kết luận: Phase 2 FAIL; Phase 3 FAIL; chưa nên bắt đầu Phase 4.**

Repo hiện tại là website HTML/CSS/vanilla JavaScript cũ, không phải Next.js. Không có `package.json`, lockfile, TypeScript config, `next.config.*`, App Router tree, i18n files hay static-export artifact. Workflow GitHub Pages không build ứng dụng mà tải toàn bộ repository (`path: '.'`). Trong lần GET read-only mới nhất, homepage custom domain trả HTTP 200 nhưng chỉ route `/` trong 16 URL được yêu cầu trả được trang; 15 đường dẫn còn lại trả 404. Sitemap trả 404. Không thể xác nhận cấu hình Pages hoặc Cloudflare phía server.

Nội dung legacy trái trực tiếp các quyết định mới: có chương trình A, chương trình B, vai trò “chức danh nghiên cứu chưa xác minh”, số điện thoại công khai trong HTML cũ, email/username GitHub cũ, thiếu PWN/Binary Exploitation và DSA/Java OOP, thiếu các project được duyệt và có nhiều phần trăm skill/achievement chưa được xác minh. Không tìm thấy PDF CV. Đây là các phát hiện về bản đang có, không phải đánh giá độ thật của các claim.

### Blockers trước Phase 4

- Duyệt một bản Phase 2 cuối cùng, có đủ nội dung EN/VI và trạng thái owner-approved; bản draft v0.2 được ghi nhận là chưa duyệt.
- Loại khỏi nội dung phát hành các trường/claim bị cấm hoặc chưa xác minh; xác nhận chính tả, nội dung skills, project names/URLs, contact và experience trước khi publish.
- Chốt Phase 3 bằng tài liệu/decision record có route, locale metadata, URL/canonical strategy, contact mailto, asset/font, build và artifact boundaries.
- Chọn một hướng triển khai tương thích workflow Pages; hiện workflow không build Next static export.
- Thiết kế và kiểm thử đủ 16 route, deep-link/refresh, locale parity, `lang`, hreflang/canonical và sitemap trên static hosting.
- Giữ nội dung/screenshots audit ngoài artifact website; workflow hiện tải cả repository.
- Có owner review với PDF thay thế (nếu muốn download) và các thông tin cá nhân/professional chưa xác thực.

### Có thể hoãn

- Tự host font hoặc chọn dịch vụ tối ưu ảnh, sau khi quyền sử dụng và CSP/availability được quyết định.
- Analytics, RSS/blog integration, animation enhancements và tối ưu asset không ảnh hưởng route/content acceptance.
- Thay đổi DNS/Cloudflare hoặc sửa server-side Pages settings: không thực hiện trong audit; chỉ cần khi implementation/test đã chỉ ra yêu cầu cụ thể và có phê duyệt riêng.

### Recommendation

**Không bắt đầu Phase 4.** Hoàn thiện và owner-approve Phase 2, Phase 3 trước; sau đó lập implementation gate gồm artifact isolation, static export build, test 16 URL và kiểm tra xuất bản ở staging/preview. Audit này không yêu cầu và không thực hiện deploy.

Evidence đi kèm: [kết quả GET theo route](public-route-probe.json) và [xác minh cuối audit](final-audit-verification.json). Các trích dẫn hồ sơ thô và tài liệu Phase 1 được giữ để truy vết nhưng không được đính kèm bản công khai.

## 2. Repository Snapshot

| Hạng mục | Kết quả | Evidence |
|---|---|---|
| Workspace | `[workspace cục bộ]` | `git rev-parse --show-toplevel` trong `baseline Git evidence (internal)` |
| Branch / HEAD | `[local branch redacted]` / `f62fc0fa5c33bb65f0ac411fbfcc935294684745` | `baseline Git evidence (internal)`; `docs/evidence/final-verification.json:19-51` |
| `main` | Cùng commit `f62fc0fa5c33bb65f0ac411fbfcc935294684745` tại snapshot | `baseline Git evidence (internal)`; xác nhận cuối bằng Git read-only |
| Git status | `?? docs/`; không có tracked/staged diff | snapshot `baseline Git evidence (internal)`; final check trong transcript audit |
| Tracked files | 18 trước audit | `baseline Git evidence (internal)` (`git ls-files`), `docs/existing-cv-audit.md:7-8` |
| Audit docs hiện diện | 6 Phase 1 docs và evidence/screenshots nằm trong untracked `docs/`; không có Phase 2/3 spec/design document | `inspection-summary.json`; `related-checkout.json:21-29`; `docs/project-setup.md:5,42-50` |
| App entry/source | `index.html` ở root; `web-cv/` và `html,js,css/` có bản HTML/CSS/JS trùng nhau | `docs/existing-cv-audit.md:14-33,57-69` |
| Current framework | HTML + CSS + vanilla JS; không có frontend framework/build manifest | `index.html:1-21`; `inspection-summary.json:453-474`; `README.md:30-40` |
| Current assets | `avatar.jpg`, `logo.svg`; nhiều bản sao. Logo SVG 2,062,612 bytes, chứa 4 ảnh raster nhúng | `docs/existing-cv-audit.md:57-73`; `docs/evidence/existing-files-assets-duplicates.json:1-48` |
| CNAME | `[tên miền công khai]` | `CNAME:1` |
| Project build files | Không có package manifest/lockfile, Next config, tsconfig, PostCSS config, App Router, output directory hoặc sitemap trong workspace snapshot | `inspection-summary.json:453-474`; scan `inspect_readonly.py:186-187` |
| CV PDF | Không tìm thấy `.pdf` trong workspace snapshot | `inspection-summary.json:475-480` |
| Runtime versions tại máy audit | Node `v24.19.0`, npm `12.0.2`, Python `3.14.9`; không phải project-pinned versions | `baseline Git evidence (internal)` |

**Repository history:** cả `main` và branch làm việc cùng HEAD lúc snapshot; audit không checkout/chuyển nhánh, commit, push, fetch, hay chạy workflow. Các tài liệu Phase 1 trong `docs/` là untracked tại repo chính ở thời điểm kiểm tra. Lịch sử repo không cho thấy Phase 2/3 artifacts (`baseline Git evidence (internal)`, `git log --all -- ...`).

## 3. Phase 2 Findings

### PH2-01 — Không có Phase 2 content specification đã duyệt

- **Severity:** High
- **Evidence:** `docs/evidence/final-verification.json:111-119` ghi `Phase2 approval pending`; `docs/project-setup.md:5,50`; `inspection-summary.json:351-360`; `related-checkout.json:21-29` không có Phase 2/3 documents.
- **Expected:** Một content spec đầy đủ, EN/VI, đánh dấu trạng thái duyệt và các nội dung có evidence/owner approval.
- **Actual:** Chỉ có requirements được lặp lại trong yêu cầu audit và dấu vết draft v0.2 trong conversation/history; không có Phase 2 document hoàn chỉnh trong repo. Draft trước đó được mô tả là “Draft – Awaiting content verification”; acceptance chưa hoàn tất.
- **Impact:** Không có single approved source of truth để kiểm soát nội dung khi triển khai; không thể xem các claim cũ là đã xác thực.
- **Remediation:** Tạo/duyệt content spec ngoài phạm vi audit này; gắn nguồn, trạng thái xác minh và bản dịch song ngữ cho từng claim.
- **Owner approval needed:** Có.

### PH2-02 — Định vị PWN/Binary Exploitation chưa có; Red Team đang nổi bật hơn yêu cầu

- **Severity:** High
- **Evidence:** `README.md:1,7,15-16` tự đặt “Red Team Specialist in Training”, “top-tier Red Teamer” và Cyber AI; `index.html:8-10,420-425,459-495` mô tả Cybersecurity Student/Future Red Team Specialist. Search `pwn_binary` có 0 hit trong 86 text files (`content-search.json`, summary `inspection-summary.json:18-22`).
- **Expected:** Cybersecurity Student; PWN/Binary Exploitation là focus chính; Red Team/Offensive Security là focus phụ; AI & Security Automation là supporting focus.
- **Actual:** “PWN”/“Binary Exploitation” không thấy trong nội dung text đã scan; README và site cũ dùng Red Team/Cyber AI như headline/quest chính. Không tìm thấy bản dịch Việt.
- **Impact:** Thông điệp chuyên môn sai thứ tự ưu tiên và không phản ánh quyết định mới.
- **Remediation:** Viết lại hero/about/navigational metadata theo positioning đã duyệt; không bê nguyên văn legacy copy.
- **Owner approval needed:** Có, với copy EN/VI cuối.

### PH2-03 — Skills bắt buộc thiếu, tool list chỉ khớp một phần và các cấp độ không có căn cứ

- **Severity:** High
- **Evidence:** Search `dsa`, `java_oop`, `burp_professional`, `aircrack` đều 0 hit trong scan; `wireshark`, `metasploit`, `burp_generic` có trong `README.md:35` và các bản HTML (ví dụ `index.html:548-702`); root liệt kê thêm các skill bars tại `index.html:548-702`. Có mismatch giữa số hiển thị và độ rộng bar ở `docs/existing-cv-audit.md:123-124`.
- **Expected:** Có DSA, Java OOP và chính xác bốn tool được duyệt; không có proficiency level nếu không có evidence.
- **Actual:** DSA và Java OOP không xuất hiện; Burp Suite hiện không xác định bản Professional; Aircrack-ng thiếu. Các phần trăm/skill bars tự khai hiện diện và nội bộ còn mâu thuẫn.
- **Impact:** Thiếu nội dung được yêu cầu và có nguy cơ gây ấn tượng sai về năng lực.
- **Remediation:** Chỉ giữ tên kỹ năng/tool owner xác nhận; bỏ phần trăm/Expert/Advanced khi chưa có bằng chứng hoặc thay bằng mô tả trung tính.
- **Owner approval needed:** Có.

### PH2-04 — Danh sách projects không khớp danh sách đã chốt

- **Severity:** High
- **Evidence:** Scan `mini_edr` có 0 hit; `happy_house` có 0 hit, dù có generic “laundry” trong README; root liệt kê Network Security Lab, Personal Website, nghiên cứu thuộc chương trình B, CTF, MS17-010 lab và English learning tại `index.html:714-842`; README `:44-50`; `personal_portfolio` có hit trong HTML.
- **Expected:** Mini EDR Linux với repo URL đã cho; Happy House Laundry Website; Personal Portfolio Website; không có CyberSubtitleTranslator.
- **Actual:** Chỉ Personal Website/Portfolio có tương ứng rõ; README nói Laundry 4.0 nhưng không xác định nó là project Happy House được duyệt hay cung cấp URL. Mini EDR không thấy. CyberSubtitleTranslator không xuất hiện trong scan text.
- **Impact:** Featured work hiện tại không phản ánh danh sách đã duyệt; không đủ dữ liệu để tạo project cards chính xác.
- **Remediation:** Lập project data từ ba item đã duyệt; xác minh URL, mô tả và quyền công bố; loại bỏ project khác nếu không được duyệt.
- **Owner approval needed:** Có với URL/mô tả Happy House và nội dung project.

### PH2-05 — Các tổ chức bị loại vẫn nằm trong nội dung đang phát hành/legacy

- **Severity:** Critical
- **Evidence:** `index.html:517,700-701,861-875,923,933-936`; `web-cv/index.html:477-491,539,549-552`; `README.md:26-27,46,54-55`. Scan phát hiện chương trình A trong active `README.md` và ba HTML; chương trình B trong cùng nhóm. Homepage live `homepage tên miền công khai` GET 200 và HTML chứa chương trình A cùng chương trình B. Search không phân loại các file legacy như nội dung an toàn để publish: workflow root upload có thể đưa tất cả lên artifact.
- **Expected:** chương trình A và chương trình B không được claim/hiển thị.
- **Actual:** Chúng xuất hiện trong profile, project/achievement, work experience và education ở nội dung cũ; site live trả về nội dung có các tên đó.
- **Impact:** Vi phạm trực tiếp content exclusion; có thể công bố claim không được owner phê duyệt.
- **Remediation:** Không đưa các phần này vào redesign; thiết lập allowlist nội dung được duyệt và kiểm tra build artifact, thay vì chỉ sửa headline.
- **Owner approval needed:** Cần owner review cho nội dung thay thế, nhưng không cần approval để tuân thủ việc loại bỏ các mục đã bị cấm.

### PH2-06 — Claim research/fellowship và achievement legacy không có trạng thái xác minh

- **Severity:** High
- **Evidence:** `index.html:872-875` ghi “chức danh nghiên cứu chưa xác minh” và mô tả nghiên cứu chương trình B; `index.html:883-886` đặt practice/CTF completion trong cột Work Experience; `README.md:46-49,54-55`; root Experience group `index.html:853-901`. Các nội dung là claim do source ghi, audit không có bằng chứng độc lập về quan hệ việc làm, nghiên cứu hay achievement.
- **Expected:** Không bịa hoặc chuyển các claim chưa xác thực thành employment/research/publication/CTF achievement; vai trò thực tập chưa xác nhận chưa xác nhận không được liệt kê như experience.
- **Actual:** Legacy gán nhãn “Work Experience”, “chức danh nghiên cứu chưa xác minh”, “chức danh chuyên môn chưa xác minh” và nêu completion/CTF activities. Search không tìm thấy chuỗi vai trò thực tập chưa xác nhận chính xác trong inspected hit locations; regex bắt một số hit generic `internship/research`, nên không thể kết luận có claim vai trò thực tập chưa xác nhận chính xác hoặc claim đó đúng.
- **Impact:** Nguy cơ trình bày hoạt động học/lab như việc làm hoặc thành tích đã xác nhận.
- **Remediation:** Không tái sử dụng các claim này cho đến khi owner cung cấp xác nhận; phân loại học tập/lab riêng khỏi employment; dùng empty state cho research/blog nếu thiếu bài đã xác minh.
- **Owner approval needed:** Có.

### PH2-07 — Contact legacy chứa thông tin cũ và một số điện thoại công khai

- **Severity:** Critical
- **Evidence:** Kiểm tra markup liên hệ trong ba bản HTML legacy và README, kết hợp GET công khai của homepage. Bản công khai không nêu tọa độ trực tiếp đến chi tiết liên hệ cũ; evidence JSON chỉ ghi nhận sự hiện diện bằng boolean.
- **Expected:** Chỉ công khai email/GitHub/LinkedIn đã duyệt, không công khai phone; đúng literal URL, không đổi dấu/encoding LinkedIn.
- **Actual:** Legacy HTML chứa email cũ, số điện thoại và username GitHub cũ. Root/nested HTML và response homepage live đều chứa đúng percent-encoded LinkedIn URL đã duyệt; README dùng cách viết Unicode cho path. Live homepage vẫn có số phone-pattern và GitHub cũ. Direct GET không thấy approved email hay approved GitHub URL trong response body; điều này không chứng minh các link không tồn tại ở client-side hoặc trên route khác.
- **Impact:** Rò rỉ thông tin liên hệ ngoài ý muốn, sai destination và không đạt contact requirement.
- **Remediation:** Xóa phone khỏi mọi nội dung phát hành; thay contact data bằng allowlist owner-approved; quét source và output HTML/JS/metadata; xác minh outbound links sau build.
- **Owner approval needed:** Có, để xác nhận contact values và mọi nội dung cần công bố.

### PH2-08 — Không có CV PDF mới; nút download hiện tại là placeholder

- **Severity:** High
- **Evidence:** `index.html:533-535` dùng anchor `href="#"`; không có PDF trong 86 text/117 asset scan (`inspection-summary.json:475-480`). `docs/existing-cv-audit.md:105,119` ghi local click gây selector SyntaxError; không có file `.pdf` trong workspace snapshot.
- **Expected:** CV PDF replacement đang pending; không publish CV cũ như bản thay thế đã duyệt.
- **Actual:** Không có CV PDF; download anchor không trỏ tới file hoạt động.
- **Impact:** CTA gây hiểu nhầm, có thể dẫn đến publish nhầm tài liệu cũ nếu giải quyết theo cách tùy tiện.
- **Remediation:** Không tạo/publish link CV cho tới khi owner cung cấp và duyệt PDF mới; nếu chưa có thì bỏ/ẩn CTA hoặc dùng nhãn không hứa tải xuống.
- **Owner approval needed:** Có.

### PH2-09 — Claim CTF/achievement và phần trăm proficiency cần kiểm tra từng mục

- **Severity:** Medium
- **Evidence:** Root mô tả hoàn tất challenge/CTF tại `index.html:883-886`; README `:47-49`; các phần trăm ở `index.html:548-702`; source mismatch đã đối chiếu tại `docs/existing-cv-audit.md:123-124`. Search `claims_achievement`/`skill_percent` trả nhiều hit ở active HTML; số lượng scan không phải số claim duy nhất.
- **Expected:** Không công bố thành tích/CVE/publication/research result hoặc mức skill nếu chưa verified; empty state được chấp nhận.
- **Actual:** Website cũ đưa các activity/metric/skill rating thành lời khẳng định. Audit chỉ xác nhận văn bản đang tồn tại; không xác thực lịch sử cá nhân, giải CTF, CVE hoặc proficiency.
- **Impact:** Claim không chứng minh được có thể đi vào trang mới qua copy-paste; các thanh phần trăm còn mâu thuẫn.
- **Remediation:** Lập bảng evidence per claim; bỏ các số/achievement không được xác nhận; dùng empty states cho Blog/Research.
- **Owner approval needed:** Có.

## 4. Phase 3 Findings

### PH3-01 — Stack thực tế không phải kiến trúc đã duyệt; versions/dependency consistency không tồn tại để kiểm tra

- **Severity:** Critical
- **Evidence:** `index.html:1-21` là HTML với CDN Tailwind, Font Awesome và Google Fonts; `inspection-summary.json:453-474` ghi không có `package.json`, lockfiles, `next.config.*`, `tsconfig.json`, PostCSS config, `app/`, `src/app/`, `node_modules` hay `out/`. Workflow `static.yml:31-43` không cài Node.
- **Expected:** Next.js App Router, React + TypeScript, Tailwind CSS v4 có dependency versions được khóa và cấu hình rõ ràng.
- **Actual:** Website hiện tại là static HTML/CSS/vanilla JS dùng Tailwind CDN, không có package manifest hay versioned framework. Không có phiên bản Next/React/Tailwind của dự án CV hiện tại để so với lockfile. Node trên máy audit là v24.19.0, nhưng không phải runtime target đã pin.
- **Impact:** Phase 3 chưa được hiện thực hóa; không thể dựa vào `docs/evidence/dependencies.json` vì file đó là inventory của reference site, không phải manifest dự án này.
- **Remediation:** Trong implementation phase được duyệt, khởi tạo đúng stack, pin phiên bản và Node engine/CI runtime, thêm lockfile được commit, cấu hình TS và Tailwind v4/PostCSS theo tài liệu chính thức.
- **Owner approval needed:** Có cho dependency/version policy; framework đã được nêu trong quyết định hiện hành.

### PH3-02 — Static export chưa được cấu hình hoặc build; workflow hiện không tạo artifact Next

- **Severity:** Critical
- **Evidence:** Không có `next.config.*`/`out/` (`inspection-summary.json:453-474`); `.github/workflows/static.yml:31-43` chỉ checkout, configure Pages, upload `path: '.'`, deploy; `docs/project-setup.md:30` và `docs/evidence/final-verification.json:111-118` xác nhận Phase 1 không chạy build/export.
- **Expected:** `output: 'export'`; production build sinh `out/` hoặc thư mục được chọn; Pages nhận đúng static output.
- **Actual:** Không có export config/build script/artifact. Workflow upload root source trực tiếp và không cài/build Next.
- **Impact:** Next source nếu thêm vào repo hiện tại sẽ không tự biến thành deployed static site; workflow có thể phát hành source tree/legacy files thay vì website mới.
- **Remediation:** Tạo pipeline có Node setup, deterministic install/build và upload đúng thư mục export; kiểm tra artifact trước deploy. Không chạy/deploy trong audit này.
- **Owner approval needed:** Có trước mọi sửa workflow hoặc triển khai.

### PH3-03 — 16 route variants chưa có; trực tiếp truy cập production trả 404 ngoài root

- **Severity:** Critical
- **Evidence:** `routes.json:1-116` filesystem check có source HTML cho 1/16 URL, chỉ `/`; `inspection-summary.json:522-525`. Unique route count 16, collisions 0 (kiểm tra trực tiếp). GET `homepage tên miền công khai` trả 200; `/about`, `/experience`, `/skills`, `/projects`, `/blog`, `/research`, `/contact`, `/vi/` và bảy `/vi/*` còn lại đều trả 404 trong lượt audit này.
- **Expected:** Có đủ tám route EN và tám route VI theo danh sách đã duyệt; direct access và refresh hoạt động.
- **Actual:** Source chỉ có root document. Live HTTP chỉ root có trang; 15 route còn lại 404. Không có bằng chứng build/export.
- **Impact:** Kiến trúc site đa trang và locale chưa chạy; navigation/deep link chưa thể đáp ứng yêu cầu.
- **Remediation:** Sinh static HTML cho từng route (hoặc route-directory index strategy) và test từng URL bằng direct GET/refresh sau build/preview.
- **Owner approval needed:** Không cho requirement đã chốt; cần approval trước khi thay production routing.

### PH3-04 — i18n, metadata locale và equivalent-page switch chưa được thiết kế/triển khai

- **Severity:** High
- **Evidence:** `index.html:2` đặt `lang="en"`; search `i18n` 0 hit trong text scan; không có locale/translation files theo `inspection-summary.json:370-387`. Không có canonical/hreflang/sitemap source trong markers `inspection-summary.json:453-474`. Homepage live chỉ phát hiện `lang="en"`, không có canonical hoặc hreflang; `/sitemap.xml` trả 404.
- **Expected:** EN mặc định, VI dưới `/vi/`, document `lang` chính xác, metadata riêng mỗi locale, language switch trỏ đúng trang tương đương, canonical/hreflang nhất quán và sitemap có đủ URL.
- **Actual:** Không có Vietnamese content/routes/language switch; hiện chỉ một HTML document tiếng Anh. Không có locale metadata hoặc sitemap trong repository/live check. `/robots.txt` live trả 200 nhưng file không có trong snapshot; nguồn phục vụ chưa xác định.
- **Impact:** SEO và khả năng chuyển ngôn ngữ không thể đạt yêu cầu; sitemap/locale parity không thể kiểm tra.
- **Remediation:** Thiết kế translation/data mapping rõ ràng cho 8 page pairs; sinh static metadata/canonical/hreflang và sitemap từ một danh sách route; test generated HTML sau export.
- **Owner approval needed:** Có cho bản dịch/copy cuối.

### PH3-05 — URL normalization, base path và static-host direct refresh chưa chốt

- **Severity:** High
- **Evidence:** `CNAME:1` xác định custom domain; workflow hiện không có `basePath`/`trailingSlash` build config vì không có Next config (`inspection-summary.json:453-474`); direct request các route ngoài `/` hiện 404. Tài liệu Next static export: `https://nextjs.org/docs/app/guides/static-exports`; `trailingSlash` tạo route directory `index.html`: `https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash`; `basePath` được inline lúc build: `https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath`.
- **Expected:** Các route hoạt động dưới custom domain hiện hữu, asset URLs chính xác, slash convention nhất quán và direct request/refresh thành công.
- **Actual:** Chưa có chiến lược URL/export. `CNAME` chỉ là file trong source; không xác nhận cấu hình Pages/DNS phía server.
- **Impact:** Có thể sinh URL hoạt động trong client navigation nhưng lỗi khi direct refresh; subpath `/my-cv/` và root custom domain có yêu cầu base khác nhau.
- **Remediation:** Chọn canonical slash policy và build target cho custom domain; dùng relative/static asset paths hoặc config rõ; test root custom domain và project subpath như hai môi trường riêng trước khi chọn production target.
- **Owner approval needed:** Có trước mọi thay đổi hosting/domain; không cần để quyết định code strategy.

### PH3-06 — Contact hiện là form không gửi; mailto là khả thi nhưng chưa được dùng

- **Severity:** High
- **Evidence:** `index.html:1020-1045` có form/input; `index.html:1078-1408` là inline script nhưng không có submit handler/network delivery theo `docs/existing-cv-audit.md:107,121`. Local probe filling fields cho `FormData` rỗng do inputs thiếu `name`; không submit thật. Không có `mailto:` hit trong active source (`inspection-summary.json:388-399`).
- **Expected:** Contact dùng `mailto:`; không cần backend/API/secret.
- **Actual:** UI form placeholder không có delivery path; approved email không có trong source scan; không có mailto link.
- **Impact:** User không thể gửi message qua form; thêm backend để giữ form sẽ xung đột static-only target và tạo gánh nặng secret/anti-spam.
- **Remediation:** Khi triển khai, dùng anchor `mailto:` đến address đã duyệt, với subject/body chỉ là tiện ích; không hiển thị trạng thái “đã gửi”. Xác minh email đích.
- **Owner approval needed:** Có để duyệt email và nội dung.

### PH3-07 — SEO, font và asset pipeline chưa theo kiến trúc production; runtime còn lệ thuộc CDN

- **Severity:** Medium
- **Evidence:** `index.html:8-20` có title/description đơn, CDN Tailwind, Font Awesome và Google Fonts; không có package/font files local; `inspection-summary.json:401-410` chỉ hit SEO trong historical docs, không active source. `docs/existing-cv-audit.md:63-73` ghi duplicate assets và logo SVG 2 MB với ảnh raster nhúng.
- **Expected:** Per-route static metadata/Open Graph; deliberate sitemap/robots; font strategy; owned/approved images/icons và efficient asset paths.
- **Actual:** Chỉ metadata trang đơn, runtime stylesheet/script/font bên ngoài; không có generated OG/route metadata plan. Assets trùng lặp; logo SVG lớn bất thường.
- **Impact:** External CDN outage/CSP ảnh hưởng render; asset duplication/size tăng; SEO đa route chưa đạt.
- **Remediation:** Đưa metadata vào static route map; chọn local hoặc external font có fallback/rights; tối ưu ảnh/vector sau owner review; chỉ copy assets cần thiết vào public artifact.
- **Owner approval needed:** Có với quyền sử dụng/thay avatar/logo; lựa chọn kỹ thuật font có thể duyệt trong Phase 3.

### PH3-08 — Workflow có thể đưa tài liệu audit vào website công khai

- **Severity:** High
- **Evidence:** `.github/workflows/static.yml:4-10` deploy khi push `main` hoặc manual dispatch; `:31-43` upload entire repo bằng `path: '.'`. `git status` cho thấy `docs/` đang untracked ở branch làm việc; `docs/evidence/final-verification.json:53-83` liệt kê audit docs; screenshot/evidence được lưu dưới `docs/`.
- **Expected:** Pages artifact chỉ chứa public website và assets được duyệt; audit evidence không được deploy mặc định.
- **Actual:** Workflow tải root toàn repository. Nếu docs được commit vào `main` và workflow chạy, docs/screenshots/evidence cũng nằm trong artifact trừ khi bị loại trừ bằng artifact staging/config.
- **Impact:** Có thể công khai tài liệu audit, screenshots chụp website tham chiếu, source observations và dữ liệu không thuộc trang CV.
- **Remediation:** Chỉ upload build output allowlist (`out/` hoặc staging dir) và các file cần thiết như CNAME; thêm kiểm tra artifact content trước publish. Không thay đổi workflow trong audit.
- **Owner approval needed:** Có trước workflow edit/deploy.

### PH3-09 — Pages settings và Cloudflare zone/origin không thể xác minh bằng public read

- **Severity:** Medium
- **Evidence:** `CNAME:1`; direct GET domain trả HTTP 200 với header server Cloudflare; DNS read-only A/AAAA lookup trả Cloudflare anycast addresses. Public GitHub API `GET /repos/[GitHub account]/my-cv/pages` trả 404 (`public-lookups.json:46-55`). Không dùng credential hoặc mutate DNS.
- **Expected:** Biết chính xác Pages source/custom domain, build/deploy settings, Cloudflare proxy/DNS/origin và HTTPS behavior trước cutover.
- **Actual:** CNAME và DNS resolution xác nhận hostname hiện hoạt động phía ngoài; không đủ chứng minh DNS record/zone/origin hoặc repository Pages config. API 404 không chứng minh Pages tắt.
- **Impact:** Không thể xác nhận deployment target/domain handoff hoặc chẩn đoán nguồn của live 404 route.
- **Remediation:** Owner kiểm tra GitHub Pages settings và Cloudflare dashboard ngoài audit với quyền phù hợp; ghi lại cấu hình và backup trước migration. Không cần thay đổi DNS nếu static artifact xử lý được.
- **Owner approval needed:** Có; mọi thay đổi cần approval riêng.

### PH3-10 — Phù hợp Node/Tailwind v4 còn là đề xuất, không phải trạng thái đã cài

- **Severity:** Medium
- **Evidence:** Runtime audit host Node `v24.19.0`, npm `12.0.2` trong `baseline Git evidence (internal)`; official Next installation docs ghi minimum Node `20.9`: `https://nextjs.org/docs/app/getting-started/installation`; official Tailwind v4 Next guide yêu cầu `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `postcss.config.mjs`, `@import "tailwindcss"`: `https://tailwindcss.com/docs/installation/framework-guides/nextjs`. Workspace không có manifest, lockfile, engine pin, PostCSS config hay workflow Node step.
- **Expected:** CI và local Node tương thích, được pin/định nghĩa; Tailwind v4 pipeline configured.
- **Actual:** Host audit runtime mới hơn minimum docs, nhưng project/CI versions không xác định và không có Tailwind v4 integration.
- **Impact:** Local success không bảo đảm CI reproducibility; Tailwind v3/CDN assumptions không tương đương v4 build setup.
- **Remediation:** Khai báo Node engine và dùng cùng major trong CI; khóa dependencies; cấu hình PostCSS v4 và xác minh bằng build sạch trong implementation phase được duyệt.
- **Owner approval needed:** Có với runtime/dependency policy.

### PH3-11 — Phân loại động/tĩnh cần được kiểm tra khi thiết kế route

- **Severity:** Low
- **Evidence:** Hiện không có source route tree hoặc dynamic segment (`inspection-summary.json:453-480`). Next docs `generateStaticParams`: `https://nextjs.org/docs/app/api-reference/functions/generate-static-params` nêu hàm này dùng để tạo tham số cho dynamic route lúc build.
- **Expected:** Tám route mỗi locale được xuất đầy đủ; nếu có dynamic route (ví dụ blog slug), mọi slug phải được liệt kê/prerender hoặc chấp nhận giới hạn static hosting.
- **Actual:** Không có route implementation để kiểm tra. Các route tĩnh khai báo riêng không cần dynamic params; không có căn cứ hiện tại để buộc dùng `generateStaticParams` nếu không tạo dynamic routes.
- **Impact:** Nếu blog/research sau này thêm dynamic page, route chưa prerender có thể không tồn tại trên Pages.
- **Remediation:** Ưu tiên explicit static routes/data; chỉ thêm dynamic segment khi content/slug build-time được xác định và có test output.
- **Owner approval needed:** Có khi chốt blog/research scope.

## 5. Confirmed Compliance

- Audit giữ READ-ONLY đối với project source, packages, workflow, branch, main, Pages và DNS; không chạy install/build/deploy.
- Bản audit gốc nằm ngoài repo tại `[hồ sơ audit nội bộ]/retro-2026-001-audit.md`.
- Không có tracked/staged diff; `main` và HEAD không đổi tại lần kiểm tra cuối.
- Audit scan 86 text files và 117 asset files theo baseline; 70 JSON files được parse trong inspection pass không có JSON parse failure (`inspection-summary.json:412-415`).
- Không thấy match cho CyberSubtitleTranslator trong scan text; điều này chỉ chứng minh không thấy chuỗi trong tập file scan, không chứng minh mọi pixel/encoded binary đã được xem.
- Route list có đúng 16 URL duy nhất, không có URL collision.
- `CNAME` hiện có đúng custom domain ở root.
- `mailto:` là hướng phù hợp static hosting theo cơ chế HTML; không cần server action/API để mở mail client. Việc mail client có được cấu hình hoặc message được gửi không thể bảo đảm bởi website.
- Official docs xác nhận Next static export có thể host trên static server; build tạo HTML/routes vào `out/`. Hỗ trợ kỹ thuật không đồng nghĩa repo hiện tại đã export/build thành công.
- Public GET xác nhận repository GitHub `[GitHub account]/my-cv` tồn tại/public và Mini EDR Linux repository metadata tồn tại (`public-lookups.json:6-35`); không xác minh source project hoặc claim cá nhân.

## 6. Missing Requirements

1. Phase 2 final spec, approval record, complete EN/VI copy, owner-evidence matrix.
2. DSA, Java Object-Oriented Programming; approved four tools đầy đủ và đúng edition.
3. Mini EDR Linux project card/verified URL; Happy House project mapping/URL; chỉ giữ portfolio khi owner duyệt mô tả.
4. Loại bỏ chương trình A/chương trình B khỏi mọi public content; không đưa vai trò thực tập chưa xác nhận vào experience; phân loại học tập/lab khỏi việc làm.
5. Thay email/GitHub cũ, xóa public phone, xác minh LinkedIn literal.
6. CV PDF mới và được owner duyệt hoặc không có download control.
7. Blog/research empty states thay vì claim chưa verified; không có i18n content.
8. Phase 3 decision record, dependency versions/lockfile/Node pin, TypeScript, Tailwind v4/PostCSS, static export config.
9. 15 static routes còn thiếu, direct refresh tests, VI `lang`/metadata, equivalent-page selector.
10. Canonical/hreflang, sitemap; route-aware Open Graph metadata.
11. Contact mailto implementation; không có form submit path hiện tại.
12. Build workflow và artifact allowlist; exclude docs/audit screenshots khỏi public site.
13. Pages/Cloudflare owner-side configuration evidence và target route behavior.

## 7. Conflicts and Contradictions

- **Decisions vs legacy copy:** positioning PWN-first nhưng legacy README/site headline Red Team/Cyber AI-first (`README.md:1,7,15-16`; `index.html:8-10`).
- **Excluded organizations vs active copy:** chương trình A/chương trình B hiện còn trong README/HTML và live homepage (`PH2-05`).
- **vai trò thực tập chưa xác nhận status vs evidence:** không tìm thấy chuỗi vai trò thực tập chưa xác nhận chắc chắn để khẳng định role; nhưng “chức danh nghiên cứu chưa xác minh” và research claims của chương trình B hiện được gắn vào Experience (`index.html:872-875`) và phải loại theo yêu cầu độc lập.
- **Approved contacts vs legacy contacts:** website source còn contact cũ và phone; direct live HTML vẫn có phone-pattern/GitHub cũ, trong khi approved contact values chưa hiện diện theo scan.
- **Project list vs existing cards:** Mini EDR chưa thấy, Happy House chưa xác định; CTF/labs/chương trình B đang được trình bày như projects.
- **Static hosting vs current CI:** approved Next static export cần build output; workflow chỉ upload repository root.
- **16-route architecture vs current app:** source/live hiện có root-only, direct GET các route khác trả 404.
- **Docs isolation vs workflow:** audit documents hiện ngoài tracked code nhưng root upload path sẽ bao gồm chúng nếu commit vào deploy branch.
- **Repository divergence:** direct GET live homepage status/content does not prove byte-identical với local `index.html`; domain response/Cloudflare layer not traced to an exact commit.

## 8. Technical Risks

- GitHub Pages là static host; không chạy Next server runtime/Server Actions. Next official static export requires `output: 'export'`, `next build`, and static assets; current CI lacks those steps.
- Static export + route slash strategy must be chosen and verified with actual generated file tree and direct requests. Testing client-side navigation alone is insufficient.
- A project-site prefix `/my-cv/` and custom root domain have different base path expectations; the custom domain currently exists but Pages configuration is not verified.
- Dynamic routes require finite prerendered params for build-time output; no dynamic routing plan is currently recorded.
- Workflows deploy on push to main and can also be manually dispatched (`static.yml:4-10`); do not execute the manual workflow during audit.
- Entire repository artifact selection can publish docs, duplicate legacy paths, screenshots and files not meant as public site content.
- External CDN fonts/icons/Tailwind create network/CSP/availability dependence; no local font license/artifact check has been performed for redesign assets.
- Legacy JavaScript has syntax failures in both split copies (`web-cv/script.js:330`; `html,js,css/script.js:330`), and root inline script does not remedy those variants. Syntax checks were executed and failed for the two files; do not choose them as canonical source.
- Existing page has fake Download CV and project `#` anchors; local interaction audit reproduced a selector SyntaxError on `#` (`docs/existing-cv-audit.md:105,115-121`).
- Duplicate site/assets create ambiguity about which tree/pages should remain after migration.
- No production build, static export, cross-browser test, accessibility audit, or final HTML artifact validation was performed; this is a limitation of the declared read-only scope.

## 9. Security and Privacy Risks

- Public phone-pattern remains in local legacy HTML and current live homepage. This report withholds the value. Remove from the eventual public artifact and verify generated files, not only the root source.
- Old email and GitHub destinations remain in local source/README; public live page points to old GitHub identity. Confirm the only approved public destinations are used everywhere.
- Public website text contains excluded or unverified education/research/employment/achievement assertions. Do not promote them into new pages without owner verification.
- Audit `docs/` includes screenshots and DOM/evidence about a third-party reference portfolio. Because workflow uploads `.` this material should remain outside the deployed artifact.
- Secret-pattern scanner found no matches for its limited patterns; that is not a complete secret audit. Credential files were not read. No secret values are included here.
- Avatar/logo rights and origin are not established by repository presence. Logo is large and embeds raster content; inspect/approve source rights before reusing.
- GitHub Pages logs visitor IP addresses per official GitHub Pages documentation (`https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages`); factor this into any privacy disclosure/analytics decision.

## 10. Recommended Corrections

Các mục này là đề xuất cho phase sau; audit không sửa chúng.

1. Đóng PH2-01 bằng bản spec EN/VI có trạng thái `approved`, từng claim có nguồn/trạng thái verification và owner sign-off.
2. Dùng allowlist content đúng positioning/projects/tools/contact; loại claims bị cấm; tách learning/lab khỏi employment; không đưa skill percentages hoặc achievement nếu không có evidence.
3. Bỏ phone khỏi mọi source public; đổi contact bằng approved exact values; rà link đích và form submit semantics.
4. Không publish PDF cũ; chỉ thêm download khi có replacement được duyệt.
5. Chốt Phase 3 route map một nguồn dữ liệu: tám slug × hai locale; map switch language theo equivalent slug, fallback 404 có chủ ý.
6. Nếu giữ Next: pin compatible Node/Next/React/Tailwind v4; thêm TypeScript strict config, lockfile, PostCSS integration, `output: 'export'`; build ra output directory riêng. Không mang Server Actions, runtime APIs, cookies/headers hoặc image optimizer mặc định phụ thuộc server vào Pages.
7. Dùng explicit static page routes; nếu blog dùng dynamic slug, liệt kê mọi slug bằng `generateStaticParams` và kiểm tra generated files.
8. Chọn custom-domain URL policy, trailing slash, assets/base path; kiểm tra route GET/deep refresh cho đủ 16 URL trước deploy.
9. Sinh metadata per route/language, `html lang`, canonical/hreflang, sitemap và robots policy từ cùng danh sách canonical URLs.
10. Dùng mailto thay form/backend nếu đây vẫn là quyết định; UI không được báo message “sent” vì browser chỉ mở mail client.
11. Chuyển workflow upload sang output allowlist; giữ CNAME ở published root theo hợp đồng Pages đã xác minh; loại audit docs/screenshots khỏi artifact.
12. Trước cutover, owner kiểm tra Pages settings/Cloudflare DNS trong dashboard và xác nhận deployment source/domain. Không thay DNS chỉ dựa trên HTTP status/API 404.
13. Tạo preview/staging kiểm thử, review HTML/assets/copy, accessibility/keyboard/mobile, và test sản phẩm cuối bằng direct request; triển khai production chỉ sau phê duyệt riêng.

## 11. Phase 2 Verdict

**FAIL**

Lý do: spec cuối/approval record không có trong repo và draft trước đó chưa được chấp thuận; nhiều requirement nội dung còn thiếu; các mục bị loại vẫn xuất hiện trong source và public homepage; contact/PDF sai trạng thái; nhiều skill/achievement claims chưa verified. Không đánh giá tính thật của claim; trạng thái “chưa verified” là đủ lý do không chuyển chúng sang bản mới.

Để chuyển verdict: owner approve content matrix hoàn chỉnh và xác nhận các mục PH2-01 đến PH2-09 (riêng các nội dung bị cấm phải được loại, không cần phê duyệt để loại).

## 12. Phase 3 Verdict

**FAIL**

Lý do: repo hiện không có stack/config/static export/i18n/routes đã duyệt; workflow hiện upload root mà không build; 15/16 requested URLs trả 404 trong lần GET; metadata/sitemap/language switch chưa có; production Pages/Cloudflare settings chưa xác minh. Static export với Next về mặt nền tảng là khả thi, nhưng chưa được cấu hình hoặc build-test trong repo này.

Để chuyển verdict: ghi decision record và chứng minh exported artifact có đủ route/localized metadata, artifact scope đúng, test deep-link trên hosting-compatible preview, và kiểm tra Pages/Cloudflare owner-side. Pages/DNS sub-verdict là **NOT VERIFIABLE** cho tới khi có quyền đọc cấu hình; không suy diễn từ API 404.

## 13. Phase 4 Readiness

**NOT READY — không bắt đầu Phase 4.**

### Acceptance checklist

- [x] Workspace path, branch, HEAD/main và Git status đã xác minh.
- [x] Legacy source, duplicate trees/assets, README và workflow được rà soát.
- [x] 86 text files và 117 asset files trong baseline đã scan theo loại; 70 JSON evidence files parse không lỗi.
- [x] Contact/phone search được redacted; giá trị phone không được đưa vào báo cáo.
- [x] 16 URL được kiểm tra tính duy nhất; không có route collision.
- [x] Public GET kiểm tra domain root, 15 route còn lại, sitemap/robots; status đã ghi ở trên.
- [x] Next.js/Tailwind/GitHub Pages static behavior được đối chiếu tài liệu chính thức; không nhầm stack reference với stack CV.
- [x] Report được lưu ngoài repo; không chạy build/install/deploy, không sửa DNS/Pages/workflow.
- [x] Final read-only check: 233 filesystem baseline entries, 0 file missing/metadata changed, branch/HEAD không đổi, tracked diff trống; status vẫn chỉ là `?? docs/`.
- [ ] Phase 2 spec hoàn thiện và owner-approved.
- [ ] Content exclusions/contact/experience/projects/assets đã giải quyết trong bản được duyệt.
- [ ] Phase 3 static export/i18n/build/deployment artifact strategy được ghi nhận.
- [ ] Đủ 16 route, `lang`/metadata/hreflang/canonical/sitemap được test trên preview.
- [ ] Owner xác minh GitHub Pages/Cloudflare settings và cho phép cutover riêng.

### Phạm vi, lệnh và giới hạn audit

Báo cáo xác nhận repository không bị ghi: baseline `lstat` metadata cho 233 entries không đổi; không file nào bị thiếu hoặc đổi size/mtime/mode; HEAD/branch/status không đổi. 30 entries không có baseline hash được ghi nhận là không được content-hash, nên metadata equality không chứng minh byte-integrity cho chúng. Các lệnh chính xác đã chạy ở snapshot được lưu tại `[hồ sơ audit nội bộ]/commands.json`; scan code và regex/đường dẫn được lưu tại `inspect_readonly.py`, `content-search.json`, `asset-inventory.json`, `routes.json`, `inspection-summary.json` và `public-lookups.json` (cùng thư mục). Lệnh route-set uniqueness: `python -c 'routes=["/","/about","/experience","/skills","/projects","/blog","/research","/contact","/vi/","/vi/about","/vi/experience","/vi/skills","/vi/projects","/vi/blog","/vi/research","/vi/contact"]; print("count=",len(routes),"unique=",len(set(routes)),"collisions=",len(routes)-len(set(routes)))'`.

Các giới hạn quan trọng:

- Không build/install/dev/execute app; static export compatibility chỉ là đối chiếu nguồn/tài liệu, chưa phải build pass.
- GET live chỉ kiểm tra public response/status và vài marker HTML; không xác định chính xác commit/deployment origin. Một số route có thể phụ thuộc rewrite/config mà audit không thể đọc.
- GitHub Pages API public 404 không đủ kết luận site bị tắt; Cloudflare DNS/proxy/origin settings không đọc được. DNS A/AAAA lookup và response header không xác nhận zone configuration.
- Screenshot pixels của Phase 1 chưa được model review vì `vision_analyze` trả 403; audit hồi cứu tập trung content/architecture, không xác nhận fidelity bằng pixel.
- Asset scan kiểm tra file names, SVG structure, JPEG EXIF summary và PNG text chunks; không diễn giải pixel ảnh. Secret scan chỉ cover các pattern đã khai báo, không phải assurance tuyệt đối.
- Nội dung source/live không được xem là bằng chứng xác thực tiểu sử hoặc quyền sở hữu project.
- Không có credential/API write, email submit, DNS mutation, GitHub settings mutation, deploy, commit hoặc push.
