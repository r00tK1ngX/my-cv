# Project setup — Phase 1

## Phạm vi và trạng thái

Phase 1 chỉ audit và reverse engineering. Chưa triển khai redesign, chưa bắt đầu Phase 2. Mọi tài liệu và ảnh bàn giao nằm dưới `docs/` của `/home/r00tK1ngX/my-cv-redesign`.

- Reference online: https://rbn0x00.vercel.app/
- Reference local: `/home/r00tK1ngX/web_CV`, chỉ đọc tuyệt đối.
- Development: `/home/r00tK1ngX/my-cv-redesign`.
- Nhánh kiểm tra trực tiếp: `redesign/portfolio-v2`.
- HEAD đầu audit: `f62fc0fa5c33bb65f0ac411fbfcc935294684745`; local `main` cùng commit. Working tree đầu audit sạch.
- Không có `AGENTS.md`, `CLAUDE.md`, `.cursorrules` tại home và root hai thư mục khi khám phá ban đầu. Chỉ kiểm chứng các điều kiện Phase 0 còn tồn tại, không suy diễn công việc Phase 0 từ lịch sử ngoài repo.

Nguồn kiểm chứng: `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, `git ls-files`, `git rev-parse --verify main`; bản ghi `evidence/repository-baseline.json` và `evidence/final-verification.json`.

## Quy tắc đã áp dụng

Không sửa/rename/xóa/overwrite reference; không chạy `next dev`, `next build`, linter `--fix`, trình cài đặt hoặc tạo `.next` tại reference. Không cài/nâng dependencies, không commit/push, không đổi nhánh, không deploy, không chỉnh CNAME/workflow/Pages/DNS/Cloudflare. Không đọc credentials hoặc core-dump memory. Các core dump chỉ kiểm kê tên, kích thước và metadata. `node_modules` được kiểm kê đầy đủ cấp filesystem và đối chiếu manifests/lock/imports liên quan, không coi vendor code là source website.

Baseline ngoài repo được ghi tại `/home/r00tK1ngX/.hermes/cache/scratch/phase1-reference-audit/baseline.json`. Hash SHA-256 cho mọi source/assets/config first-party và mọi file implementation đang có trong development; metadata size/mtime/mode của toàn bộ reference, bao gồm node_modules và core dumps. Kiểm tra cuối so sánh lại baseline. Không hash nội dung core dump và toàn bộ vendor tree; mức chứng minh tương ứng được ghi rõ trong final verification.

## Công cụ và phương pháp

- Source audit: đọc file có số dòng, truy vết import/symbol/handler, parse JSON và hash bằng Python stdlib. Không dùng package manager để sửa môi trường.
- Browser automation: Chrome `145.0.7632.6`, CDP; chụp PNG thật bằng `Page.captureScreenshot` với deviceScaleFactor 1.
- Viewport CSS: desktop 1440×900, laptop 1366×768, tablet 768×1024, mobile 390×844 và 360×800. Đây là viewport emulation (`mobile:false`), không chứng nhận thiết bị vật lý/touch/browser Safari.
- Cả tám route `/`, `/about`, `/experience`, `/skills`, `/projects`, `/blog`, `/research`, `/contact` được mở và cuộn từ đầu đến cuối ở từng viewport. Ảnh top giữ đúng kích thước yêu cầu; ảnh full-page có chiều cao toàn trang. Homepage có thêm ảnh Experience/Skills/Projects/footer.
- Đưa tab lên foreground bằng `Page.bringToFront`, xác nhận `document.visibilityState === 'visible'`; hook lỗi console idempotent. Các lần thử tab nền bị loại khỏi kết luận và đã được thay bằng ảnh/log foreground.
- Test form: native validation và nhánh pending/error khi cố tình chặn transport trong browser; không gửi email thật, không dựng response thành công. Mọi anchor instance được dispatch click có chặn navigation; sau đó click pointer từng URL ngoài riêng biệt và xác minh tab mới thực sự mở (`evidence/trusted-outbound-clicks.json`). Kiểm tra GET khả dụng tách riêng; không khởi chạy mail client. Không thực thi công cụ bảo mật được quảng bá trên project cards.
- Không chạy build/static export trong Phase 1; kết luận Pages dựa vào source và tài liệu nền tảng chính thức, không tuyên bố build/export đã pass.

## Giới hạn xác minh

`vision_analyze` trả HTTP 403 `client_not_allowed` hai lần. Ảnh PNG đã lưu và kích thước đã kiểm tra, nhưng chưa được model đọc pixel. Mô tả layout/màu/typography và lỗi clipping dựa trên DOM, computed CSS, source và tọa độ thực. Cần review ảnh bằng mắt trước khi chốt visual fidelity.

Browser báo `(hover:hover)=false` và `(pointer:fine)=false`. Thử pointer event, forced `:hover`, tắt touch emulation và emulated-media override vẫn không bật hover-gated CSS. Vì thế hover được trích từ source và ghi là chưa xác minh render. Không gán lỗi hover cho website.

Raw GET từ terminal đến reference gặp Vercel HTTP 429, trong khi browser truy cập được cả tám route. Bằng chứng browser ưu tiên cho runtime. Không dùng checkpoint 429 làm HTML ứng dụng. GitHub Pages public API `/repos/tykerai/my-cv/pages` trả 404 trong truy cập không token: không đủ kết luận Pages bị tắt hoặc cấu hình server hiện hành. Không đọc credential để vượt giới hạn này.

## Hồ sơ bàn giao

- [Reference audit và báo cáo Phase 1](reference-audit.md)
- [Component map](reference-component-map.md)
- [Feature inventory](reference-feature-inventory.md)
- [Design tokens](reference-design-tokens.md)
- [Existing CV audit](existing-cv-audit.md)
- `screenshots/{desktop,laptop,tablet,mobile}/`: ảnh gốc.
- `evidence/`: inventory nguồn/dependencies, DOM/CSS từng route/viewport, log tương tác, GET read-only, screenshot manifest, coverage và final verification. Chỉ là evidence, không phải implementation hay build output.

Các quyết định kiến trúc trong báo cáo là đề xuất để review. Phase 2 chỉ được bắt đầu sau khi chủ repo duyệt Phase 1.
