import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse-quiet rounded-[var(--radius-sm)] bg-surface-muted",
        className,
      )}
      {...props}
    />
  );
}
