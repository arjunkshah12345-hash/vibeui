import { cn } from "@/lib/utils";

export function Masonry({
  items,
  className,
}: {
  items: { id: string; title: string; height: "sm" | "md" | "lg"; tone?: string }[];
  className?: string;
}) {
  const heights = { sm: "h-28", md: "h-40", lg: "h-56" };

  return (
    <div
      className={cn(
        "columns-2 gap-3 md:columns-3 [column-fill:balance]",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong",
            heights[item.height],
          )}
          style={
            item.tone
              ? {
                  background: `linear-gradient(160deg, var(--surface) 40%, ${item.tone})`,
                }
              : undefined
          }
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
            {item.id}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{item.title}</p>
        </div>
      ))}
    </div>
  );
}
