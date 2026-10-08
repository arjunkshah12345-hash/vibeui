import { cn } from "@/lib/utils";

/** Color chip with a name and token value. */
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
        className="size-10 shrink-0 rounded-sm shadow-[inset_0_0_0_1px_var(--line-strong)]"
        style={{ background: color }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {value ? <p className="font-mono text-[11px] text-muted">{value}</p> : null}
      </div>
    </div>
  );
}
