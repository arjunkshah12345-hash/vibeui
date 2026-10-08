"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Cycles through any number of words with a vertical roll. Width fits the longest word. */
export function RollingText({
  words,
  intervalMs = 2200,
  className,
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const count = words.length;

  React.useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  const prev = (index - 1 + count) % count;

  return (
    <span
      className={cn(
        "relative inline-grid overflow-hidden pb-[0.1em] align-bottom font-medium text-accent",
        className,
      )}
    >
      <span className="sr-only">{words[index]}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className={cn(
            "col-start-1 row-start-1",
            i === index && "translate-y-0 opacity-100 transition-[transform,opacity] duration-500 ease-out",
            i === prev && count > 1 && "-translate-y-full opacity-0 transition-[transform,opacity] duration-500 ease-out",
            i !== index && i !== prev && "translate-y-full opacity-0",
            i !== index && i === prev && "pointer-events-none",
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
