import { DeviceFrame, ToastProvider } from '@ds';
import { renderMetroStationRoute } from '../flows/metro-station';
import { Gallery } from '../gallery/Gallery';
import { FavoritesProvider } from './favorites';
import { NavigationProvider, useNavigation } from './navigation';
import s from './App.module.css';

function Stack() {
  const { stack } = useNavigation();
  // Keep the screen below mounted (state survives "back"), animate the top one in.
  return (
    <>
      {stack.map((route, i) => (
        <div key={i} className={i === 0 ? s.layer : `${s.layer} ${s.enter}`} hidden={i < stack.length - 2} aria-hidden={i !== stack.length - 1}>
          {renderMetroStationRoute(route)}
        </div>
      ))}
    </>
  );
}

export function App() {
  if (window.location.hash === '#/gallery') return <Gallery />;
  return (
    <DeviceFrame>
      <NavigationProvider>
        <FavoritesProvider>
          <ToastProvider>
            <Stack />
          </ToastProvider>
        </FavoritesProvider>
      </NavigationProvider>
    </DeviceFrame>
  );
}
