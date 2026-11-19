import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../primitives/cx';
import s from './BottomSheet.module.css';

export interface BottomSheetProps {
  /** Snap heights as fractions of the container height, ascending. e.g. [0.3, 0.55, 0.9]. */
  snaps: number[];
  /** Index into `snaps` (controlled). */
  snap: number;
  onSnapChange: (index: number) => void;
  /** Stays visible while content scrolls (station header, tabs…). The grabber is drawn by the sheet. */
  header?: ReactNode;
  children: ReactNode;
  /** Extra bottom padding inside the scroll area, e.g. the height of a Dock overlay. */
  footerSpace?: number;
  /** Horizontal swipe on the content (used to switch tabs). */
  onSwipe?: (direction: 'left' | 'right') => void;
  /** Background of the scroll area. */
  tone?: 'default' | 'raised';
  className?: string;
  'aria-label'?: string;
}

const SNAP_EASE = 'transform 340ms cubic-bezier(0.2, 0.8, 0.2, 1)';
const INTENT_PX = 6;

/**
 * Draggable bottom sheet with snap points.
 * - Drag the header/grabber at any level.
 * - At the lowest snap the whole sheet drags (content does not scroll).
 * - At higher snaps the content scrolls; pulling down while scrolled to the top drags the sheet.
 * - Movement only touches `transform` via a ref, so React never re-renders during a drag.
 */
export function BottomSheet({
  snaps, snap, onSnapChange, header, children, footerSpace = 0, onSwipe, tone = 'raised', className, ...aria
}: BottomSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const max = snaps[snaps.length - 1];

  const translateFor = useCallback((i: number) => height * (max - snaps[i]), [height, max, snaps]);

  // Track container height.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setHeight(e.contentRect.height));
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  const apply = useCallback((y: number, animate: boolean) => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transition = animate ? SNAP_EASE : 'none';
    el.style.transform = `translate3d(0, ${y}px, 0)`;
  }, []);

  // Animate to the controlled snap.
  useLayoutEffect(() => {
    if (height) apply(translateFor(snap), true);
  }, [snap, height, apply, translateFor]);

  // ---- drag engine -------------------------------------------------------
  const drag = useRef({ active: false, startY: 0, startT: 0, lastY: 0, lastTime: 0, v: 0, raf: 0, y: 0 });

  const begin = (clientY: number) => {
    const d = drag.current;
    d.active = true;
    d.startY = d.lastY = clientY;
    d.startT = d.y = translateFor(snap);
    d.lastTime = performance.now();
    d.v = 0;
  };

  const move = (clientY: number) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastTime);
    d.v = 0.8 * ((clientY - d.lastY) / dt) + 0.2 * d.v; // px/ms, smoothed
    d.lastY = clientY;
    d.lastTime = now;
    const minT = 0;
    const maxT = translateFor(0);
    let y = d.startT + (clientY - d.startY);
    if (y < minT) y = minT - Math.sqrt(minT - y) * 4; // rubber-band past the top snap
    if (y > maxT) y = maxT + Math.sqrt(y - maxT) * 4;
    d.y = y;
    cancelAnimationFrame(d.raf);
    d.raf = requestAnimationFrame(() => apply(y, false));
  };

  const end = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const projected = d.y + d.v * 180;
    // Only move one step from where the drag started (30% → 55%, not 30% → 90%).
    const candidates = [snap - 1, snap, snap + 1].filter((i) => i >= 0 && i < snaps.length);
    const next = candidates.reduce((best, i) =>
      Math.abs(translateFor(i) - projected) < Math.abs(translateFor(best) - projected) ? i : best, snap);
    if (next === snap) apply(translateFor(snap), true);
    else onSnapChange(next);
  };

  // Header: always drags (pointer events cover mouse + touch).
  const onHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button:not([data-grabber]), a, [role="tab"]')) return;
    e.preventDefault(); // no text selection / native drag (it would cancel the pointer)
    e.currentTarget.setPointerCapture(e.pointerId);
    movedRef.current = false;
    begin(e.clientY);
  };
  const movedRef = useRef(false);
  const onHeaderPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    if (Math.abs(e.clientY - drag.current.startY) > INTENT_PX) movedRef.current = true;
    move(e.clientY);
  };

  // Content: decide between scroll, sheet drag and horizontal swipe.
  const contentScrolls = snap > 0;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let x0 = NaN, y0 = NaN, intent: 'sheet' | 'scroll' | 'swipe' | null = null;

    const start = (x: number, y: number) => { x0 = x; y0 = y; intent = null; };
    const decide = (x: number, y: number) => {
      const dx = x - x0, dy = y - y0;
      if (Math.abs(dx) < INTENT_PX && Math.abs(dy) < INTENT_PX) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.5) intent = 'swipe';
      else if (!contentScrolls || (dy > 0 && el.scrollTop <= 0)) { intent = 'sheet'; begin(y0); }
      else intent = 'scroll';
    };
    const finishSwipe = (x: number) => {
      const dx = x - x0;
      if (intent === 'swipe' && Math.abs(dx) > 48) onSwipe?.(dx < 0 ? 'left' : 'right');
    };

    const ts = (e: TouchEvent) => start(e.touches[0].clientX, e.touches[0].clientY);
    const tm = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!intent) decide(t.clientX, t.clientY);
      if (intent === 'sheet') { e.preventDefault(); move(t.clientY); }
    };
    const te = (e: TouchEvent) => { finishSwipe(e.changedTouches[0].clientX); if (intent === 'sheet') end(); intent = null; x0 = NaN; };

    // Mouse: drag the sheet at the lowest snap, swipe horizontally anywhere.
    const md = (e: PointerEvent) => { if (e.pointerType === 'mouse' && e.button === 0) start(e.clientX, e.clientY); else x0 = NaN; };
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || Number.isNaN(x0) || !(e.buttons & 1)) return;
      if (!intent) { decide(e.clientX, e.clientY); if (intent === 'scroll') intent = null; }
      if (intent === 'sheet') move(e.clientY);
    };
    const mu = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; finishSwipe(e.clientX); if (intent === 'sheet') end(); intent = null; x0 = NaN; };

    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', te);
    el.addEventListener('touchcancel', te);
    el.addEventListener('pointerdown', md);
    window.addEventListener('pointermove', mm);
    window.addEventListener('pointerup', mu);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', te);
      el.removeEventListener('touchcancel', te);
      el.removeEventListener('pointerdown', md);
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('pointerup', mu);
    };
  });

  // Keep the last item reachable: the part of the sheet below the viewport is padding.
  const hiddenBelow = height ? translateFor(snap) : 0;

  return (
    <div ref={rootRef} className={s.root}>
      <section
        ref={sheetRef}
        className={cx(s.sheet, className)}
        style={{ height: height ? height * max : `${max * 100}%` }}
        aria-label={aria['aria-label']}
      >
        <div
          className={s.header}
          onPointerDown={onHeaderPointerDown}
          onPointerMove={onHeaderPointerMove}
          onPointerUp={end}
          onPointerCancel={end}
        >
          <button
            type="button"
            data-grabber
            className={s.grabber}
            aria-label="Đổi chiều cao bảng thông tin"
            onClick={() => { if (!movedRef.current) onSnapChange(snap < snaps.length - 1 ? snap + 1 : 1); }}
          />
          {header}
        </div>
        <div
          ref={scrollRef}
          className={cx(s.content, tone === 'raised' && s.raised, !contentScrolls && s.locked)}
          style={{ paddingBottom: hiddenBelow + footerSpace }}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
