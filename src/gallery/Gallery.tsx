import { useState, type ReactNode } from 'react';
import {
  Button, Chip, DirectionCard, Divider, GateItem, Icon, IconButton, LineBadge, RouteSummary, StationHeader,
  StationListCard, StationTimeline, Tabs, Tag, Text, TimetableGrid, type IconName, type TextVariant,
} from '@ds';
import { icons } from '@ds/icons/icons.generated';
import s from './Gallery.module.css';

const COLORS = [
  'text-primary', 'text-secondary', 'text-disabled', 'text-brand', 'surface-default', 'surface-raised', 'surface-selected',
  'surface-field', 'surface-inverse', 'border-default', 'border-subtle', 'border-selected', 'action-primary-bg',
  'feedback-success-text', 'feedback-success-subtle', 'feedback-info-strong', 'badge-neutral-bg', 'transit-gate', 'transit-line-mrt1',
];
const TYPE: TextVariant[] = ['head-h4-smb', 'title-xl-md', 'title-lg-smb', 'label-lg-md', 'label-md-smb', 'label-md-md', 'body-lg-md', 'body-md-reg', 'body-sm-reg', 'label-sm-md', 'label-xs-md', 'support-sm-reg'];
const ELEVATION = ['base', 'lowest', 'low', 'mid', 'high', 'highest'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={s.section}>
      <Text variant="title-lg-smb" tone="emphasis" as="h2">{title}</Text>
      <div className={s.body}>{children}</div>
    </section>
  );
}

/** Living catalogue of the design-system library (#/gallery). */
export function Gallery() {
  const [tab, setTab] = useState<'a' | 'b' | 'c'>('a');
  const [sel, setSel] = useState(false);
  const metro = { id: 'mrt1', label: 'MRT1', mode: 'metro' } as const;
  const bus = { id: '60-3', label: '60-3', mode: 'bus' } as const;

  return (
    <main className={s.page}>
      <Text variant="head-h4-smb" tone="emphasis" as="h1">VinBus UI library</Text>
      <Text variant="body-md-reg" tone="secondary" as="p">Tokens are generated from design-tokens/figma-variables.json. Back to the <a href="./">prototype</a>.</Text>

      <Section title="Colour (semantic)">
        <div className={s.swatches}>
          {COLORS.map((c) => (
            <div key={c} className={s.swatch}>
              <span style={{ background: `var(--${c})` }} />
              <Text variant="label-xs-md" tone="secondary">--{c}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        {TYPE.map((v) => <Text key={v} variant={v} tone="primary" as="p">{v} – Ga Thảo Điền 15:20</Text>)}
      </Section>

      <Section title="Elevation">
        <div className={s.row}>
          {ELEVATION.map((e) => <div key={e} className={s.elev} style={{ boxShadow: `var(--elevation-${e})` }}><Text variant="label-sm-md">{e}</Text></div>)}
        </div>
      </Section>

      <Section title="Icons">
        <div className={s.row}>
          {(Object.keys(icons) as IconName[]).map((n) => (
            <div key={n} className={s.icon}><Icon name={n} size={24} /><Text variant="label-xs-md" tone="secondary">{n}</Text></div>
          ))}
        </div>
      </Section>

      <Section title="Controls">
        <div className={s.row}>
          <Button variant="primary" size="sm" icon="route">Đi đến ga</Button>
          <Button size="sm">Xem chi tiết</Button>
          <Button icon="heart-line">Yêu thích</Button>
          <IconButton icon="heart-line" label="Yêu thích" />
          <IconButton icon="close" label="Đóng" />
          <IconButton icon="more" label="Thêm" variant="surface" shape="round" iconSize={16} />
          <IconButton icon="arrow-left" label="Quay lại" variant="floating" size="md" />
        </div>
        <div className={s.row}>
          <Chip icon="arrow-right-direct" selected={!sel} onClick={() => setSel(false)}>Bến Thành</Chip>
          <Chip icon="arrow-right-direct" selected={sel} onClick={() => setSel(true)}>BX Suối Tiên</Chip>
          <Tag>Ga hiện tại</Tag><Tag tone="success">Tàu sắp đến</Tag><Tag tone="info">Chuyến cuối</Tag>
          <LineBadge line={metro} variant="solid" /><LineBadge line={metro} /><LineBadge line={bus} />
        </div>
        <Tabs items={[{ key: 'a', label: 'Theo dõi tàu' }, { key: 'b', label: 'Lối lên xuống' }, { key: 'c', label: 'Giá vé' }]} value={tab} onChange={setTab} />
        <Divider />
      </Section>

      <Section title="Transit">
        <div className={s.phone}>
          <StationHeader name="Thảo Điền" mode="metro" distance="240 m" address="Xa lộ Hà Nội, Phường An Khánh" />
          <RouteSummary line={metro} title="Metro số 1 Bến Thành - Suối Tiên" hours="05:00 - 22:30" frequency="8 phút/chuyến" priceRange="7.000-30.000đ" free />
          <div className={s.pad}>
            <DirectionCard towards="Bến Thành" platform="Ke ga 1" minutes={3} nextTimes={['15:20', '15:28', '15:36']} />
            <DirectionCard towards="Bến Xe Suối Tiên" platform="Ke ga 2" minutes={5} nextTimes={['15:22', '15:30', '15:38']} selected />
            <StationListCard name="Thảo Điền" mode="metro" distance="240m" walkTime="4 phút đi bộ" address="Xa lộ Hà Nội" lines={[metro]} selected
              actions={<><Button variant="primary" size="sm" icon="route">Đi đến ga</Button><Button size="sm">Xem chi tiết</Button></>} />
            <StationListCard name="Trạm Tuy Hòa" mode="bus" distance="180m" walkTime="3 phút đi bộ" address="101 Hai Bà Trưng" lines={[bus, { ...bus, id: '27', label: '27' }]} />
            <GateItem name="Cửa 1" streets="Xa lộ Hà Nội, phía Thảo Điền" />
            <GateItem name="Cửa 2" streets="Đường Nguyễn Văn Hưởng" selected />
            <StationTimeline currentId="6" selectedId="6" stops={[
              { id: '6', line: 'L1', number: '06', name: 'Thảo Điền', address: 'Xa lộ Hà Nội' },
              { id: '7', line: 'L1', number: '07', name: 'An Phú', address: 'Xa lộ Hà Nội', value: '7.000 đ' },
              { id: '8', line: 'L1', number: '08', name: 'Rạch Chiếc', address: 'Xa lộ Hà Nội', value: '7.000 đ' },
            ]} />
            <TimetableGrid rows={[
              { hour: '06:00', slots: [{ time: '06:04', state: 'past' }, { time: '06:12', state: 'past' }, { time: '06:20', state: 'next' }, { time: '06:28', state: 'upcoming' }] },
              { hour: '22:00', slots: [{ time: '22:04', state: 'upcoming' }, { time: '22:12', state: 'upcoming', marker: 'last' }] },
            ]} />
          </div>
        </div>
      </Section>
    </main>
  );
}
