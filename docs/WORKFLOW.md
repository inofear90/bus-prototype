# Quy trình Claude ⇄ Repo ⇄ Figma

```
Claude ──(PR từ claude/*)──▶  main  ◀──(PR từ figma/*)── Figma code layer
   ▲                          │  └─ GitHub Pages (deploy)
   └── đọc CHANGELOG + git log từ mốc sync + check:adhoc
```

## 1. Nhánh và PR
- `main` được bảo vệ: chỉ nhận thay đổi qua PR, CI phải xanh. Mỗi lần merge thì tự deploy.
- Claude làm việc trên `claude/<việc>`.
- Figma code layer: khi clone, chọn nhánh `main` rồi **tạo nhánh mới** `figma/<việc>` trước khi sửa. Khi xong, tạo PR từ trong Figma.
- Mọi PR điền đủ mẫu, nhất là mục **"Thay đổi ngoài design system"**, và thêm dòng vào `docs/CHANGELOG.md`.

## 2. Trình diễn một luồng trong code layer
Code layer chạy cả ứng dụng, nên luồng được mở được chọn như sau, theo thứ tự ưu tiên:
1. `?flow=<id>` trên đường dẫn.
2. Biến môi trường `VITE_FLOW=<id>`.
3. `prototype.config.json` → `"flow": "<id>"`.

Để trống thì hiện màn chọn luồng. Với mỗi code layer, bạn sửa 1 dòng trong `prototype.config.json`, hoặc nhờ agent của Figma sửa. Danh sách id nằm trong `src/flows/registry.ts`.

> Cần kiểm chứng: mỗi code layer có giữ được cấu hình riêng hay không. Nếu không, dùng `?flow=` hoặc một nhánh trình diễn riêng.

## 3. Chỉnh sửa ngoài design system (ad-hoc)
Được phép, nhưng phải để ở chỗ dễ thấy:
- **Ghi đè token cho riêng luồng**: trong `src/flows/<luồng>/overrides/`, đặt class bọc màn hình và gán lại biến, ví dụ `.screen { --radius-md: 16px; }`.
- **Style riêng**: file `src/flows/<luồng>/overrides/*.module.css`, áp vào component qua `className`.
- **Ngoại lệ đơn lẻ trong thư viện**: thêm chú thích `/* adhoc-ok: <lý do> */` ngay trên dòng đó.

`npm run check:adhoc` báo lỗi với giá trị viết cứng (màu, cỡ chữ, shadow) nằm ngoài các chỗ trên, và liệt kê mọi giá trị ad-hoc để xem xét đưa vào design system. CI chạy lệnh này trên mọi PR.

Không sửa `src/ds/tokens/tokens.css` bằng tay. File này được sinh từ `design-tokens/figma-variables.json`.

## 4. Claude đồng bộ ở đầu mỗi phiên
1. `git fetch --tags` rồi tìm mốc gần nhất: `git tag -l 'sync/claude-*' | sort | tail -1`.
2. Đọc thay đổi từ mốc đó:
   - `git log --oneline <mốc>..origin/main`
   - `git diff --stat <mốc>..origin/main`
   - Mục **Chưa phát hành** trong `docs/CHANGELOG.md`.
3. Chạy `npm run check:adhoc`, rồi phân loại từng thay đổi ad-hoc:
   - **Đưa vào design system**: token hoặc component mới trong `src/ds`, kèm ghi chú cho designer cập nhật Figma.
   - **Giữ riêng cho luồng**: để nguyên trong `overrides/`.
   - **Bỏ**: hoàn tác qua một PR.
4. Báo cáo cho người dùng, rồi đặt mốc mới: `git tag sync/claude-YYYYMMDD-HHMM origin/main && git push origin --tags`.
