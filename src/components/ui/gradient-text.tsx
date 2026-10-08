import { cn } from "@/lib/utils";

/** Text filled with an ink-to-accent gradient. */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-[linear-gradient(100deg,var(--ink)_0%,var(--accent)_55%,var(--ink)_110%)] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
