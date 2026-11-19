import { STATIONS, type Direction, type MetroStation } from './line1';
import type { TimetableRow } from '@ds';

/** Timetable rules (decision #10): first train 05:00, last 22:30 from the terminal, every 8 min, 2 min per stop. */
export const FIRST_DEPARTURE = 5 * 60;
export const LAST_DEPARTURE = 22 * 60 + 30;
export const HEADWAY = 8;
export const MINUTES_PER_STOP = 2;

const pad = (n: number) => String(n).padStart(2, '0');
export const formatClock = (minutes: number) => `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;

/** Arrival times (minutes after midnight) of every train at `station` going in `direction`. */
export function arrivals(station: MetroStation, direction: Direction): number[] {
  const stopsFromOrigin = direction === 'to-last' ? station.index - 1 : STATIONS.length - station.index;
  const offset = stopsFromOrigin * MINUTES_PER_STOP;
  const out: number[] = [];
  for (let t = FIRST_DEPARTURE; t <= LAST_DEPARTURE; t += HEADWAY) out.push(t + offset);
  return out;
}

/** True for the terminal of a direction (no train leaves from it towards itself). */
export const isTerminalFor = (station: MetroStation, direction: Direction) =>
  direction === 'to-last' ? station.index === STATIONS.length : station.index === 1;

export interface LiveDirection {
  /** Whole minutes until the next train, at least 1 (main case). */
  minutes: number;
  /** Next departures, first = the train counted in `minutes`. */
  nextTimes: string[];
}

/** Live card data at time `now` (minutes after midnight, may be fractional). */
export function liveDirection(station: MetroStation, direction: Direction, now: number, count = 3): LiveDirection | null {
  const upcoming = arrivals(station, direction).filter((t) => t >= now);
  if (upcoming.length === 0) return null;
  return {
    minutes: Math.max(1, Math.ceil(upcoming[0] - now)),
    nextTimes: upcoming.slice(0, count).map(formatClock),
  };
}

/** Rows for the schedule sheet, grouped by hour. */
export function timetable(station: MetroStation, direction: Direction, now: number): TimetableRow[] {
  const times = arrivals(station, direction);
  const nextIdx = times.findIndex((t) => t >= now);
  const rows = new Map<number, TimetableRow>();
  times.forEach((t, i) => {
    const h = Math.floor(t / 60);
    if (!rows.has(h)) rows.set(h, { hour: `${pad(h)}:00`, slots: [] });
    rows.get(h)!.slots.push({
      time: formatClock(t),
      state: i === nextIdx ? 'next' : i < nextIdx || nextIdx === -1 ? 'past' : 'upcoming',
      marker: i === 0 ? 'first' : i === times.length - 1 ? 'last' : undefined,
    });
  });
  return [...rows.values()];
}
