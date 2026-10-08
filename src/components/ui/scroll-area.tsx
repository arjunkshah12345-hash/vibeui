import { cn } from "@/lib/utils";

/** Height-limited scroll container with a slim scrollbar. */
export function ScrollArea({
  className,
  children,
  maxHeight = 240,
}: {
  className?: string;
  children: React.ReactNode;
  maxHeight?: number;
}) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "overflow-y-auto rounded-md border border-line bg-surface [scrollbar-color:var(--line-strong)_transparent] [scrollbar-width:thin]",
        className,
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
