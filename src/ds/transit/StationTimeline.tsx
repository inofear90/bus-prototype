import { Tag } from '../primitives/Tag';
import { Text } from '../primitives/Text';
import { cx } from '../primitives/cx';
import { sheetActive } from '../layout/sheetActive';
import s from './StationTimeline.module.css';

export interface TimelineStop {
  id: string;
  /** Line prefix and number shown in the box, e.g. "L1" + "06". */
  line: string;
  number: string;
  name: string;
  address: string;
  /** Right-hand value, e.g. a fare. */
  value?: string;
}

export interface StationTimelineProps {
  stops: TimelineStop[];
  /** The station the user is at ("Ga hiện tại"). */
  currentId: string;
  /** Highlighted stop (filled box + tinted row). */
  selectedId?: string;
  onSelect?: (id: string) => void;
}

/** Vertical list of stops along a line (Figma station-metro). */
export function StationTimeline({ stops, currentId, selectedId, onSelect }: StationTimelineProps) {
  return (
    <ol className={s.list}>
      {stops.map((stop, i) => {
        const selected = stop.id === selectedId;
        const current = stop.id === currentId;
        return (
          <li key={stop.id} className={cx(s.row, selected && s.selected)} {...sheetActive(selected)}>
            <button type="button" className={s.hit} onClick={() => onSelect?.(stop.id)} aria-pressed={selected} aria-label={stop.name} />
            <span className={s.rail} aria-hidden>
              <span className={cx(s.connector, i === 0 && s.hiddenLine)} />
              <span className={cx('t-label-md-md', s.box, selected && s.boxFilled)}>
                <span>{stop.line}</span>
                <span>{stop.number}</span>
              </span>
              <span className={cx(s.connector, i === stops.length - 1 && s.hiddenLine)} />
            </span>
            <span className={s.info}>
              <Text variant="body-lg-md" tone={selected ? 'brand' : 'primary'} truncate>{stop.name}</Text>
              <Text variant="body-sm-reg" tone="secondary" truncate>{stop.address}</Text>
            </span>
            {current ? <Tag>Ga hiện tại</Tag> : stop.value && <Text variant="body-md-md" tone="primary" className={s.value}>{stop.value}</Text>}
          </li>
        );
      })}
    </ol>
  );
}
