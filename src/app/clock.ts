import { useEffect, useState } from 'react';

/**
 * Simulated clock (decision O-2): the prototype always starts at 15:17 so it stays inside
 * service hours (main case), then advances in real time so countdowns move.
 * Override with ?t=HH:MM for demos.
 */
const params = new URLSearchParams(window.location.search);
const [h, m] = (params.get('t') ?? '15:17').split(':').map(Number);
const START = (h * 60 + m) * 60_000;
const BOOT = Date.now();

/** Minutes after midnight (fractional). */
export const nowMinutes = () => (START + (Date.now() - BOOT)) / 60_000;

/** Re-renders every `everyMs` with the current simulated time. */
export function useNow(everyMs = 5000) {
  const [now, setNow] = useState(nowMinutes);
  useEffect(() => {
    const id = window.setInterval(() => setNow(nowMinutes()), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}
