import type { CSSProperties } from 'react';
import { icons, type IconName } from './icons.generated';

export type { IconName };

export interface IconProps {
  name: IconName;
  /** Pixel size; design uses 16, 20 and 24. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Decorative by default. Pass a label when the icon carries meaning on its own. */
  label?: string;
}

/** Renders an icon from the pack. Single-colour icons follow CSS `color`. */
export function Icon({ name, size = 24, className, style, label }: IconProps) {
  const icon = icons[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      className={className}
      style={{ flexShrink: 0, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
