import { cn } from "@/lib/utils";

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
        "divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface",
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
  trailing,
  className,
  onClick,
}: {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        ) : null}
      </div>
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
