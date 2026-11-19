import { Icon } from '../icons/Icon';
import { Divider } from '../primitives/Divider';
import { IconButton } from '../primitives/IconButton';
import { Text } from '../primitives/Text';
import { cx } from '../primitives/cx';
import s from './DirectionCard.module.css';

export interface DirectionCardProps {
  /** Terminal the train is heading to ("→ Bến Thành"). */
  towards: string;
  /** Where to wait ("Ke ga 1"). */
  platform: string;
  /** Minutes until the next train (main case: 1–59). */
  minutes: number;
  /** Following departures, e.g. ["15:20", "15:28", "15:34"]; the first is highlighted. */
  nextTimes: string[];
  selected?: boolean;
  onSelect?: () => void;
  onMore?: () => void;
}

/** Live direction card (Figma card-metro-route, state "Thời gian chờ tàu < 60 phút"). */
export function DirectionCard({ towards, platform, minutes, nextTimes, selected, onSelect, onMore }: DirectionCardProps) {
  return (
    <article className={cx(s.card, selected && s.selected)}>
      <button type="button" className={s.hit} onClick={onSelect} aria-pressed={selected} aria-label={`Hướng ${towards}`} />
      <header className={s.head}>
        <span className={s.towards}>
          <Icon name="arrow-right-direct" size={16} />
          <Text variant="title-xl-md" tone="primary" truncate>{towards}</Text>
        </span>
        <Text variant="label-md-md" tone="primary" className={s.platform}>
          Chỗ đợi tàu <span className="t-label-md-smb">{platform}</span>
        </Text>
      </header>
      <div className={s.body}>
        <div className={s.eta} aria-label={`${minutes} phút nữa tàu đến`}>
          <span className={s.minutes}>{minutes}</span>
          <span className={s.unit}>
            <Text variant="label-lg-md" tone="primary">phút</Text>
            <Text variant="label-sm-md" tone="primary" className={s.sub}>tàu đến</Text>
          </span>
        </div>
        <Divider orientation="vertical" length={36} />
        <div className={s.next}>
          <Text variant="label-sm-md" tone="primary">Chuyến kế tiếp</Text>
          <div className={s.times}>
            {nextTimes.map((t, i) => (
              <span key={t} className={s.timeItem}>
                {i > 0 && <Divider orientation="vertical" length={12} />}
                <Text variant="label-md-smb" tone={i === 0 ? 'success' : 'primary'}>{t}</Text>
              </span>
            ))}
          </div>
        </div>
        <IconButton icon="more" label={`Lịch tàu hướng ${towards}`} variant="surface" shape="round" iconSize={16} className={s.more} onClick={onMore} />
      </div>
    </article>
  );
}
