import { cn } from "@/lib/utils";

/** Card that rises and gains depth on hover. */
export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface p-5 shadow-quiet transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-line-strong hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
