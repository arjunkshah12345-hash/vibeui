import { cn } from "@/lib/utils";

/** Loading placeholder with a soft shimmer sweep. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-sm bg-surface-muted bg-[linear-gradient(100deg,transparent_30%,var(--surface-sunken)_50%,transparent_70%)] bg-[length:250%_100%]",
        className,
      )}
      {...props}
    />
  );
}
