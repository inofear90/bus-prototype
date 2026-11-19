import type { ReactNode } from 'react';
import { cx } from '../primitives/cx';
import s from './Screen.module.css';

/** Full-screen container. Children are absolutely layered (map, sheet, top bar, dock). */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(s.screen, className)}>{children}</div>;
}

/**
 * Device frame: full viewport on phones, a 375×812 phone on larger screens.
 * Shows a mock status bar only inside the desktop frame (real phones have their own).
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className={s.stage}>
      <div className={s.device}>
        <div className={cx('t-label-md-smb', s.statusBar)} aria-hidden>
          <span>12:15</span>
          <span className={s.statusIcons}>
            <i /> <i /> <i />
          </span>
        </div>
        <div className={s.viewport}>{children}</div>
      </div>
    </div>
  );
}
