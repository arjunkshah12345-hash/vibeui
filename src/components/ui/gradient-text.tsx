import { cn } from "@/lib/utils";

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
        "bg-[linear-gradient(105deg,var(--ink)_0%,var(--muted)_55%,var(--ink)_100%)] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
