import type { ReactNode } from 'react';
import { cx } from './cx';
import s from './Tag.module.css';

export interface TagProps {
  /** neutral = badge/neutral; success = feedback/success/strong; info = feedback/info/subtle. */
  tone?: 'neutral' | 'success' | 'info';
  className?: string;
  children: ReactNode;
}

/** Small status label (label/SM). */
export function Tag({ tone = 'neutral', className, children }: TagProps) {
  return <span className={cx('t-label-sm-reg', s.tag, s[tone], className)}>{children}</span>;
}
