import { Icon, Screen, Text } from '@ds';
import { FLOWS } from '../flows/registry';
import s from './FlowPicker.module.css';

/** Shown when no flow is pinned: lists every prototype flow. */
export function FlowPicker({ onPick }: { onPick: (id: string) => void }) {
  return (
    <Screen className={s.screen}>
      <div className={s.inner}>
        <Text variant="head-h4-smb" tone="emphasis" as="h1">VinBus prototypes</Text>
        <Text variant="body-md-reg" tone="secondary" as="p">Chọn luồng để trình diễn.</Text>
        <ul className={s.list}>
          {FLOWS.map((f) => (
            <li key={f.id}>
              <button type="button" className={s.card} onClick={() => onPick(f.id)}>
                <span className={s.text}>
                  <Text variant="title-lg-smb" tone="primary">{f.title}</Text>
                  <Text variant="body-sm-reg" tone="secondary">{f.description}</Text>
                  <Text variant="label-xs-md" tone="brand">?flow={f.id}</Text>
                </span>
                <Icon name="arrow-right-direct" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
