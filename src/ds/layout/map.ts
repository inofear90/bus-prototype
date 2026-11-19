import { useMemo, useState } from 'react';

/**
 * Contract between screens and the map. Screens only talk to this interface,
 * so the real map (next phase) can replace the placeholder without touching screens.
 */
export interface MapAdapter {
  /** Centre on a point (a station, a gate…). */
  focusPoint(id: string, label: string): void;
  /** Highlight a path (a travel direction, a fare route…). */
  highlightPath(id: string, label: string): void;
  /** Back to the default view. */
  reset(): void;
}

/** Placeholder adapter: records the last command so the prototype can show it. */
export function usePlaceholderMap() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const adapter = useMemo<MapAdapter>(() => ({
    focusPoint: (_id, label) => setLastAction(`Focus: ${label}`),
    highlightPath: (_id, label) => setLastAction(`Highlight: ${label}`),
    reset: () => setLastAction(null),
  }), []);
  return { adapter, lastAction };
}
