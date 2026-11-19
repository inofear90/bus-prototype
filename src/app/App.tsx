import { cx, DeviceFrame, ToastProvider } from '@ds';
import { renderMetroStationRoute } from '../flows/metro-station';
import { Gallery } from '../gallery/Gallery';
import { FavoritesProvider } from './favorites';
import { NavigationProvider, useNavigation } from './navigation';
import s from './App.module.css';

function Stack() {
  const { stack, leaving, finishBack } = useNavigation();
  const top = stack.length - 1;
  // Keep the screen below mounted (its state survives "back").
  // Push: top slides in from the right while the one below shifts left.
  // Back: the reverse – top slides out to the right, the one below slides back.
  return (
    <>
      {stack.map((route, i) => {
        const isTop = i === top && i > 0;
        const isBelow = i === top - 1;
        // `enter` stays on every pushed layer: its animation only plays once, on mount (fill-mode: backwards).
        const cls = cx(s.layer, i > 0 && s.enter, isTop && leaving && s.exit, isBelow && !leaving && s.below);
        return (
          <div
            key={i}
            className={cls}
            hidden={i < top - 1}
            aria-hidden={i !== top}
            onAnimationEnd={isTop && leaving ? (e) => e.target === e.currentTarget && finishBack() : undefined}
          >
            {renderMetroStationRoute(route)}
          </div>
        );
      })}
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
