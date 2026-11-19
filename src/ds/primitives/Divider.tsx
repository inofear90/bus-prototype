import { cx } from './cx';
import s from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Vertical length in px (e.g. 12 between inline values, 36 in a card). */
  length?: number;
  className?: string;
}

export function Divider({ orientation = 'horizontal', length, className }: DividerProps) {
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={cx(s.divider, s[orientation], className)}
      style={orientation === 'vertical' && length ? { height: length } : undefined}
    />
  );
}
