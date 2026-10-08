import { cn } from "@/lib/utils";

/** Empty state with icon, copy and an optional call to action. */
export function Empty({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex animate-fade-up flex-col items-center justify-center rounded-lg border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex size-11 animate-float items-center justify-center rounded-md border border-line bg-surface text-muted shadow-quiet">
          {icon}
        </div>
      ) : null}
      <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
