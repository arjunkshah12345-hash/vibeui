"use client";

import * as React from "react";

/** Mounts children the first time they approach the viewport, then keeps them. */
export function LazyMount({
  children,
  placeholder,
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="flex size-full items-center justify-center">
      {mounted ? children : placeholder}
    </div>
  );
}
