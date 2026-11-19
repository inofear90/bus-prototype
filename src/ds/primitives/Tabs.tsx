import { cx } from './cx';
import s from './Tabs.module.css';

export interface TabItem<K extends string> { key: K; label: string }

export interface TabsProps<K extends string> {
  items: TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  className?: string;
  'aria-label'?: string;
}

/** Underline tabs (Figma nav-tab, 40px). */
export function Tabs<K extends string>({ items, value, onChange, className, ...rest }: TabsProps<K>) {
  return (
    <div role="tablist" className={cx(s.tabs, className)} aria-label={rest['aria-label']}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            role="tab"
            type="button"
            aria-selected={active}
            className={cx('t-label-md-md', s.tab, active && s.active)}
            onClick={() => onChange(it.key)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
