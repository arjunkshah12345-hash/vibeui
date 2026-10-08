import { cn } from "@/lib/utils";

/** Row of panels; the hovered or focused one grows and reveals its body. */
export function HoverExpand({
  items,
  className,
}: {
  items: { id: string; label: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex h-48 gap-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          tabIndex={0}
          className="group relative flex min-w-0 grow basis-0 flex-col overflow-hidden rounded-lg border border-line bg-surface p-4 shadow-quiet outline-offset-2 transition-[flex-grow,border-color] duration-500 ease-out hover:grow-[3] hover:border-line-strong focus-visible:grow-[3]"
        >
          <p className="font-mono text-[11px] text-faint transition-colors group-hover:text-accent">
            {item.id}
          </p>
          <p className="mt-auto whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] text-ink">
            {item.label}
          </p>
          <p className="mt-1.5 max-h-0 overflow-hidden text-[13px] leading-relaxed text-muted opacity-0 transition-[max-height,opacity] duration-500 ease-out group-hover:max-h-20 group-hover:opacity-100 group-focus-visible:max-h-20 group-focus-visible:opacity-100">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
