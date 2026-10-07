import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "inline-flex min-w-[1.4rem] items-center justify-center rounded-[4px] border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-soft",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
