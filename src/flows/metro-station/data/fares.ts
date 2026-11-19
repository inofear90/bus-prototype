import { STATIONS, type Direction, type MetroStation } from './line1';

/** Fares from Thảo Điền exactly as in Figma (decision: keep Figma prices). */
const FROM_THAO_DIEN: Record<string, number> = {
  'Tân Cảng': 7000, 'Công viên Văn Thánh': 7000, 'Ba Son': 14000, 'Nhà hát Thành phố': 14000, 'Bến Thành': 24000,
  'An Phú': 7000, 'Rạch Chiếc': 7000, 'Phước Long': 7000, 'Bình Thái': 12000, 'Thủ Đức': 12000,
  'Khu Công nghệ cao': 24000, 'Đại học Quốc gia': 24000, 'Bến Xe Suối Tiên': 28000,
};

/** Other stations: fare by number of stops (mock rule inside the 7.000–30.000đ range). */
function byStops(stops: number) {
  if (stops <= 3) return 7000;
  if (stops <= 5) return 12000;
  if (stops <= 8) return 24000;
  return 28000;
}

export function fare(from: MetroStation, to: MetroStation): number {
  if (from.name === 'Thảo Điền' && FROM_THAO_DIEN[to.name]) return FROM_THAO_DIEN[to.name];
  return byStops(Math.abs(to.index - from.index));
}

export const formatVnd = (v: number) => `${v.toLocaleString('vi-VN')} đ`;

/** Stations from `from` (inclusive) to the terminal of `direction`. */
export function stopsTowards(from: MetroStation, direction: Direction): MetroStation[] {
  const i = from.index - 1;
  return direction === 'to-last' ? STATIONS.slice(i) : STATIONS.slice(0, i + 1).reverse();
}
