import { cn } from "@/lib/utils";

/** Letters roll up and swap on hover. Hover the text itself, or any `group/flip` parent. */
export function FlipText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      aria-label={text}
      className={cn("group/flip inline-flex font-medium tracking-[-0.01em]", className)}
    >
      {text.split("").map((char, i) => {
        const glyph = char === " " ? " " : char;
        return (
          <span
            key={i}
            aria-hidden
            className="relative inline-block overflow-hidden"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            <span
              className="block transition-transform duration-500 ease-out group-hover/flip:-translate-y-full"
              style={{ transitionDelay: `${i * 22}ms` }}
            >
              {glyph}
            </span>
            <span
              className="absolute left-0 top-0 block translate-y-full text-accent transition-transform duration-500 ease-out group-hover/flip:translate-y-0"
              style={{ transitionDelay: `${i * 22}ms` }}
            >
              {glyph}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** A bordered button wrapping FlipText. */
export function FlipTextTrigger({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group/flip inline-flex h-10 items-center rounded-sm border border-line bg-surface px-4 text-sm text-ink shadow-quiet transition-colors hover:border-line-strong",
        className,
      )}
    >
      <FlipText text={text} />
    </button>
  );
}
