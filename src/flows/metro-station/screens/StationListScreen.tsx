import { useState } from 'react';
import { BottomSheet, Button, Icon, MapSlot, Screen, StationListCard, Text, TopBar, usePlaceholderMap, useToast } from '@ds';
import { useFavorites } from '@app/favorites';
import { useNavigation } from '@app/navigation';
import { NEARBY } from '../data/nearby';
import { SHEET_SNAPS, SNAP_DEFAULT, SNAP_FULL } from './constants';
import s from './StationListScreen.module.css';

/** SC-01 Danh sách trạm/ga. Only the metro station is selectable in v1. */
export function StationListScreen() {
  const { push, back } = useNavigation();
  const favorites = useFavorites();
  const toast = useToast();
  const { adapter, lastAction } = usePlaceholderMap();
  const [snap, setSnap] = useState(SNAP_DEFAULT);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen>
      <MapSlot lastAction={lastAction} visibleFraction={1 - SHEET_SNAPS[snap]} inactive={snap === SNAP_FULL} />
      <TopBar onBack={back}>
        <div className={s.location}>
          <Icon name="pin-location" size={20} style={{ color: 'var(--transit-gate)' }} />
          <Text variant="label-md-md" tone="primary" truncate>Vị trí của bạn - TTTM Vincom Cổng Lý Tự Trọng</Text>
        </div>
      </TopBar>
      <BottomSheet
        snaps={SHEET_SNAPS}
        snap={snap}
        onSnapChange={setSnap}
        aria-label="Các trạm gần đây"
        header={<Text variant="title-xl-md" tone="primary" as="h2" className={s.title}>Các trạm gần đây</Text>}
      >
        <ul className={s.list}>
          {NEARBY.map((stop) => (
            <li key={stop.id}>
              <StationListCard
                name={stop.name}
                mode={stop.mode}
                distance={stop.distance}
                walkTime={stop.walkTime}
                address={stop.address}
                lines={stop.lines}
                selected={selected === stop.id}
                favorite={favorites.has(stop.metroStationId ?? stop.id)}
                onToggleFavorite={() => favorites.toggle(stop.metroStationId ?? stop.id)}
                onSelect={() => {
                  if (!stop.metroStationId) return; // bus stops: out of scope (decision O-3)
                  setSelected(stop.id);
                  adapter.focusPoint(stop.id, stop.name);
                  if (snap === SNAP_FULL) setSnap(SNAP_DEFAULT);
                }}
                actions={
                  <>
                    <Button variant="primary" size="sm" icon="route" onClick={() => toast('“Đi đến ga” thuộc tính năng Tìm lộ trình – ngoài phạm vi prototype')}>Đi đến ga</Button>
                    <Button size="sm" onClick={() => push({ name: 'station', id: stop.metroStationId! })}>Xem chi tiết</Button>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      </BottomSheet>
    </Screen>
  );
}
