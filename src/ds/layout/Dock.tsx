import type { ReactNode } from 'react';
import s from './Dock.module.css';

/** Height reserved under scrollable content so the last item clears the dock. */
export const DOCK_SPACE = 88;

/** Bottom action bar that floats over the content with a white fade (Figma "docker"). */
export function Dock({ children }: { children: ReactNode }) {
  return (
    <div className={s.dock}>
      <div className={s.slot}>{children}</div>
    </div>
  );
}
