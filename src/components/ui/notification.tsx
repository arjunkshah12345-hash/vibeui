import { cn } from "@/lib/utils";

/** Notification row with an unread dot, title, body and timestamp. */
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
        "flex gap-3 rounded-md px-3 py-3 transition-colors hover:bg-surface-muted/70",
        className,
      )}
    >
      <span
        aria-label={unread ? "Unread" : undefined}
        className={cn(
          "mt-[7px] size-2 shrink-0 rounded-full",
          unread ? "bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "bg-line-strong",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <time className="shrink-0 text-[11px] text-faint">{time}</time>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
    </div>
  );
}
