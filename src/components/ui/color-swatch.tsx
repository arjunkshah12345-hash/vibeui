import { cn } from "@/lib/utils";

export function ColorSwatch({
  color,
  label,
  value,
  className,
}: {
  color: string;
  label: string;
  value?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className="size-9 shrink-0 rounded-[var(--radius-sm)] border border-line shadow-[var(--shadow-quiet)]"
        style={{ background: color }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {value ? (
          <p className="font-mono text-[11px] text-faint">{value}</p>
        ) : null}
      </div>
    </div>
  );
}
