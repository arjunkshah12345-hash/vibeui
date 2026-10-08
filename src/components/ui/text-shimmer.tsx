import { cn } from "@/lib/utils";

/** Muted text with a light sweep, good for “thinking…” and loading copy. */
export function TextShimmer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block animate-shimmer bg-[linear-gradient(100deg,var(--muted)_35%,var(--ink)_50%,var(--muted)_65%)] bg-[length:250%_100%] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
