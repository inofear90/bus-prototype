import type { ReactNode } from 'react';
import { IconButton } from '../primitives/IconButton';
import { Text } from '../primitives/Text';
import { cx } from '../primitives/cx';
import { LineBadge } from './LineBadge';
import { StationIcon } from './StationIcon';
import type { LineRef, TransitMode } from './types';
import s from './StationListCard.module.css';

export interface StationListCardProps {
  name: string;
  mode: TransitMode;
  distance: string;
  walkTime: string;
  address: string;
  lines: LineRef[];
  selected?: boolean;
  favorite?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
  /** Shown under the lines when selected (e.g. "Đi đến ga", "Xem chi tiết"). */
  actions?: ReactNode;
}

/** Nearby station card (Figma list-station-card). */
export function StationListCard({
  name, mode, distance, walkTime, address, lines, selected, favorite, onSelect, onToggleFavorite, actions,
}: StationListCardProps) {
  return (
    <article className={cx(s.card, selected && s.selected)}>
      <button type="button" className={s.hit} onClick={onSelect} aria-expanded={selected} aria-label={name} />
      <div className={s.top}>
        <StationIcon mode={mode} size={24} />
        <div className={s.info}>
          <Text variant="title-lg-smb" tone="primary" as="h3" truncate>{name}</Text>
          <div className={s.meta}>
            <Text variant="label-md-md" tone="primary">{distance}</Text>
            <span className={s.dot} aria-hidden />
            <Text variant="body-md-reg" tone="secondary">{walkTime}</Text>
          </div>
          <Text variant="body-md-reg" tone="secondary" truncate>{address}</Text>
        </div>
      </div>
      <div className={s.lines}>
        {lines.map((l) => <LineBadge key={l.id} line={l} />)}
      </div>
      {selected && actions && <div className={s.actions}>{actions}</div>}
      <IconButton
        className={s.fav}
        icon={favorite ? 'heart-fill' : 'heart-line'}
        label={favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        aria-pressed={favorite}
        variant="ghost"
        onClick={onToggleFavorite}
      />
    </article>
  );
}
