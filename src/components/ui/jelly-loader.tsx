import { cn } from "@/lib/utils";

export function JellyLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-end gap-1.5", className)}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-2 rounded-full bg-ink"
          style={{
            height: 18,
            animation: "vibe-jelly 0.9s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
