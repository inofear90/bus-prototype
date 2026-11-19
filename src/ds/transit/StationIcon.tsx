import { Icon } from '../icons/Icon';
import type { TransitMode } from './types';

/** Round station glyph coloured by mode (Figma "Station-map"). */
export function StationIcon({ mode, size = 24 }: { mode: TransitMode; size?: number }) {
  const color = mode === 'metro' ? 'var(--transit-line-mrt1)' : 'var(--transit-line-bus)';
  return <Icon name={mode} size={size} style={{ color }} />;
}
