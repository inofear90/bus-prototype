import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'stations' }
  | { name: 'station'; id: string };

interface Nav { stack: Route[]; push: (r: Route) => void; back: () => void }
const Ctx = createContext<Nav>({ stack: [{ name: 'home' }], push: () => {}, back: () => {} });

/** Minimal stack navigator wired to browser history (hardware/browser back works). */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  useEffect(() => {
    const onPop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const push = useCallback((r: Route) => {
    window.history.pushState({ depth: Date.now() }, '');
    setStack((s) => [...s, r]);
  }, []);
  const back = useCallback(() => window.history.back(), []);

  return <Ctx.Provider value={{ stack, push, back }}>{children}</Ctx.Provider>;
}

export const useNavigation = () => useContext(Ctx);
