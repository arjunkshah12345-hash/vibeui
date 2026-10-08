import { cn } from "@/lib/utils";

/** Link or span whose underline draws in from the left on hover. */
export function UnderlineReveal({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const Comp = href ? "a" : "span";
  return (
    <Comp
      href={href}
      className={cn("group relative inline-block font-medium text-ink", className)}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-right scale-x-0 rounded-full bg-accent transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100"
      />
    </Comp>
  );
}
