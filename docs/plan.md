# Kế hoạch thực hiện – Prototype v1 & thư viện UI dùng lại

Nguyên tắc: **chỉ xây những component mà luồng này dùng tới, nhưng thiết kế API để luồng khác dùng lại được.** Không dựng hạ tầng "phòng khi cần".

## 1. Stack
- React + TypeScript + Vite.
- Style bằng CSS Modules và CSS variables (token sinh từ Figma).
- Không dùng thư viện UI, state manager (chỉ React context) hay router lib (chỉ một stack điều hướng tối giản).
- Font `@fontsource/google-sans`. Test bằng Vitest, chỉ cho phần logic thuần.

## 2. Cấu trúc

```
design-tokens/figma-variables.json   nguồn variables (export từ Figma)
scripts/build-tokens.mjs             sinh src/ds/tokens/tokens.css
src/
├─ ds/                    THƯ VIỆN (dùng lại cho mọi luồng)
│  ├─ tokens/             tokens.css (sinh tự động), typography.css, elevation.css
│  ├─ primitives/         Text, Icon, Button, IconButton, Chip, Badge, Tag, Divider, Tabs
│  ├─ layout/             Screen, TopBar, BottomSheet (3 snap), Dock, MapSlot + MapAdapter
│  └─ transit/            LineBadge, RouteChip, StationListCard, StationHeader,
│                         DirectionCard, TimetableGrid, StationTimeline, GateItem
├─ flows/metro-station/   LUỒNG NÀY (chỉ lắp ráp)
│  ├─ screens/            Home, StationList, StationDetail, Schedule
│  └─ data/               mock MRT1 + schedule.ts (hàm thuần, có test)
├─ app/                   stack điều hướng, clock giả lập
└─ gallery/               trang /gallery liệt kê component, thay cho Storybook
```

Ba quy tắc giữ thư viện sạch:
1. `ds/` không bao giờ import từ `flows/`. Có lint rule chặn.
2. Component trong `ds/` không chứa dữ liệu hay copy cứng. Mọi nội dung đi qua props.
3. Luồng chỉ dùng token và component có sẵn. Cần style mới thì bổ sung vào `ds/` trước.

## 3. Lộ trình

| Phase | Nội dung | Kết quả để review |
|---|---|---|
| P0 – Nền móng | Scaffold, ESLint, script build-tokens, typography, elevation, font, icon | Gallery: màu, chữ, spacing, shadow |
| P1 – Primitives | Text, Icon, Button, IconButton, Chip, Badge, Tag, Divider, Tabs | Gallery có đủ variant |
| P2 – Layout | Screen, TopBar, Dock, MapSlot, **BottomSheet 3 mức** | Demo kéo sheet trên điện thoại thật |
| P3 – Transit | Các component transit (chỉ trạng thái main case) | Gallery với dữ liệu mock |
| P4 – Lắp luồng | Home → SC-01 → SC-02 (3 tab) → SC-03, mock MRT1, logic lịch có test | Prototype chạy trọn luồng |
| P5 – Hoàn thiện | So pixel với Figma, test iOS/Android, deploy GitHub Pages | Link public |

P2 rủi ro nhất với yêu cầu "mượt", nên làm và kiểm tra sớm.

## 4. Hiệu năng
- BottomSheet tự viết. Khi kéo chỉ đổi `transform: translate3d` qua ref và `requestAnimationFrame`, không re-render React. Thả tay thì snap bằng CSS transition.
- Không dùng CSS-in-JS runtime hay thư viện animation. Bundle mục tiêu dưới 100 KB gzip.

## 5. Ngoài phạm vi v1
Storybook, monorepo/npm package, dark mode (token có sẵn nhưng không kiểm thử), i18n, map thật, các trạng thái ngoài main case.
