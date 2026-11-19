import type { ReactNode } from 'react';
import { IconButton } from '../primitives/IconButton';
import s from './TopBar.module.css';

export interface TopBarProps {
  onBack?: () => void;
  backLabel?: string;
  /** Content next to the back button (e.g. a location field). */
  children?: ReactNode;
}

/** Overlay top bar for map screens: floating back button + optional field. */
export function TopBar({ onBack, backLabel = 'Quay lại', children }: TopBarProps) {
  return (
    <div className={s.bar}>
      {onBack && <IconButton icon="arrow-left" label={backLabel} variant="floating" size="md" onClick={onBack} iconSize={24} />}
      {children && <div className={s.slot}>{children}</div>}
    </div>
  );
}
