# Changelog

Mỗi PR merge vào `main` thêm 1–3 dòng ở mục **Chưa phát hành**, ghi rõ nguồn (Claude / Figma) và mọi thay đổi ad-hoc.
Mốc đồng bộ của Claude nằm ở `docs/sync/claude.json`. Xem `docs/WORKFLOW.md`.

## Chưa phát hành

- [Claude] Home: dùng ảnh hero (thành phố + xe bus) và 3 thumbnail dịch vụ (Tuyến xe, Vé tháng, Trạm xe) do designer cung cấp, thay cho khối màu placeholder. Cắt bỏ viền xám 1px ở mép dưới ảnh hero. Mục Tin Xanh vẫn là placeholder.
- [Claude] Bỏ `tsconfig.tsbuildinfo` khỏi repo (file build vô tình bị commit ở PR #2).
- [Claude] Thêm danh sách luồng (`src/flows/registry.ts`) và màn chọn luồng. Chọn luồng trình diễn qua `prototype.config.json`, `VITE_FLOW` hoặc `?flow=`.
- [Claude] Dev server nhận cổng `$PORT`; thêm `.figma/make/{install,dev,deploy-preview}` và `.mise.toml` cho Figma code layers.
- [Claude] Quy trình Claude ⇄ Figma: mẫu PR, CHANGELOG, thư mục `overrides/`, lệnh `npm run check:adhoc` (chạy cả ở CI), mốc đồng bộ `docs/sync/claude.json`.
- Ad-hoc: không có mới. 3 ngoại lệ đã ghi lý do (`adhoc-ok`): khung điện thoại desktop, số phút cỡ lớn trên thẻ hướng, mã ga 2 dòng.

## v1.0.0 – 20/11/2026 · Prototype "Chi tiết ga metro" (PR #1)

- [Claude] Luồng Home → Danh sách trạm/ga → Chi tiết ga metro (3 tab) → Lịch tàu, main case.
- [Claude] Thư viện `src/ds`: token sinh từ Figma variables, typography và elevation từ Foundation, BottomSheet 3 mức, MapSlot + MapAdapter, các transit component, trang `#/gallery`.
- [Claude] Sửa theo góp ý: light mode mặc định; sheet và lớp phủ nằm trên top bar; ẩn thanh cuộn; thẻ bus có trạng thái được chọn; bấm tab không làm đổi mức sheet; khi sheet hạ thì tự cuộn tới mục đang chọn; có animation khi back.
