"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({
  text,
  className,
  duration = 800,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = React.useState(text);
  const frame = React.useRef(0);

  const run = React.useCallback(() => {
    const start = performance.now();
    cancelAnimationFrame(frame.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
          continue;
        }
        out +=
          i < reveal
            ? text[i]
            : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(out);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  return (
    <button
      type="button"
      onMouseEnter={run}
      onFocus={run}
      className={cn(
        "font-mono text-sm tracking-wide text-ink tabular-nums",
        className,
      )}
    >
      {display}
    </button>
  );
}
