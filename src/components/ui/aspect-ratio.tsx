import { cn } from "@/lib/utils";

/** Locks children to a width-to-height ratio. */
export function AspectRatio({
  ratio = 16 / 9,
  className,
  children,
}: {
  ratio?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio) }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
