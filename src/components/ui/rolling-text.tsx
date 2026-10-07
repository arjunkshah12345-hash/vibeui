"use client";

import { cn } from "@/lib/utils";

export function RollingText({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[1.2em] overflow-hidden align-bottom font-medium text-ink",
        className,
      )}
    >
      <span
        className="inline-flex flex-col animate-[vibe-roll_8s_ease-in-out_infinite]"
        style={{ animationTimingFunction: "var(--ease-out)" }}
      >
        {[...words, words[0]].map((w, i) => (
          <span key={`${w}-${i}`} className="h-[1.2em] leading-[1.2em]">
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
