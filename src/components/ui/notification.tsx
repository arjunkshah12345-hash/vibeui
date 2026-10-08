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
        "flex animate-fade-up gap-3 rounded-md px-3 py-3 transition-[background-color,transform] duration-200 hover:translate-x-0.5 hover:bg-surface-muted/70",
        className,
      )}
    >
      <span
        aria-label={unread ? "Unread" : undefined}
        className="relative mt-[7px] flex size-2 shrink-0"
      >
        {unread ? (
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent opacity-50" />
        ) : null}
        <span
          className={cn(
            "relative size-2 rounded-full transition-colors duration-300",
            unread ? "bg-accent" : "bg-line-strong",
          )}
        />
      </span>
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
