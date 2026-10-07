import { cn } from "@/lib/utils";

export function Callout({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-[var(--radius-md)] border-l-2 border-ink bg-surface-muted px-4 py-3",
        className,
      )}
    >
      {title ? (
        <p className="mb-1 text-sm font-medium tracking-[-0.01em] text-ink">
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </aside>
  );
}
