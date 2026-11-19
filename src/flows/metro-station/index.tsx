import type { Route } from '@app/navigation';
import { HomeScreen } from './screens/HomeScreen';
import { StationDetailScreen } from './screens/StationDetailScreen';
import { StationListScreen } from './screens/StationListScreen';

/** Maps a route of this flow to its screen. */
export function renderMetroStationRoute(route: Route) {
  switch (route.name) {
    case 'home': return <HomeScreen />;
    case 'stations': return <StationListScreen />;
    case 'station': return <StationDetailScreen stationId={route.id} />;
  }
}
