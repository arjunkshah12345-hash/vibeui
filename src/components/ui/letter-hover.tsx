import { cn } from "@/lib/utils";

/** Each letter lifts and tints as the cursor passes over it. */
export function LetterHover({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex font-medium tracking-[-0.02em] text-ink", className)}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-[transform,color] duration-300 ease-spring hover:-translate-y-1.5 hover:text-accent"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
