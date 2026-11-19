import { IconButton } from '../primitives/IconButton';
import { cx } from '../primitives/cx';
import s from './MapSlot.module.css';

export interface MapSlotProps {
  /** Last command received through MapAdapter, shown on the placeholder. */
  lastAction?: string | null;
  /** Fraction of the screen the map is visible in (used to keep controls above the sheet). */
  visibleFraction: number;
  /** Sheet is at its top snap: map is only a background (controls hidden; the sheet draws the backdrop). */
  inactive?: boolean;
}

/** Map placeholder + map controllers. The real map plugs in here in a later phase. */
export function MapSlot({ lastAction, visibleFraction, inactive }: MapSlotProps) {
  return (
    <div className={s.map} aria-label="Bản đồ (placeholder)">
      <div className={s.grid} />
      <div className={s.label} style={{ top: `${(visibleFraction * 100) / 2}%` }}>
        <span className="t-label-sm-md">Bản đồ – tích hợp ở phase sau</span>
        {lastAction && <span className={cx('t-label-sm-reg', s.action)} key={lastAction}>{lastAction}</span>}
      </div>
      <div
        className={cx(s.controls, inactive && s.hidden)}
        style={{ bottom: `calc(${100 - visibleFraction * 100}% + 12px)` }}
      >
        <IconButton icon="my-location" label="Vị trí của tôi" variant="floating" size="md" shape="round" iconSize={20} />
        <IconButton icon="compass" label="La bàn" variant="floating" size="md" shape="round" iconSize={20} />
      </div>
    </div>
  );
}
