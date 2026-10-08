import { cn } from "@/lib/utils";

/** Labels circling a center point. Chips stay upright while the ring turns. */
export function OrbitRing({
  items,
  center,
  radius = 104,
  className,
}: {
  items: { id: string; label: string }[];
  center?: React.ReactNode;
  radius?: number;
  className?: string;
}) {
  const size = radius * 2 + 80;

  return (
    <div
      className={cn("group/orbit relative mx-auto flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        aria-hidden
        className="absolute rounded-full border border-dashed border-line-strong"
        style={{ width: radius * 2, height: radius * 2 }}
      />
      <div className="absolute inset-0 animate-orbit group-hover/orbit:[animation-play-state:paused]">
        {items.map((item, i) => {
          const angle = (360 / items.length) * i;
          return (
            <span
              key={item.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
              }}
            >
              <span className="block -translate-x-1/2 -translate-y-1/2 animate-orbit [animation-direction:reverse] group-hover/orbit:[animation-play-state:paused]">
                <span className="block rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink shadow-quiet">
                  {item.label}
                </span>
              </span>
            </span>
          );
        })}
      </div>
      <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-ink text-center font-display text-lg text-surface shadow-lift">
        {center ?? "UI"}
      </div>
    </div>
  );
}
