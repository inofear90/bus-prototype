import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { cx } from './cx';
import s from './Chip.module.css';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: IconName;
  children: ReactNode;
}

/** Selectable pill (32px). Selected = surface/inverse. */
export function Chip({ selected, icon, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button type={type} aria-pressed={selected} className={cx(s.chip, selected && s.selected, className)} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      <span className={cx('t-label-md-md', s.text)}>{children}</span>
    </button>
  );
}
