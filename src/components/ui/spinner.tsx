import { cn } from "@/lib/utils";

export function Spinner({
  className,
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin-quiet rounded-full border-2 border-line-strong border-t-ink",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
