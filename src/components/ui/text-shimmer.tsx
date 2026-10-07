import { cn } from "@/lib/utils";

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
        "inline-block bg-[linear-gradient(90deg,var(--muted)_0%,var(--ink)_40%,var(--muted)_80%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-[vibe-shimmer_2.8s_linear_infinite]",
        className,
      )}
    >
      {children}
    </span>
  );
}
