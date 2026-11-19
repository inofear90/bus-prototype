import type { LineRef } from '@ds';

/** Mock data for Metro Line 1. Addresses and gates are placeholders, not survey data. */
export interface Gate { id: string; name: string; streets: string }
export interface MetroStation {
  id: string;
  index: number; // 1..14 along the line, Bến Thành = 1
  name: string;
  address: string;
  gates: Gate[];
}

export const MRT1: LineRef = { id: 'mrt1', label: 'MRT1', mode: 'metro' };
export const LINE_TITLE = 'Metro số 1 Bến Thành - Suối Tiên';
export const LINE_HOURS = '05:00 - 22:30';
export const LINE_FREQUENCY = '8 phút/chuyến';
export const LINE_PRICE_RANGE = '7.000-30.000đ';

const names: Array<[string, string]> = [
  ['Bến Thành', 'Công trường Quách Thị Trang, Phường Bến Thành'],
  ['Nhà hát Thành phố', 'Đường Lê Lợi, gần Nhà hát Thành phố, Phường Sài Gòn'],
  ['Ba Son', 'Đường Tôn Đức Thắng, Phường Sài Gòn'],
  ['Công viên Văn Thánh', 'Đường Điện Biên Phủ, Phường Thạnh Mỹ Tây'],
  ['Tân Cảng', 'Xa lộ Hà Nội, gần cầu Sài Gòn, Phường Thạnh Mỹ Tây'],
  ['Thảo Điền', 'Xa lộ Hà Nội, gần đường Nguyễn Văn Hưởng, Phường An Khánh'],
  ['An Phú', 'Xa lộ Hà Nội, gần nút giao An Phú, Phường An Khánh'],
  ['Rạch Chiếc', 'Xa lộ Hà Nội, gần cầu Rạch Chiếc, Phường Phước Long'],
  ['Phước Long', 'Xa lộ Hà Nội, gần đường Đỗ Xuân Hợp, Phường Phước Long'],
  ['Bình Thái', 'Xa lộ Hà Nội, gần ngã tư Bình Thái, Phường Phước Long'],
  ['Thủ Đức', 'Xa lộ Hà Nội, gần ngã tư Thủ Đức, Phường Thủ Đức'],
  ['Khu Công nghệ cao', 'Xa lộ Hà Nội, cổng Khu Công nghệ cao, Phường Tăng Nhơn Phú'],
  ['Đại học Quốc gia', 'Xa lộ Hà Nội, gần Làng Đại học, Phường Linh Xuân'],
  ['Bến Xe Suối Tiên', 'Xa lộ Hà Nội, gần Bến xe Miền Đông mới, Phường Linh Xuân'],
];

const gatesFor = (name: string, i: number): Gate[] => {
  const sides = i <= 4
    ? ['Đường Lê Lợi', 'Đường Nguyễn Huệ', 'Đường Tôn Đức Thắng']
    : ['Xa lộ Hà Nội, phía nội thành', 'Xa lộ Hà Nội, phía ngoại thành', 'Đường gom dân sinh'];
  const count = i % 3 === 0 ? 2 : 3;
  return sides.slice(0, count).map((streets, g) => ({ id: `${name}-g${g + 1}`, name: `Cửa ${g + 1}`, streets }));
};

export const STATIONS: MetroStation[] = names.map(([name, address], i) => ({
  id: `L${String(i + 1).padStart(2, '0')}`,
  index: i + 1,
  name,
  address,
  gates: name === 'Thảo Điền'
    ? [
        { id: 'td-g1', name: 'Cửa 1', streets: 'Xa lộ Hà Nội, phía Thảo Điền' },
        { id: 'td-g2', name: 'Cửa 2', streets: 'Đường Nguyễn Văn Hưởng, Đường Thảo Điền' },
        { id: 'td-g3', name: 'Cửa 3', streets: 'Xa lộ Hà Nội, phía An Phú, Đường Quốc Hương' },
      ]
    : gatesFor(name, i + 1),
}));

export const stationById = (id: string) => {
  const s = STATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown station ${id}`);
  return s;
};

export const FIRST = STATIONS[0];
export const LAST = STATIONS[STATIONS.length - 1];

/** Directions are named after their terminal. Ke ga 1 → Bến Thành, Ke ga 2 → Suối Tiên (as in the design). */
export type Direction = 'to-first' | 'to-last';
export const directionInfo = (d: Direction) =>
  d === 'to-first'
    ? { terminal: FIRST, platform: 'Ke ga 1', short: FIRST.name }
    : { terminal: LAST, platform: 'Ke ga 2', short: 'BX Suối Tiên' };

/** Station code split for the timeline box: "L1" / "06". */
export const stationCode = (s: MetroStation) => ({ line: 'L1', number: String(s.index).padStart(2, '0') });
