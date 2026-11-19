import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { cx } from './cx';
import s from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = action/primary/bg; secondary = surface/field (Figma "button" role secondary). */
  variant?: 'primary' | 'secondary';
  /** sm = 32px (label MD), md = 40px (label LG). */
  size?: 'sm' | 'md';
  icon?: IconName;
  children: ReactNode;
}

/** Pill button. */
export function Button({ variant = 'secondary', size = 'md', icon, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx(s.button, s[variant], s[size], className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 20 : 24} />}
      <span className={size === 'sm' ? 't-label-md-md' : 't-label-lg-md'}>{children}</span>
    </button>
  );
}
