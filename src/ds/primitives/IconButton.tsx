import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { cx } from './cx';
import s from './IconButton.module.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  /**
   * field    – surface/field square (bt.Action-mini, btn-close)
   * surface  – white pill (Nút tùy chọn "…")
   * floating – white control over the map (back, map controller)
   * ghost    – no background
   */
  variant?: 'field' | 'surface' | 'floating' | 'ghost';
  size?: 'sm' | 'md';
  shape?: 'square' | 'round';
  iconSize?: number;
}

export function IconButton({ icon, label, variant = 'field', size = 'sm', shape = 'square', iconSize, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cx(s.btn, s[variant], s[size], s[shape], className)} {...rest}>
      <Icon name={icon} size={iconSize ?? (size === 'sm' ? 20 : 24)} />
    </button>
  );
}
