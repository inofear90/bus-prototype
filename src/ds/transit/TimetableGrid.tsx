import { useLayoutEffect, useRef } from 'react';
import { Text } from '../primitives/Text';
import { cx } from '../primitives/cx';
import s from './TimetableGrid.module.css';

export type SlotMarker = 'first' | 'last';

export interface TimetableSlot {
  time: string;
  /** past = already left (dimmed); next = the coming departure (highlighted). */
  state: 'past' | 'upcoming' | 'next';
  marker?: SlotMarker;
}

export interface TimetableRow {
  hour: string;
  slots: TimetableSlot[];
}

export interface TimetableGridProps {
  rows: TimetableRow[];
  /** Changes when the data set changes (e.g. direction); the grid then re-focuses the next departure. */
  focusKey?: string;
  className?: string;
}

const MARKER_LABEL: Record<SlotMarker, string> = { first: 'Chuyến đầu', last: 'Chuyến cuối' };

/** Hour-by-hour departures, 4 per line (Figma timetable). Scrolls itself to the next departure. */
export function TimetableGrid({ rows, focusKey, className }: TimetableGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = scrollRef.current, row = nextRowRef.current;
    if (box && row) box.scrollTop = row.offsetTop;
  }, [focusKey]);

  return (
    <div ref={scrollRef} className={cx(s.scroll, className)}>
      {rows.map((row) => {
        const hasNext = row.slots.some((x) => x.state === 'next');
        const allPast = row.slots.every((x) => x.state === 'past');
        return (
          <div key={row.hour} ref={hasNext ? nextRowRef : undefined} className={s.row}>
            <Text variant="title-xl-md" tone={allPast ? 'disabled' : 'primary'} className={s.hour}>{row.hour}</Text>
            <span className={s.rule} aria-hidden />
            <div className={s.cells}>
              {row.slots.map((slot) => {
                const label = slot.state === 'next' ? (slot.marker ? MARKER_LABEL[slot.marker] : 'Tiếp theo') : slot.marker && MARKER_LABEL[slot.marker];
                return (
                  <div key={slot.time} className={cx(s.cell, slot.state === 'next' && s.next)} aria-current={slot.state === 'next' ? 'time' : undefined}>
                    <Text variant="label-md-md" tone={slot.state === 'past' ? 'disabled' : 'primary'}>{slot.time}</Text>
                    {label && <Text variant="label-xs-md" tone={slot.state === 'next' ? 'success' : 'info'}>{label}</Text>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
