import { cn } from "@/lib/utils";

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
        "border-l-2 border-line-strong pl-5 font-[family-name:var(--font-display)] text-xl leading-snug tracking-[-0.02em] text-ink",
        className,
      )}
    >
      {children}
      {cite ? (
        <footer className="mt-3 font-sans text-sm not-italic text-muted">
          — {cite}
        </footer>
      ) : null}
    </blockquote>
  );
}
