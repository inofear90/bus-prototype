import { IconButton } from '../primitives/IconButton';
import { Text } from '../primitives/Text';
import { StationIcon } from './StationIcon';
import type { TransitMode } from './types';
import s from './StationHeader.module.css';

export interface StationHeaderProps {
  name: string;
  mode: TransitMode;
  distance: string;
  address: string;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}

/** Sheet header of a station detail: icon, name, distance • address, favourite. */
export function StationHeader({ name, mode, distance, address, favorite, onToggleFavorite }: StationHeaderProps) {
  return (
    <div className={s.header}>
      <StationIcon mode={mode} size={32} />
      <div className={s.info}>
        <Text variant="title-xl-md" tone="primary" as="h2" truncate>{name}</Text>
        <div className={s.meta}>
          <Text variant="body-sm-reg" tone="secondary">{distance}</Text>
          <span className={s.dot} aria-hidden />
          <Text variant="body-sm-reg" tone="secondary" truncate>{address}</Text>
        </div>
      </div>
      <IconButton
        icon={favorite ? 'heart-fill' : 'heart-line'}
        label={favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
      />
    </div>
  );
}
