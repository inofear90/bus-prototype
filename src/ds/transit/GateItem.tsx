import { Icon } from '../icons/Icon';
import { Text } from '../primitives/Text';
import { cx } from '../primitives/cx';
import s from './GateItem.module.css';

export interface GateItemProps {
  name: string;
  streets: string;
  selected?: boolean;
  onSelect?: () => void;
}

/** Station entrance/exit (Figma WF-Card-metro in tab "Lối lên xuống"). */
export function GateItem({ name, streets, selected, onSelect }: GateItemProps) {
  return (
    <button type="button" className={cx(s.card, selected && s.selected)} onClick={onSelect} aria-pressed={selected}>
      <span className={s.icon}><Icon name="pin-gate" size={24} /></span>
      <span className={s.text}>
        <Text variant="label-md-md" tone={selected ? 'brand' : 'primary'}>{name}</Text>
        <Text variant="body-sm-reg" tone="primary">{streets}</Text>
      </span>
    </button>
  );
}
