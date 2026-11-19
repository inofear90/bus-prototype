import { useMemo, useState } from 'react';
import {
  BottomSheet, Button, DirectionCard, Icon, Dock, DOCK_SPACE, GateItem, IconButton, MapSlot, RouteSummary, Screen,
  StationHeader, StationTimeline, Tabs, Text, TopBar, usePlaceholderMap, useToast,
} from '@ds';
import { useNow } from '@app/clock';
import { useFavorites } from '@app/favorites';
import { useNavigation } from '@app/navigation';
import {
  directionInfo, LINE_FREQUENCY, LINE_HOURS, LINE_PRICE_RANGE, LINE_TITLE, MRT1, stationById, stationCode, type Direction,
} from '../data/line1';
import { fare, formatVnd, stopsTowards } from '../data/fares';
import { isTerminalFor, liveDirection } from '../data/schedule';
import { ScheduleSheet } from './ScheduleSheet';
import { SHEET_SNAPS, SNAP_DEFAULT, SNAP_FULL } from './constants';
import s from './StationDetailScreen.module.css';

type TabKey = 'track' | 'gates' | 'fares';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'track', label: 'Theo dõi tàu' },
  { key: 'gates', label: 'Lối lên xuống' },
  { key: 'fares', label: 'Giá vé' },
];
const DIRECTIONS: Direction[] = ['to-first', 'to-last'];

/** SC-02 Chi tiết ga metro (main case). */
export function StationDetailScreen({ stationId }: { stationId: string }) {
  const station = stationById(stationId);
  const { back } = useNavigation();
  const favorites = useFavorites();
  const toast = useToast();
  const now = useNow();
  const { adapter: map, lastAction } = usePlaceholderMap();

  const [snap, setSnap] = useState(SNAP_DEFAULT);
  const [tab, setTab] = useState<TabKey>('track');
  const [direction, setDirection] = useState<Direction | null>(null);
  const [gate, setGate] = useState<string | null>(null);
  const [fareDir, setFareDir] = useState<Direction>('to-last');
  const [fareStop, setFareStop] = useState(station.id);
  const [schedule, setSchedule] = useState<Direction | null>(null);

  const favorite = favorites.has(station.id);
  const directions = DIRECTIONS.filter((d) => !isTerminalFor(station, d));

  /** BR-05: an item with a map response focuses the map and lowers a 90 % sheet to 55 %. */
  const focus = (run: () => void) => {
    run();
    if (snap === SNAP_FULL) setSnap(SNAP_DEFAULT);
  };

  const fareLabel = (d: Direction) => {
    const [from, to] = d === 'to-last' ? [directionInfo('to-first'), directionInfo('to-last')] : [directionInfo('to-last'), directionInfo('to-first')];
    return { from: from.terminal.name, to: to.terminal.name };
  };

  const changeTab = (next: TabKey) => {
    setTab(next);
    // Decision #7: the fare tab shows the travel direction of the fare table on the map.
    if (next === 'fares') { const l = fareLabel(fareDir); map.highlightPath(`fare-${fareDir}`, `${l.from} → ${l.to}`); }
  };
  const swipe = (dirn: 'left' | 'right') => {
    const i = TABS.findIndex((t) => t.key === tab) + (dirn === 'left' ? 1 : -1);
    if (i >= 0 && i < TABS.length) changeTab(TABS[i].key);
  };

  const stops = useMemo(() => stopsTowards(station, fareDir), [station, fareDir]);
  const fareTitle = fareLabel(fareDir);

  return (
    <Screen>
      <MapSlot lastAction={lastAction} visibleFraction={1 - SHEET_SNAPS[snap]} inactive={snap === SNAP_FULL} />
      <TopBar onBack={back} />

      <BottomSheet
        snaps={SHEET_SNAPS}
        snap={snap}
        onSnapChange={setSnap}
        footerSpace={DOCK_SPACE}
        onSwipe={swipe}
        tone={tab === 'fares' ? 'default' : 'raised'}
        aria-label={`Ga ${station.name}`}
        header={
          <>
            <StationHeader
              name={station.name}
              mode="metro"
              distance="240 m"
              address={station.address}
              favorite={favorite}
              onToggleFavorite={() => favorites.toggle(station.id)}
            />
            <Tabs items={TABS} value={tab} onChange={changeTab} aria-label="Thông tin ga" />
          </>
        }
      >
        {tab === 'track' && (
          <div role="tabpanel" aria-label="Theo dõi tàu">
            <RouteSummary line={MRT1} title={LINE_TITLE} hours={LINE_HOURS} frequency={LINE_FREQUENCY} priceRange={LINE_PRICE_RANGE} free />
            <div className={s.cards}>
              {directions.map((d) => {
                const info = directionInfo(d);
                const live = liveDirection(station, d, now);
                if (!live) return null; // after the last train: out of scope in v1
                return (
                  <DirectionCard
                    key={d}
                    towards={info.terminal.name}
                    platform={info.platform}
                    minutes={live.minutes}
                    nextTimes={live.nextTimes}
                    selected={direction === d}
                    onSelect={() => focus(() => { setDirection(d); map.highlightPath(d, `Chiều đi → ${info.terminal.name}`); })}
                    onMore={() => setSchedule(d)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {tab === 'gates' && (
          <ul role="tabpanel" aria-label="Lối lên xuống" className={s.gates}>
            {station.gates.map((g) => (
              <li key={g.id}>
                <GateItem name={g.name} streets={g.streets} selected={gate === g.id}
                  onSelect={() => focus(() => { setGate(g.id); map.focusPoint(g.id, g.name); })} />
              </li>
            ))}
          </ul>
        )}

        {tab === 'fares' && (
          <div role="tabpanel" aria-label="Giá vé">
            <div className={s.fareHead}>
              <div className={s.fareTitle}>
                <Text variant="title-xl-md" tone="emphasis">{fareTitle.from}</Text>
                <Icon name="arrow-right-direct" size={16} className={s.arrow} label="đến" />
                <Text variant="title-xl-md" tone="emphasis">{fareTitle.to}</Text>
              </div>
              <IconButton
                icon="swap-horizontal"
                label="Đảo hướng"
                size="md"
                iconSize={16}
                onClick={() => {
                  const next: Direction = fareDir === 'to-last' ? 'to-first' : 'to-last';
                  const l = fareLabel(next);
                  setFareDir(next);
                  setFareStop(station.id);
                  map.highlightPath(`fare-${next}`, `${l.from} → ${l.to}`);
                }}
              />
            </div>
            <Text variant="body-sm-md" tone="secondary" as="p" className={s.fareNote}>Giá vé tính từ ga hiện tại đến ga xuống</Text>
            <div className={s.timeline}>
              <StationTimeline
                currentId={station.id}
                selectedId={fareStop}
                onSelect={(id) => focus(() => { setFareStop(id); map.focusPoint(id, stationById(id).name); })}
                stops={stops.map((st) => ({
                  id: st.id,
                  ...stationCode(st),
                  name: st.name,
                  address: st.address,
                  value: st.id === station.id ? undefined : formatVnd(fare(station, st)),
                }))}
              />
            </div>
          </div>
        )}
      </BottomSheet>

      <Dock>
        <Button icon="route" onClick={() => toast('“Đi đến ga” thuộc tính năng Tìm lộ trình – ngoài phạm vi prototype')}>Đi đến ga</Button>
        <Button icon={favorite ? 'heart-fill' : 'heart-line'} aria-pressed={favorite} onClick={() => favorites.toggle(station.id)}>
          {favorite ? 'Đã thích' : 'Yêu thích'}
        </Button>
      </Dock>

      {schedule && (
        <ScheduleSheet station={station} direction={schedule} directions={directions} now={now}
          onDirectionChange={setSchedule} onClose={() => setSchedule(null)} />
      )}
    </Screen>
  );
}
