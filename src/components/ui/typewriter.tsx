"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Types, pauses, deletes and cycles through phrases with a blinking caret. */
export function Typewriter({
  phrases,
  className,
  typingMs = 60,
  pauseMs = 1600,
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
    if (!phrases.length) return;
    const current = phrases[index % phrases.length] ?? "";
    let delay: number;
    let action: () => void;

    if (!deleting && text === current) {
      delay = pauseMs;
      action = () => setDeleting(true);
    } else if (deleting && text === "") {
      delay = 280;
      action = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      };
    } else {
      delay = deleting ? typingMs / 2 : typingMs;
      action = () =>
        setText((prev) =>
          deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1),
        );
    }

    const t = window.setTimeout(action, delay);
    return () => window.clearTimeout(t);
  }, [text, deleting, index, phrases, typingMs, pauseMs]);

  return (
    <span className={cn("font-medium text-ink", className)}>
      <span aria-live="off">{text}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.14em] animate-blink bg-accent"
      />
    </span>
  );
}
