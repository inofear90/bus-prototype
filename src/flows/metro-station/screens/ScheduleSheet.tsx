import { useEffect, useMemo, useState } from 'react';
import { Chip, IconButton, Text, TimetableGrid } from '@ds';
import { directionInfo, type Direction, type MetroStation } from '../data/line1';
import { timetable } from '../data/schedule';
import s from './ScheduleSheet.module.css';

interface Props {
  station: MetroStation;
  direction: Direction;
  directions: Direction[];
  now: number;
  onDirectionChange: (d: Direction) => void;
  onClose: () => void;
}

/** SC-03 Lịch tàu đến ga: modal sheet over SC-02 (BR-09). */
export function ScheduleSheet({ station, direction, directions, now, onDirectionChange, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const rows = useMemo(() => timetable(station, direction, now), [station, direction, now]);
  const close = () => setClosing(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`${s.layer} ${closing ? s.closing : ''}`} onAnimationEnd={(e) => closing && e.target === e.currentTarget.lastElementChild && onClose()}>
      <button type="button" className={s.scrim} aria-label="Đóng lịch tàu" onClick={close} />
      <section className={s.sheet} role="dialog" aria-modal="true" aria-label="Lịch tàu đến ga">
        <header className={s.header}>
          <Text variant="title-xl-md" tone="primary" as="h2">Lịch tàu đến ga</Text>
          <IconButton icon="close" label="Đóng" onClick={close} />
        </header>
        <div className={s.chips} role="group" aria-label="Hướng">
          {directions.map((d) => (
            <Chip key={d} icon="arrow-right-direct" selected={d === direction} onClick={() => onDirectionChange(d)}>
              {directionInfo(d).short}
            </Chip>
          ))}
        </div>
        <TimetableGrid rows={rows} focusKey={direction} className={s.grid} />
      </section>
    </div>
  );
}
