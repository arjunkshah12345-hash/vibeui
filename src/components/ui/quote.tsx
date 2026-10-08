import { cn } from "@/lib/utils";

/** Pull quote set in the display serif with an attribution line. */
export function Quote({
  children,
  cite,
  className,
}: {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "relative pl-6 font-display text-[26px] leading-[1.25] tracking-[-0.01em] text-ink",
        "before:absolute before:inset-y-1 before:left-0 before:w-[3px] before:rounded-full before:bg-accent",
        className,
      )}
    >
      {children}
      {cite ? (
        <footer className="mt-3 font-sans text-[13px] not-italic tracking-normal text-muted">
          {cite}
        </footer>
      ) : null}
    </blockquote>
  );
}
