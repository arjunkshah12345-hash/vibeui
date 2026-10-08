import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Tile whose description slides up from beneath the title on hover. */
export function HoverSlide({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex h-44 flex-col justify-end overflow-hidden rounded-lg border border-line bg-surface p-5 shadow-quiet outline-offset-2 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-lift focus-visible:border-line-strong",
        className,
      )}
    >
      <ArrowUpRight
        size={18}
        weight="bold"
        className="absolute right-4 top-4 text-faint transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-focus-visible:text-accent"
      />
      <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows,opacity] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [&>div]:opacity-0 group-hover:[&>div]:opacity-100 group-focus-visible:[&>div]:opacity-100">
          <div className="overflow-hidden transition-opacity duration-500">
            <p className="pt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
          </div>
        </div>
      </div>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </div>
  );
}
