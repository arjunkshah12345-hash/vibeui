import { cn } from "@/lib/utils";

export function DottedGrid({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-8",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
