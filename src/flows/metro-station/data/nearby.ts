import type { LineRef } from '@ds';
import { MRT1 } from './line1';

/** Nearby stops for SC-01 (mock, as in Figma). Only the metro station opens a detail page. */
export interface NearbyStop {
  id: string;
  name: string;
  mode: 'metro' | 'bus';
  distance: string;
  walkTime: string;
  address: string;
  lines: LineRef[];
  metroStationId?: string;
}

const bus = (...labels: string[]): LineRef[] => labels.map((label) => ({ id: label, label, mode: 'bus' }));
const routes = bus('D4', '60-1', '60-3', '60-4', '27', 'D3');

export const NEARBY: NearbyStop[] = [
  { id: 'b1', name: 'Bến xe Mỹ Đình', mode: 'bus', distance: '120m', walkTime: '2 phút đi bộ', address: 'Đối diện Nhà hát Thành phố, gần giao lộ Đồng Khởi – Lê Lợi', lines: routes },
  { id: 'b2', name: 'Trạm Tuy Hòa', mode: 'bus', distance: '180m', walkTime: '3 phút đi bộ', address: '101 Hai Bà Trưng, Phường Sài Gòn, TP. Hồ Chí Minh', lines: routes },
  { id: 'm-td', name: 'Thảo Điền', mode: 'metro', distance: '240m', walkTime: '4 phút đi bộ', address: 'Xa lộ Hà Nội, gần đường Nguyễn Văn Hưởng, Phường An Khánh', lines: [MRT1], metroStationId: 'L06' },
  { id: 'b3', name: 'Hồ Gươm', mode: 'bus', distance: '320m', walkTime: '5 phút đi bộ', address: 'Phạm Ngũ Lão, Phường Bến Thành, TP. Hồ Chí Minh', lines: routes },
  { id: 'b4', name: 'Đại học Bách Khoa', mode: 'bus', distance: '410m', walkTime: '6 phút đi bộ', address: 'Đối diện Trung tâm thương mại Vincom', lines: routes },
  { id: 'b5', name: 'Bệnh viện Bạch Mai', mode: 'bus', distance: '520m', walkTime: '7 phút đi bộ', address: 'Lê Thánh Tôn, Phường Sài Gòn, TP. Hồ Chí Minh', lines: routes },
  { id: 'b6', name: 'Công viên Thống Nhất', mode: 'bus', distance: '640m', walkTime: '9 phút đi bộ', address: 'Gần giao lộ Điện Biên Phủ – Xô Viết Nghệ Tĩnh', lines: routes },
  { id: 'b7', name: 'Royal City', mode: 'bus', distance: '780m', walkTime: '11 phút đi bộ', address: 'Đường Xô Viết Nghệ Tĩnh, Phường Gia Định', lines: routes },
];
