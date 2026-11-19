import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import s from './Text.module.css';

/** Typography styles from [GTCC] Foundation, e.g. "label-md-smb" = Figma "label/MD Smb". */
export type TextVariant =
  | `head-${'h3' | 'h4'}-${'smb' | 'md'}`
  | `title-${'xl' | 'lg'}-${'smb' | 'md'}`
  | `label-${'lg' | 'md' | 'sm' | 'xs'}-${'smb' | 'md' | 'reg'}`
  | `body-${'lg' | 'md' | 'sm'}-${'smb' | 'md' | 'reg'}`
  | `support-${'sm' | 'xs'}-${'md' | 'reg'}`;

export type TextTone =
  | 'primary' | 'secondary' | 'disabled' | 'brand' | 'emphasis'
  | 'success' | 'info' | 'on-brand' | 'on-inverse' | 'inherit';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  tone?: TextTone;
  as?: ElementType;
  /** Single line with ellipsis. */
  truncate?: boolean;
  children?: ReactNode;
}

export function Text({ variant, tone = 'inherit', as: Tag = 'span', truncate, className, ...rest }: TextProps) {
  return <Tag className={cx(`t-${variant}`, s[tone], truncate && s.truncate, className)} {...rest} />;
}
