import { cn } from "@/lib/utils";

export function LetterHover({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex font-medium tracking-[-0.02em] text-ink",
        className,
      )}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="inline-block transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:text-ink-soft"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
