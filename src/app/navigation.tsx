import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/** A screen inside a flow. Flows choose their own route names and params. */
export interface Route {
  name: string;
  params?: Record<string, string>;
}

interface Nav {
  stack: Route[];
  /** True while the top screen plays its exit animation (after back). */
  leaving: boolean;
  push: (r: Route) => void;
  back: () => void;
  /** Called by the stack view when the exit animation has finished. */
  finishBack: () => void;
}
const Ctx = createContext<Nav>({ stack: [], leaving: false, push: () => {}, back: () => {}, finishBack: () => {} });

/** Minimal stack navigator wired to browser history (hardware/browser back works and animates too). */
export function NavigationProvider({ initial, children }: { initial: Route; children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([initial]);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onPop = () => setLeaving(true);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const push = useCallback((r: Route) => {
    window.history.pushState({ depth: Date.now() }, '');
    setStack((s) => [...s, r]);
  }, []);
  const back = useCallback(() => window.history.back(), []);
  const finishBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    setLeaving(false);
  }, []);

  return <Ctx.Provider value={{ stack, leaving: leaving && stack.length > 1, push, back, finishBack }}>{children}</Ctx.Provider>;
}

export const useNavigation = () => useContext(Ctx);
