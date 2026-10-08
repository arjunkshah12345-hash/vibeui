import { cn } from "@/lib/utils";

const heights = { sm: "h-28", md: "h-40", lg: "h-56" } as const;

/** Column masonry of tiles with mixed heights and optional tint. */
export function Masonry({
  items,
  className,
}: {
  items: { id: string; title: string; height: keyof typeof heights; tone?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("columns-2 gap-3 md:columns-3", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "group relative mb-3 flex break-inside-avoid flex-col justify-between overflow-hidden rounded-md border border-line bg-surface p-4 shadow-quiet transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift",
            heights[item.height],
          )}
        >
          {item.tone ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background: `linear-gradient(165deg, transparent 35%, ${item.tone})`,
              }}
            />
          ) : null}
          <p className="relative font-mono text-[11px] text-muted">{item.id}</p>
          <p className="relative text-sm font-medium tracking-[-0.01em] text-ink">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}
