# Claude – repo bus-prototype

Đọc `AGENTS.md` (quy tắc chung) và `docs/WORKFLOW.md` (quy trình Claude ⇄ Figma).

Ở đầu mỗi phiên làm việc trên repo này, chạy bước đồng bộ ở `docs/WORKFLOW.md` §4 **trước khi** sửa code:
mốc `reviewedThrough` trong `docs/sync/claude.json` → `git log` và `git diff --stat` tới `origin/main` → `docs/CHANGELOG.md` → `npm run check:adhoc`.
Báo cho người dùng những gì đã thay đổi từ phía Figma (nhất là ad-hoc), và đề xuất đưa vào design system, giữ riêng cho luồng, hay bỏ.

Quyết định thiết kế và phạm vi: `docs/decisions.md`. Kế hoạch: `docs/plan.md`.
