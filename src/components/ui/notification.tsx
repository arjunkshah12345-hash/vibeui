import { cn } from "@/lib/utils";

export function NotificationItem({
  title,
  body,
  time,
  unread,
  className,
}: {
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-3 transition-colors hover:bg-surface-muted/60",
        className,
      )}
    >
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          unread ? "bg-ink" : "bg-line-strong",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <time className="shrink-0 font-mono text-[10px] text-faint">{time}</time>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
    </div>
  );
}
