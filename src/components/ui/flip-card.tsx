"use client";

import * as React from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Two-sided card that turns over on click or Enter. */
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
  const face =
    "absolute inset-0 flex flex-col rounded-lg border border-line bg-surface p-5 shadow-quiet [backface-visibility:hidden]";

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      className={cn("group relative block h-48 w-full text-left [perspective:1100px]", className)}
    >
      <span
        className="relative block size-full transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:shadow-lift"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <span className={face}>
          {front}
          <ArrowsClockwise
            size={14}
            weight="bold"
            className="mt-auto self-end text-faint transition-transform duration-500 group-hover:rotate-180"
          />
        </span>
        <span className={cn(face, "bg-surface-muted [transform:rotateY(180deg)]")}>
          {back}
        </span>
      </span>
    </button>
  );
}
