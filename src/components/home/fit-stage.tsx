"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A preview stage that never clips. Content is centered and shrunk, never
 * enlarged, until it fits the box. It re-measures when previews mount lazily or
 * the card is resized.
 */
export function FitStage({
  children,
  className,
  padX = 40,
  padY = 32,
}: {
  children: React.ReactNode;
  className?: string;
  /** Total horizontal / vertical breathing room kept around the content, in px. */
  padX?: number;
  padY?: number;
}) {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      // offsetWidth/Height ignore transforms, so this is the natural size.
      const w = i.offsetWidth;
      const h = i.offsetHeight;
      if (!w || !h) return;
      const next = Math.min(1, (o.clientWidth - padX) / w, (o.clientHeight - padY) / h);
      setScale((prev) => (Math.abs(prev - next) < 0.005 ? prev : Math.max(next, 0.4)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [padX, padY]);

  return (
    <div ref={outer} className={cn("flex items-center justify-center overflow-hidden", className)}>
      <div
        ref={inner}
        className="flex w-max shrink-0 items-center justify-center gap-6 will-change-transform"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
