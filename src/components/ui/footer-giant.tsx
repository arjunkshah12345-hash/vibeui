"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A footer that ends on your name, set enormous: link columns above, and a wordmark that spans the full
 * width and rises into place letter by letter as you scroll down to it.
 *
 * The type is fitted to the container at any width. Each letter lifts when you hover it.
 */
export function FooterGiant({
  brand,
  tagline,
  columns,
  legal,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The word set across the bottom. Short names fill the width best. */
  brand: string;
  tagline?: React.ReactNode;
  columns: { title: string; links: { label: string; href: string }[] }[];
  /** Small print under the wordmark. */
  legal?: React.ReactNode;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const word = React.useRef<HTMLDivElement>(null);
  const [seen, setSeen] = React.useState(false);

  // Fit the word to the width: measure it once at a known size, then scale.
  React.useEffect(() => {
    const box = wrap.current;
    const el = word.current;
    if (!box || !el) return;
    const fit = () => {
      el.style.fontSize = "100px";
      const w = el.scrollWidth || 1;
      el.style.fontSize = `${(100 * box.clientWidth) / w}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [brand]);

  React.useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const letters = Array.from(brand);
  return (
    <footer {...props} className={cn("overflow-hidden border-t border-line", className)}>
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            {tagline && (
              <p className="max-w-xs font-display text-2xl leading-snug tracking-tight text-ink">
                {tagline}
              </p>
            )}
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                {c.title}
              </p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group relative inline-block text-sm text-ink-soft outline-none transition-colors hover:text-ink focus-visible:text-ink"
                    >
                      {l.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div ref={wrap} className="mx-auto mt-16 max-w-6xl px-5" aria-hidden>
        <div
          ref={word}
          className="flex select-none whitespace-nowrap font-display leading-[0.78] tracking-[-0.03em] text-ink"
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              className="inline-block transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] hover:-translate-y-[6%]"
              style={{
                transform: seen ? undefined : "translateY(70%)",
                opacity: seen ? 1 : 0,
                filter: seen ? "none" : "blur(10px)",
                transitionDelay: seen ? `${i * 70}ms` : undefined,
                backgroundImage:
                  "linear-gradient(to bottom, var(--ink) 40%, color-mix(in oklab, var(--ink) 8%, transparent))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{brand}</p>
      {legal && (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-faint">
          {legal}
        </div>
      )}
    </footer>
  );
}
