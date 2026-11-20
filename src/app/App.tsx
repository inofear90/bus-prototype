import { cx, DeviceFrame, ToastProvider } from '@ds';
import { useState } from 'react';
import type { FlowDefinition } from './flow';
import { FlowPicker } from './FlowPicker';
import { startFlowId } from './startFlow';
import { FLOWS } from '../flows/registry';
import { Gallery } from '../gallery/Gallery';
import { FavoritesProvider } from './favorites';
import { NavigationProvider, useNavigation } from './navigation';
import s from './App.module.css';

function Stack({ flow }: { flow: FlowDefinition }) {
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
            {flow.render(route)}
          </div>
        );
      })}
    </>
  );
}

export function App() {
  const [flowId, setFlowId] = useState(startFlowId);
  if (window.location.hash === '#/gallery') return <Gallery />;
  const flow = FLOWS.find((f) => f.id === flowId);
  return (
    <DeviceFrame>
      {flow ? (
        // Only the chosen flow is mounted – other flows never show up in a presentation.
        <NavigationProvider key={flow.id} initial={flow.initialRoute}>
          <FavoritesProvider>
            <ToastProvider>
              <Stack flow={flow} />
            </ToastProvider>
          </FavoritesProvider>
        </NavigationProvider>
      ) : (
        <FlowPicker onPick={setFlowId} />
      )}
    </DeviceFrame>
  );
}
