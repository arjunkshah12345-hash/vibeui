import { cn } from "@/lib/utils";

/** Bordered list of rows with title, description, leading and trailing slots. */
export function List({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul
      className={cn(
        "divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface shadow-quiet",
        className,
      )}
    >
      {children}
    </ul>
  );
}

export function ListItem({
  title,
  description,
  leading,
  trailing,
  className,
  onClick,
}: {
  title: string;
  description?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {leading ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-ink-soft">
          {leading}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">{title}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-[13px] text-muted">
            {description}
          </span>
        ) : null}
      </span>
      {trailing}
    </>
  );

  if (onClick) {
    return (
      <li className={className}>
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted"
        >
          {inner}
        </button>
      </li>
    );
  }

  return (
    <li className={cn("flex w-full items-center gap-3 px-4 py-3", className)}>
      {inner}
    </li>
  );
}
