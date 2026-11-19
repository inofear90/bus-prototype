import { useState } from 'react';
import { BottomSheet, Button, Icon, MapSlot, Screen, StationListCard, Text, TopBar, usePlaceholderMap, useToast } from '@ds';
import { useFavorites } from '@app/favorites';
import { useNavigation } from '@app/navigation';
import { NEARBY } from '../data/nearby';
import { SHEET_SNAPS, SNAP_DEFAULT, SNAP_FULL } from './constants';
import s from './StationListScreen.module.css';

const OUT_OF_SCOPE_ROUTE = 'Chỉ đường thuộc tính năng Tìm lộ trình – ngoài phạm vi prototype';

/** SC-01 Danh sách trạm/ga. Every card is selectable; only the metro station opens a detail page in v1. */
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
                  setSelected(stop.id);
                  adapter.focusPoint(stop.id, stop.name);
                  if (snap === SNAP_FULL) setSnap(SNAP_DEFAULT);
                }}
                actions={
                  stop.metroStationId ? (
                    <>
                      <Button variant="primary" size="sm" icon="route" onClick={() => toast(OUT_OF_SCOPE_ROUTE)}>Đi đến ga</Button>
                      <Button size="sm" onClick={() => push({ name: 'station', id: stop.metroStationId! })}>Xem chi tiết</Button>
                    </>
                  ) : (
                    // Bus stops: selectable, but their detail and routing are out of scope in v1.
                    <>
                      <Button variant="primary" size="sm" icon="route" onClick={() => toast(OUT_OF_SCOPE_ROUTE)}>Đi đến trạm</Button>
                      <Button size="sm" onClick={() => toast('Chi tiết trạm xe bus nằm ngoài phạm vi prototype')}>Xem chi tiết</Button>
                    </>
                  )
                }
              />
            </li>
          ))}
        </ul>
      </BottomSheet>
    </Screen>
  );
}
