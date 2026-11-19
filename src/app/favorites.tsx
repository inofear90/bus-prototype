import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface Favorites { has: (id: string) => boolean; toggle: (id: string) => void }
const Ctx = createContext<Favorites>({ has: () => false, toggle: () => {} });

/** One source of truth so every heart for a station stays in sync (decision #13). */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const toggle = useCallback((id: string) => setIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  }), []);
  const value = useMemo(() => ({ has: (id: string) => ids.has(id), toggle }), [ids, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFavorites = () => useContext(Ctx);
