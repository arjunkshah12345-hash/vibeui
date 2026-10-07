"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Typewriter({
  phrases,
  className,
  typingMs = 55,
  pauseMs = 1400,
}: {
  phrases: string[];
  className?: string;
  typingMs?: number;
  pauseMs?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = phrases[index] ?? "";
    if (!deleting && text === current) {
      const t = window.setTimeout(() => setDeleting(true), pauseMs);
      return () => window.clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }
    const t = window.setTimeout(
      () => {
        setText((prev) =>
          deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1),
        );
      },
      deleting ? typingMs / 1.6 : typingMs,
    );
    return () => window.clearTimeout(t);
  }, [text, deleting, index, phrases, typingMs, pauseMs]);

  return (
    <span className={cn("font-medium text-ink", className)}>
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-ink animate-pulse-quiet" />
    </span>
  );
}
