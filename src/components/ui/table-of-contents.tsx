"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string; depth?: 1 | 2 | 3 };

/**
 * A contents list that follows the page: the current section is marked, and a line beside it fills as you read.
 *
 * It watches the headings you point it at, highlights the one in view, glides a marker to it and
 * smooth-scrolls on click. Works against the window or against any scrolling container.
 */
export function TableOfContents({
  items,
  offset = 96,
  scrollRoot,
  title = "On this page",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Headings to list, by element id. `depth` indents them. */
  items: TocItem[];
  /** How far from the top of the view a heading counts as current, in px. */
  offset?: number;
  /** A scrolling element to watch instead of the window. */
  scrollRoot?: React.RefObject<HTMLElement | null>;
  /** Small label above the list. Pass an empty string to hide it. */
  title?: string;
}) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");
  const [progress, setProgress] = React.useState(0);
  const [marker, setMarker] = React.useState<{ y: number; h: number } | null>(null);
  const list = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    const root = scrollRoot?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    const top = () => (root ? root.getBoundingClientRect().top : 0);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top - top() <= offset + 1) current = it.id;
        else if (el) break;
      }
      setActive(current);
      const max = root
        ? root.scrollHeight - root.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const at = root ? root.scrollTop : window.scrollY;
      setProgress(max > 0 ? Math.min(1, Math.max(0, at / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, offset, scrollRoot]);

  // Glide the marker to the active row.
  React.useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const measure = () => {
      const a = ul.querySelector<HTMLElement>(`[data-id='${CSS.escape(active)}']`);
      setMarker(a ? { y: a.offsetTop, h: a.offsetHeight } : null);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [active, items]);

  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const root = scrollRoot?.current ?? null;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = calm ? "auto" : "smooth";
    if (root) {
      const y = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
      root.scrollTo({ top: y - offset, behavior });
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior });
    }
    el.focus?.({ preventScroll: true });
  };

  return (
    <nav aria-label={title || "Table of contents"} {...props} className={cn("text-sm", className)}>
      {title && (
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
          {title}
        </p>
      )}
      <div className="relative">
        {/* the rail: a faint line, the part you have read, and a marker on the current heading */}
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line-strong" />
        <span
          aria-hidden
          className="absolute left-0 top-0 w-px origin-top bg-ink/50"
          style={{
            height: "100%",
            transform: `scaleY(${progress})`,
            transition: "transform 120ms linear",
          }}
        />
        {marker && (
          <span
            aria-hidden
            className="absolute -left-px w-[3px] rounded-full bg-ink transition-[top,height] duration-500 ease-[cubic-bezier(0.3,1.2,0.4,1)]"
            style={{ top: marker.y + 5, height: Math.max(0, marker.h - 10) }}
          />
        )}
        <ul ref={list} className="relative">
          {items.map((it) => {
            const on = it.id === active;
            return (
              <li key={it.id} data-id={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={go(it.id)}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "block rounded-r-md py-1.5 pr-2 leading-snug outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                    on ? "font-medium text-ink" : "text-muted hover:text-ink",
                  )}
                  style={{ paddingLeft: 16 + ((it.depth ?? 1) - 1) * 14 }}
                >
                  {it.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
