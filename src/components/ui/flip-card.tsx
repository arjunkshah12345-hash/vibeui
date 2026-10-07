"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function FlipCard({
  front,
  back,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className={cn("group relative h-44 w-full text-left [perspective:1000px]", className)}
      aria-pressed={flipped}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-[var(--ease-out)] [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="absolute inset-0 rounded-[var(--radius-lg)] border border-line bg-surface p-5 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 rounded-[var(--radius-lg)] border border-line bg-surface p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </button>
  );
}
