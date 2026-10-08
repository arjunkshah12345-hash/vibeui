"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*";

/** Monospace text that decodes from noise the first time it scrolls into view. */
export function DecodeText({
  text,
  className,
  duration = 1100,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(() =>
    text.replace(/\S/g, "·"),
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const reveal = Math.floor(t * text.length);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            out +=
              text[i] === " " || i < reveal
                ? text[i]
                : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          setDisplay(t < 1 ? out : text);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span
      ref={ref}
      aria-label={text}
      className={cn("inline-block whitespace-pre font-mono text-sm text-ink", className)}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
}
