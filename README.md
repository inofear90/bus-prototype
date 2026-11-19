# VinBus – Prototype "Chi tiết ga metro" + thư viện UI

Prototype tương tác cho luồng **Tra cứu trạm → Chi tiết ga metro** (v1, main case). Kèm theo là thư viện UI `src/ds/` để các luồng sau dùng lại.

- Prototype: GitHub Pages của repo (sau khi bật Pages, xem bên dưới). Mở trên điện thoại để có cử chỉ thật.
- Thư viện component: thêm `#/gallery` vào cuối link.
- Đổi giờ giả lập: thêm `?t=HH:MM` (mặc định 15:17, nên để trong khung 05:00–22:00).

Quyết định và phạm vi: [`docs/decisions.md`](docs/decisions.md). Kế hoạch: [`docs/plan.md`](docs/plan.md).

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # logic lịch tàu và giá vé
npm run lint       # gồm rule: src/ds không được import từ flows
npm run build
```

## Cấu trúc

```
design-tokens/figma-variables.json   variables chuẩn export từ Figma
scripts/build-tokens.mjs             -> src/ds/tokens/tokens.css (chạy tự động khi build)
scripts/build-icons.mjs              -> src/ds/icons/icons.generated.ts
src/ds/          THƯ VIỆN: tokens, primitives, layout (BottomSheet, MapSlot…), transit components
src/flows/       các luồng; chỉ lắp ráp từ '@ds'
src/app/         điều hướng, clock giả lập, yêu thích
src/gallery/     catalogue component (#/gallery)
```

## Quy trình cập nhật từ Figma

- **Variables đổi:** export lại bằng plugin Variable-Export/Import, ghi đè `design-tokens/figma-variables.json`, rồi chạy `npm run tokens`.
- **Thêm icon:** đặt file SVG (tên kebab-case) vào `src/ds/icons/svg/`, rồi chạy `npm run icons`. Icon một màu sẽ tự theo `color` của CSS.
- **Text style:** bảng nằm ở `src/ds/tokens/typography.css`. Class `.t-{nhóm}-{cỡ}-{weight}`, ví dụ `t-label-md-smb` ứng với Figma "label/MD Smb". Letter-spacing tính bằng `em` (Figma −2% → `-0.02em`).

## Thêm một luồng mới

1. Tạo `src/flows/<ten-luong>/`. Chỉ import từ `@ds`.
2. Nếu luồng cần component hoặc style chưa có, bổ sung vào `src/ds/` trước (không chứa dữ liệu hay copy cứng). Sau đó thêm component vào gallery.
3. Màn hình có map dùng `MapSlot` và gọi map qua `MapAdapter` (`focusPoint`, `highlightPath`). Khi có map thật, chỉ cần thay adapter.

## Deploy

Workflow `.github/workflows/deploy.yml` tự chạy khi có push lên `main`. Bật Pages một lần duy nhất: **Settings → Pages → Source: GitHub Actions**.
