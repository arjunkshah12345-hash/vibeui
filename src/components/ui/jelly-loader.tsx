import { cn } from "@/lib/utils";

/** Four bars that squash and stretch in sequence. */
export function JellyLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex h-6 items-center gap-1.5", className)}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block h-full w-1.5 animate-jelly rounded-full bg-accent"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
