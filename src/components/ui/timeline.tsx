import { cn } from "@/lib/utils";

export function Timeline({
  items,
  className,
}: {
  items: { title: string; time: string; body?: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("relative space-y-0", className)}>
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 ? (
            <span className="absolute left-[5px] top-3 h-full w-px bg-line" />
          ) : null}
          <span className="relative mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-ink bg-surface" />
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <time className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">
                {item.time}
              </time>
            </div>
            {item.body ? (
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
