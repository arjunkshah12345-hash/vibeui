import { cn } from "@/lib/utils";

/** Vertical event timeline with a continuous rail. */
export function Timeline({
  items,
  className,
}: {
  items: { title: string; time: string; body?: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li
          key={`${item.title}-${i}`}
          style={{ animationDelay: `${i * 110}ms` }}
          className="relative animate-fade-up pb-7 pl-7 last:pb-0"
        >
          {i < items.length - 1 ? (
            <span
              aria-hidden
              className="absolute bottom-0 left-[4.5px] top-[18px] w-px origin-top animate-grow-y bg-line-strong"
            />
          ) : null}
          <span
            aria-hidden
            className="absolute left-0 top-[7px] size-[10px] animate-pop-in rounded-full border-2 border-accent bg-surface"
          />
          <div className="flex flex-wrap items-baseline gap-x-2.5">
            <p className="text-sm font-medium tracking-[-0.01em] text-ink">
              {item.title}
            </p>
            <time className="font-mono text-[11px] text-faint">{item.time}</time>
          </div>
          {item.body ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
