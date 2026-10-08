import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Keyboard key cap for shortcuts. */
export function Kbd({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 select-none items-center justify-center rounded-[5px] border border-line-strong border-b-2 bg-surface px-1.5 font-mono text-[10.5px] font-medium text-ink-soft transition-[transform,border-width] duration-100 hover:-translate-y-px active:translate-y-px active:border-b",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
