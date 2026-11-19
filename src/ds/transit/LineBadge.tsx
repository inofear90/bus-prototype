import { Icon } from '../icons/Icon';
import { cx } from '../primitives/cx';
import type { LineRef } from './types';
import s from './LineBadge.module.css';

export interface LineBadgeProps {
  line: LineRef;
  /** solid = filled with the mode colour + icon (route-title); outline = route-label in lists. */
  variant?: 'solid' | 'outline';
  className?: string;
}

export function LineBadge({ line, variant = 'outline', className }: LineBadgeProps) {
  return (
    <span className={cx(s.badge, s[variant], s[line.mode], className)}>
      {variant === 'solid' && <Icon name={line.mode} size={16} />}
      <span className={variant === 'solid' ? 't-label-lg-md' : 't-label-md-md'}>{line.label}</span>
    </span>
  );
}
