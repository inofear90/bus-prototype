import { Icon } from '../icons/Icon';
import { Divider } from '../primitives/Divider';
import { Text } from '../primitives/Text';
import { LineBadge } from './LineBadge';
import type { LineRef } from './types';
import s from './RouteSummary.module.css';

export interface RouteSummaryProps {
  line: LineRef;
  title: string;
  hours: string;
  frequency: string;
  priceRange: string;
  /** Shows the static "FREE" mark (decision #12: not interactive). */
  free?: boolean;
}

/** Line summary block (Figma route-title). */
export function RouteSummary({ line, title, hours, frequency, priceRange, free }: RouteSummaryProps) {
  return (
    <div className={s.block}>
      <div className={s.row}>
        <LineBadge line={line} variant="solid" />
        {free && <Icon name="free" size={24} className={s.free} label="Có hỗ trợ vé miễn phí" />}
      </div>
      <Text variant="title-lg-md" tone="primary" as="p" truncate>{title}</Text>
      <div className={s.meta}>
        <span className={s.item}>
          <Icon name="clock" size={16} />
          <Text variant="label-md-md" tone="primary">{hours}</Text>
        </span>
        <Divider orientation="vertical" length={12} />
        <Text variant="label-md-md" tone="primary">{frequency}</Text>
        <Divider orientation="vertical" length={12} />
        <Text variant="label-md-md" tone="brand">{priceRange}</Text>
      </div>
    </div>
  );
}
