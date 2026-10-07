import { cn } from "@/lib/utils";

export function HighlightText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <mark
      className={cn(
        "rounded-[3px] bg-pastel-sand px-1 py-0.5 text-pastel-sand-ink dark:bg-pastel-sand",
        className,
      )}
    >
      {children}
    </mark>
  );
}
