"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const noop = () => () => {};

function useViewportHeight() {
  return React.useSyncExternalStore(
    (notify) => {
      window.addEventListener("resize", notify);
      return () => window.removeEventListener("resize", notify);
    },
    () => window.innerHeight,
    () => 800,
  );
}

const SPRING = "0.5s cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * A bottom sheet for touch: drag it between snap points, fling it down to dismiss, tap the handle to step through.
 *
 * It rubber-bands past its top, traps focus, locks page scroll and closes on Escape.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  snapPoints = [0.5, 0.92],
  defaultSnap = 0,
  dismissible = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  /** How much of the screen the drawer shows at each stop, from 0 to 1, smallest first. */
  snapPoints?: number[];
  /** Which snap point it opens at, as an index into `snapPoints`. */
  defaultSnap?: number;
  /** Allow dragging down past the lowest stop (or Escape, or the backdrop) to close. */
  dismissible?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isOpen = open ?? uncontrolled;
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const vh = useViewportHeight();
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const stops = React.useMemo(() => [...snapPoints].sort((a, b) => a - b), [snapPoints]);
  const H = vh * stops[stops.length - 1];
  const yFor = (i: number) => H - vh * stops[i];

  const [present, setPresent] = React.useState(isOpen);
  const [entered, setEntered] = React.useState(false);
  const [snap, setSnap] = React.useState(defaultSnap);
  const [wasOpen, setWasOpen] = React.useState(false);
  const [dy, setDy] = React.useState<number | null>(null);
  const gesture = React.useRef<{ y: number; base: number; last: { t: number; y: number }[] } | null>(null);

  // Mount on open, then flip `entered` a frame later so the slide-in animates.
  if (isOpen && !present) setPresent(true);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSnap(Math.min(defaultSnap, stops.length - 1));
    else setEntered(false);
  }

  React.useEffect(() => {
    if (!isOpen || !present) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen, present]);

  const setOpen = React.useCallback(
    (v: boolean) => {
      setUncontrolled(v);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) setOpen(false);
      if (e.key === "Tab") {
        const f = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      trigger?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus();
    };
  }, [isOpen, dismissible, setOpen]);

  // Where the top of the panel sits right now, measured down from its fully open position.
  const resting = !isOpen || !entered ? H : yFor(Math.min(snap, stops.length - 1));
  const y = dy === null ? resting : dy;
  const visible = Math.max(H - y, 0);
  const dim = Math.min(1, visible / (vh * stops[0] || 1));

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { y: e.clientY, base: resting, last: [{ t: performance.now(), y: e.clientY }] };
    setDy(resting);
  };

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    let next = g.base + (e.clientY - g.y);
    const top = yFor(stops.length - 1);
    // Resist (rubber-band) when pulled above the highest stop.
    if (next < top) next = top - Math.sqrt(top - next) * 3.2;
    g.last.push({ t: performance.now(), y: e.clientY });
    if (g.last.length > 6) g.last.shift();
    setDy(next);
  };

  const onUp = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || dy === null) return;
    const a = g.last[0];
    const b = g.last[g.last.length - 1];
    const v = b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0; // px per ms, positive = downward
    const projected = dy + v * 240;
    const spots = stops.map((_, i) => yFor(i));
    if (dismissible) spots.push(H);
    let best = 0;
    spots.forEach((s, i) => {
      if (Math.abs(s - projected) < Math.abs(spots[best] - projected)) best = i;
    });
    setDy(null);
    if (dismissible && best === stops.length) setOpen(false);
    else setSnap(best);
  };

  const cycle = () => setSnap((s) => (s + 1) % stops.length);

  return (
    <>
      <span ref={triggerRef} className="inline-flex" onClick={() => setOpen(true)}>
        {trigger}
      </span>
      {present && mounted
        ? createPortal(
            <div className={cn("fixed inset-0 z-50", !isOpen && "pointer-events-none")}>
              <div
                aria-hidden
                className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
                style={{
                  opacity: isOpen ? dim : 0,
                  transition: dy === null ? "opacity 0.35s ease-out" : undefined,
                }}
                onClick={() => dismissible && setOpen(false)}
              />
              <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onTransitionEnd={(e) => {
                  if (e.target === e.currentTarget && !isOpen) setPresent(false);
                }}
                className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-lg flex-col rounded-t-2xl border border-b-0 border-line bg-surface shadow-pop outline-none"
                style={{
                  height: H,
                  transform: `translateY(${y}px)`,
                  transition: dy === null ? `transform ${SPRING}` : undefined,
                }}
              >
                <div
                  className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                >
                  <button
                    type="button"
                    aria-label="Resize drawer"
                    onClick={cycle}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="mx-auto flex h-6 w-24 items-center justify-center outline-none"
                  >
                    <span className="h-1.5 w-10 rounded-full bg-line-strong transition-colors hover:bg-ink/40" />
                  </button>
                  <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-1">
                    <div>
                      <h2 id={titleId} className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                        {title}
                      </h2>
                      {description ? <p className="mt-0.5 text-[13px] text-muted">{description}</p> : null}
                    </div>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setOpen(false)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="-mr-1.5 flex size-8 items-center justify-center rounded-sm text-faint transition-[background-color,color,transform] duration-200 hover:bg-surface-muted hover:text-ink active:scale-90"
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain border-t border-line p-5">
                  {children}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
