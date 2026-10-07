import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
} as const;

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
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-muted font-medium text-ink-soft",
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
        <span aria-hidden>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

export function AvatarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement<{ className?: string }>(child)
          ? React.cloneElement(child, {
              className: cn(
                "ring-2 ring-canvas",
                child.props.className,
              ),
            })
          : child,
      )}
    </div>
  );
}
