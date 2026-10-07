"use client";

import { cn } from "@/lib/utils";

export function FlipText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex overflow-hidden font-medium tracking-[-0.02em]",
        className,
      )}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="inline-block transition-transform duration-500 ease-[var(--ease-out)] group-hover/flip:-translate-y-full"
          style={{ transitionDelay: `${i * 28}ms` }}
        >
          <span className="inline-block">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}

export function FlipTextTrigger({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group/flip relative inline-flex h-10 items-center overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface px-4 text-sm text-ink",
        className,
      )}
    >
      <span className="relative inline-flex overflow-hidden">
        <span className="inline-flex transition-transform duration-500 ease-[var(--ease-out)] group-hover/flip:-translate-y-full">
          {text.split("").map((char, i) => (
            <span
              key={`a-${i}`}
              className="inline-block"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 inline-flex translate-y-full transition-transform duration-500 ease-[var(--ease-out)] group-hover/flip:translate-y-0">
          {text.split("").map((char, i) => (
            <span
              key={`b-${i}`}
              className="inline-block"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
