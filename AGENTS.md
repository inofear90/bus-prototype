# Hướng dẫn cho agent (Claude, agent của Figma và các agent khác)

Repo này chứa prototype của VinBus và thư viện UI dùng chung `src/ds`. Quy trình đầy đủ: `docs/WORKFLOW.md`.

## Quy tắc
- Không commit thẳng vào `main`. Làm trên nhánh `claude/*` hoặc `figma/*`, rồi mở PR theo `.github/pull_request_template.md`.
- Mỗi PR thêm dòng vào `docs/CHANGELOG.md`, mục "Chưa phát hành": ghi nguồn và mọi thay đổi ad-hoc.
- Giao diện chỉ dùng token (`var(--…)`) và class typography (`t-…`) của `src/ds`.
- Chỉnh sửa ngoài design system đặt trong `src/flows/<luồng>/overrides/`, hoặc đánh dấu `adhoc-ok: <lý do>`.
- `src/ds` không được import từ `src/flows` hay `src/app`; lint sẽ chặn.
- Không sửa tay các file sinh tự động: `src/ds/tokens/tokens.css`, `src/ds/icons/icons.generated.ts`.
- Luồng mới đặt ở `src/flows/<id>/`, có `index.tsx` export một `FlowDefinition`, và thêm 1 dòng vào `src/flows/registry.ts`.
- Trước khi mở PR, chạy `npm run verify`.

## Chạy
- `npm ci`, rồi `npm run dev`. Dev server nghe cổng `$PORT` nếu có biến này.
- Luồng được mở: `prototype.config.json` → `flow`, hoặc `VITE_FLOW`, hoặc `?flow=`.
