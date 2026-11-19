import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import s from './Toast.module.css';

const ToastCtx = createContext<(message: string) => void>(() => {});

/** Wrap the app once; call useToast()(message) anywhere. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>();
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2400);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={s.host} aria-live="polite">
        {msg && <div className={`t-body-md-md ${s.toast}`} key={msg}>{msg}</div>}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
