import { describe, expect, it } from 'vitest';
import { STATIONS, stationById } from './line1';
import { arrivals, formatClock, liveDirection, timetable } from './schedule';
import { fare, stopsTowards } from './fares';

const thaoDien = stationById('L06');
const at = (h: number, m: number) => h * 60 + m;

describe('schedule', () => {
  it('runs every 8 minutes from 05:00 to 22:30 at the origin', () => {
    const t = arrivals(STATIONS[0], 'to-last');
    expect(formatClock(t[0])).toBe('05:00');
    expect(formatClock(t[t.length - 1])).toBe('22:28');
    expect(t[1] - t[0]).toBe(8);
  });

  it('offsets arrivals by 2 minutes per stop', () => {
    expect(formatClock(arrivals(thaoDien, 'to-last')[0])).toBe('05:10'); // 5 stops from Bến Thành
    expect(formatClock(arrivals(thaoDien, 'to-first')[0])).toBe('05:16'); // 8 stops from Suối Tiên
  });

  it('gives minutes to the next train and the next 3 departures', () => {
    const live = liveDirection(thaoDien, 'to-last', at(15, 17))!;
    expect(live.nextTimes).toHaveLength(3);
    expect(live.minutes).toBeGreaterThanOrEqual(1);
    expect(live.minutes).toBeLessThan(60);
    const [h, m] = live.nextTimes[0].split(':').map(Number);
    expect(at(h, m) - at(15, 17)).toBe(live.minutes);
  });

  it('marks first, past, next and last departures', () => {
    const rows = timetable(thaoDien, 'to-first', at(15, 17));
    const slots = rows.flatMap((r) => r.slots);
    expect(slots[0].marker).toBe('first');
    expect(slots[slots.length - 1].marker).toBe('last');
    expect(slots.filter((s) => s.state === 'next')).toHaveLength(1);
    const next = slots.findIndex((s) => s.state === 'next');
    expect(slots.slice(0, next).every((s) => s.state === 'past')).toBe(true);
  });
});

describe('fares', () => {
  it('keeps the Figma prices from Thảo Điền', () => {
    expect(fare(thaoDien, stationById('L14'))).toBe(28000);
    expect(fare(thaoDien, stationById('L01'))).toBe(24000);
  });

  it('lists stops from the current station to the terminal', () => {
    expect(stopsTowards(thaoDien, 'to-last').map((s) => s.index)).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(stopsTowards(thaoDien, 'to-first').map((s) => s.index)).toEqual([6, 5, 4, 3, 2, 1]);
  });
});
