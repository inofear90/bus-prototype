import type { FlowDefinition } from '@app/flow';
import { HomeScreen } from './screens/HomeScreen';
import { StationDetailScreen } from './screens/StationDetailScreen';
import { StationListScreen } from './screens/StationListScreen';

/** Tra cứu trạm → Chi tiết ga metro (v1, main case). */
export const metroStationFlow: FlowDefinition = {
  id: 'metro-station',
  title: 'Chi tiết ga metro',
  description: 'Home → Tra cứu trạm → Chi tiết ga (Theo dõi tàu, Lối lên xuống, Giá vé) → Lịch tàu',
  initialRoute: { name: 'home' },
  render: (route) => {
    switch (route.name) {
      case 'home': return <HomeScreen />;
      case 'stations': return <StationListScreen />;
      case 'station': return <StationDetailScreen stationId={route.params!.id} />;
      default: return null;
    }
  },
};
