import { cn } from "@/lib/utils";

/** Quiet note with an accent rule, lighter than a filled alert. */
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
        "relative rounded-md bg-surface-muted py-3.5 pl-5 pr-4",
        "before:absolute before:inset-y-2.5 before:left-2 before:w-[3px] before:rounded-full before:bg-accent",
        className,
      )}
    >
      {title ? (
        <p className="mb-0.5 text-sm font-medium tracking-[-0.01em] text-ink">
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </aside>
  );
}
