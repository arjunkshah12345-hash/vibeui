import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
  xl: "size-16 text-lg",
} as const;

function initials(text: string) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return text.slice(0, 2).toUpperCase();
}

/** Round avatar with image, graceful initials fallback and a stackable group. */
export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: {
  src?: string;
  alt?: string;
  fallback: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-medium text-ink-soft ring-1 ring-inset ring-line-strong",
        sizes[size],
        className,
      )}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{initials(fallback)}</span>
      )}
    </span>
  );
}

export function AvatarGroup({
  children,
  max,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const all = React.Children.toArray(children);
  const shown = max ? all.slice(0, max) : all;
  const extra = max ? all.length - shown.length : 0;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {shown.map((child, i) =>
        React.isValidElement<{ className?: string }>(child)
          ? React.cloneElement(child, {
              key: child.key ?? i,
              className: cn("border-2 border-surface ring-0", child.props.className),
            })
          : child,
      )}
      {extra > 0 ? (
        <span className="relative inline-flex size-8 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-[10px] font-medium text-muted">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
