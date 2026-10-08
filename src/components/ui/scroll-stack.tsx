import { cn } from "@/lib/utils";

/**
 * Cards that pile up as you scroll. Pure CSS (position: sticky).
 * Give it a `height` to make it its own scroll container, or omit it to
 * stack against the page scroll.
 */
export function ScrollStack({
  items,
  height,
  className,
}: {
  items: { title: string; body: string }[];
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative [scrollbar-width:none]",
        height && "overflow-y-auto [&::-webkit-scrollbar]:hidden",
        className,
      )}
      style={height ? { height } : undefined}
    >
      {items.map((item, i) => (
        <div
          key={item.title}
          className="sticky mb-4 last:mb-0"
          style={{ top: 16 + i * 14 }}
        >
          <div className="flex h-44 flex-col rounded-lg border border-line bg-surface p-6 shadow-lift">
            <p className="font-mono text-[11px] text-faint">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-auto font-display text-[28px] leading-none tracking-[-0.01em] text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        </div>
      ))}
      {height ? <div aria-hidden style={{ height: height / 2 }} /> : null}
    </div>
  );
}
