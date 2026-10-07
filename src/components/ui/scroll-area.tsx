import { cn } from "@/lib/utils";

export function ScrollArea({
  className,
  children,
  maxHeight = 220,
}: {
  className?: string;
  children: React.ReactNode;
  maxHeight?: number;
}) {
  return (
    <div
      className={cn(
        "overflow-y-auto rounded-[var(--radius-md)] border border-line bg-surface",
        className,
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
