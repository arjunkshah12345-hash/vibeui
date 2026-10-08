"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@";

/** Text that scrambles through random glyphs and resolves, on hover or focus. */
export function ScrambleText({
  text,
  className,
  duration = 700,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = React.useState(text);
  const frame = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const run = () => {
    const start = performance.now();
    cancelAnimationFrame(frame.current);
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
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  return (
    <button
      type="button"
      aria-label={text}
      onMouseEnter={run}
      onFocus={run}
      className={cn(
        "cursor-default whitespace-pre font-mono text-sm uppercase tracking-[0.08em] text-ink tabular-nums transition-colors hover:text-accent",
        className,
      )}
    >
      {display}
    </button>
  );
}
