# Prototype v1 – Chi tiết ga metro: Quyết định đã chốt

- **Nguồn design:** Figma `Vinbus---SandBox`, section "Tra cứu trạm - Chi tiết Metro" (node `2470:78375`)
- **Nguồn style:** Figma `[GTCC] - Foundation`, các trang Typography và Elevation
- **Nguồn token:** `design-tokens/figma-variables.json` (export ngày 19/11/2026, collection "Primitive - VinBus" và "Semantic - VinBus")
- **Nguồn spec:** Design Spec "Chi tiết ga metro (truy cập từ Tra cứu trạm)" v1.0
- **Cập nhật:** 20/11/2026
- **Trạng thái:** Đã chốt. **Chưa code.** Chỉ bắt đầu khi có hiệu lệnh.

## 1. Phạm vi v1

### Trong phạm vi
- Màn hình: Home → SC-01 Danh sách trạm/ga → SC-02 Chi tiết ga → SC-03 Lịch tàu.
- Chỉ **1 main case**: các thẻ hướng còn tàu chạy (chờ từ 1 đến dưới 60 phút).
- Tab Theo dõi tàu: thẻ tuyến, 2 thẻ hướng, tap để chọn, nút "…" mở SC-03.
- Tab Lối lên xuống (tap để chọn cửa) và tab Giá vé (danh sách ga theo hướng, nút đảo hướng).
- Bottom sheet 3 mức: 30%, 55% (mặc định) và 90%.
- Ở SC-01, mọi thẻ (metro và bus) đều chọn được. Thẻ bus có nút "Đi đến trạm" và "Xem chi tiết"; bấm vào thì hiện thông báo ngoài phạm vi. "Đi đến ga" của thẻ metro cũng hiện thông báo ngoài phạm vi.

### Ngoài phạm vi
- Hết chuyến, chuyến cuối, chờ >60 phút, <1 phút, ga đầu/cuối, banner, sự cố.
- Mọi edge case (mất mạng, API lỗi, map lỗi, tab rỗng, lịch rỗng) và skeleton loading.
- **Map:** chỉ có placeholder, cắm qua interface `MapAdapter`. Phase sau làm map rồi tích hợp lại.
- Flow "Đi đến ga".

## 2. Quyết định về hành vi

| # | Vấn đề | Quyết định |
|---|---|---|
| 7 | Tab Giá vé có đổi map không | Có: map focus theo chiều đi của vé. Phase này chỉ gọi `MapAdapter`, chưa vẽ. |
| 8 | Tiêu đề Giá vé không khớp danh sách | Tiêu đề đổi theo hướng của danh sách. |
| 9 | Tooltip | Bỏ. |
| 10 | Dữ liệu lịch tàu | Sinh dữ liệu nhất quán: 05:00–22:30, 8 phút/chuyến, 14 ga L01–L14. |
| 11 | Trạng thái selected của thẻ hướng và thẻ cửa | Tap lại vẫn giữ selected. Chỉ đổi khi tap sang thẻ khác. |
| 12 | Badge "FREE" | Icon tĩnh, không tương tác. |
| 13 | Vuốt xuống ở mức 90%; hai nút tim | 90% vuốt xuống thì về 55%. Nút tim ở header và nút "Yêu thích" ở dock đồng bộ trạng thái. |
| O-2 | Giờ dùng để tính "phút tàu đến" | Clock giả lập cố định trong khung hoạt động (mặc định 15:17). |

## 3. Design token

### 3.1 Nguồn và cách sinh
- Variables: chỉ dùng `figma-variables.json`. Script `scripts/build-tokens.mjs` sinh ra `src/ds/tokens/tokens.css`, gồm cả mode Light và Dark. v1 chỉ kiểm tra Light.
- Text style và effect style: lấy giá trị từ file Foundation (xem 3.4 và 3.5).
- Khi tên trong Figma khác với tên chuẩn, code luôn dùng **tên chuẩn**. Bảng map bên dưới ghi lại các chỗ cần designer rebind trong Figma.

### 3.2 Token cũ → token chuẩn

| Đang bind trong Figma | Dùng trong code |
|---|---|
| `spacing/md` = 16, `radius/md` = 16 (thư viện cũ) | Theo chuẩn: `spacing/md` = 12, `radius/md` = 12 |
| `color/text/default`, `color/icon/default`, `c-fg-main` #333, `c-fg-main-on-overlay` #1a1a1a, `color/icon/primary` #363a3f | `text/primary` hoặc `icon/default` (#3a4040) |
| `c-fg-sub` #7f7f7f, `Default+Walk/Street-index-1` | `text/secondary` hoặc `icon/secondary` (#828b8c) |
| `color/text/emphasis` #0a0c11 | `text/on-light` hoặc `surface/inverse` |
| `color/outlineEmp` | `border/default` |
| `color/border/default` #dfe6e6 | `border/subtle` |
| `Color/Primary`, `c-brand-bg-element-normal`, `color/border/focus` (#2dccd3) | `action/primary/bg` hoặc `border/selected` |
| `color/surfaceEmp` #f2f2f4 (nền xám sheet) | `surface/raised` (#f5f7f7) |
| `color/surfaceNeutral` | `surface/field` hoặc `surface/raised` |
| `color/surfaceSub`, `color/bg/surface/subtle`, `color/neutral/white` | `surface/default` |
| `c-fg-on-color`, `Giao thông/on-transit-dark` | `text/on-brand` hoặc `text/on-dark` |
| `Giao thông/transit-go` #1d8b31 | `feedback/success/text` |
| `Giao thông/transit-info` #2d7ad2, `Color/Accent` #2d67d3, `c-status-useful-on-tint` #0077c8 | `feedback/info/strong` (#2d7ad2) |
| `Metro/Street-index-1` #1d518b | `feedback/info/text` |
| `color/scrim` #000 | `scrim/default` |
| `space/*`, `spacing/inline/*`, `spacing/stack/*`, `spacing/inset/*`, `radius/xs` 8 | `spacing/*` chuẩn theo giá trị |

### 3.3 Token bổ sung (chưa có trong bộ chuẩn, chờ đưa vào Figma)

| Token code | Giá trị | Dùng cho |
|---|---|---|
| `transit/gate` | #ffb700 | Marker và icon cửa ra/vào |
| `transit/line/mrt1` | #2d7ad2 | Badge MRT1, icon ga metro |
| `transit/direction/primary` | #1078ee | Chiều tuyến đang highlight (phase map) |

### 3.4 Typography (Google Sans)

Letter-spacing trong Figma tính theo % cỡ chữ, nên CSS dùng `em`: −1.5% → `-0.015em`.

| Nhóm | Cỡ / line-height | Weight | Letter-spacing |
|---|---|---|---|
| head H3 (XXXL) | 32 / 40 | Smb 600, Md 500 | −4% → `-0.04em` |
| head H4 (XXL) | 24 / 32 | Smb, Md | `-0.04em` |
| title XL | 20 / 28 | Smb, Md | `-0.03em` |
| title LG | 16 / 24 | Smb, Md | `-0.03em` |
| label LG / MD / SM / XS | 16/24, 14/20, 12/16, 10/14 | Smb, Md, Reg | `-0.02em` |
| body LG / MD / SM | 16/24, 14/20, 12/16 | Smb, Md, Reg | `-0.015em` |
| support SM / XS | 12/16, 8/12 | Md, Reg | `-0.01em` |

### 3.5 Elevation

| Token | Nguồn |
|---|---|
| `elevation/base`, `lowest`, `low`, `mid`, `high`, `highest` | Foundation › Elevation level |
| `shadow/micro` | Foundation › Shadow |
| `effect/compPrimary` (blur 24 + shadow) | Foundation, dùng cho nút nổi trên map |

Effect cũ trong luồng được map như sau (đề xuất, chờ designer xác nhận):

| Đang dùng | Dùng trong code |
|---|---|
| `elevation/base` | Giữ nguyên |
| `Light/Shadow-low` | `elevation/lowest` |
| `Light/Shadow-middle` | `elevation/low` |
| `Sheet-shadow`, `Sheet-shadow-2` | `elevation/high` |
| `effect/compSecondary` | `effect/compPrimary` |

## 4. Quy ước nội dung
- Tên ga: dùng "Bến Xe Suối Tiên" ở mọi nơi (chip có thể rút gọn thành "BX Suối Tiên").
- Mỗi ga có địa chỉ và cửa ra/vào riêng. Địa chỉ mock phải hợp lý.
- Các chuyến kế tiếp chạy đúng nhịp 8 phút. Giá vé giữ theo Figma.

## 5. Hạ tầng
- Repo **public**. Deploy bằng GitHub Pages qua GitHub Actions.
- Ưu tiên trình duyệt trên điện thoại. Trên desktop, prototype hiện trong khung 375×812.
- Font: `@fontsource/google-sans` (OFL-1.1, 400/500/600, có subset tiếng Việt), đóng gói cùng app.
- Icon và minh hoạ: export từ Figma. **Đang chặn:** môi trường build chưa tải được file từ `www.figma.com`.

## 6. Ghi chú khi triển khai v1 (20/11/2026)

| Điểm | Cách làm | Cần designer xem |
|---|---|---|
| Số phút lớn trên thẻ hướng (44/40, −4%) | Style riêng trong `DirectionCard`, vì Foundation chưa có cỡ này | Thêm style "display" vào Foundation |
| Style "Reg" (body/label/support) | Theo Foundation: weight 400. Bản local trong luồng đang dùng file font Medium, nên chữ địa chỉ trên prototype sẽ nhạt hơn mock | Rebind sang style chuẩn |
| Bo góc card | `radius/md` = 12 theo chuẩn (mock đang 16) | Rebind |
| Gạch chân tab | 3px, theo mock (`stroke/medium` chuẩn là 2px) | Chốt 2px hay 3px |
| Nền icon cửa | `transit/gate-subtle` #fff8e6 | Đưa vào bộ chuẩn |
| Icon thiếu trong bộ icon | `more` (3 chấm) và `headset` là **placeholder**. `clock` được cắt từ sprite `ic.ref/clock.svg` | Bổ sung icon |
| Minh hoạ Home (thành phố, xe bus, 3 tính năng, Tin Xanh) | Khối màu placeholder | Cung cấp asset |
| Giá vé từ các ga khác Thảo Điền | Quy tắc mock theo số ga: ≤3 ga: 7.000; 4–5 ga: 12.000; 6–8 ga: 24.000; ≥9 ga: 28.000 | – |
| Chuyến cuối | 22:28 tính từ ga đầu (05:00 + bội số của 8 phút, ≤ 22:30) | – |
| Thẻ trong SC-01 | Thẻ metro và bus đều có trạng thái selected. Nút trong thẻ bus chỉ hiện thông báo ngoài phạm vi | – |
