"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SphereImage = { src: string; alt: string };

/**
 * A ball of pictures you can spin: tiles sit on the surface of a sphere, drift round on their own, and
 * follow your drag with a little momentum.
 *
 * It is plain CSS 3D, so it needs no canvas or library. Tiles on the far side fade back, and every
 * tile stays upright to the viewer as the ball turns.
 */
export function ImageSphere({
  images,
  radius = 220,
  tile = 64,
  speed = 0.12,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  images: SphereImage[];
  /** Radius of the ball, in px. */
  radius?: number;
  /** Width of one tile, in px. */
  tile?: number;
  /** Idle spin, in degrees per frame. 0 holds it still. */
  speed?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const ball = React.useRef<HTMLDivElement>(null);
  const live = React.useRef({ speed });

  React.useEffect(() => {
    live.current = { speed };
  }, [speed]);

  // Spread the tiles evenly over the surface (a Fibonacci spiral), as angles.
  const spots = React.useMemo(() => {
    const n = images.length;
    return images.map((_, i) => {
      const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = ((i * 137.508) % 360) - 180;
      return { lat, lon };
    });
  }, [images]);

  React.useEffect(() => {
    const el = box.current;
    const b = ball.current;
    if (!el || !b) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rot = { x: -12, y: 0 };
    const vel = { x: 0, y: 0 };
    let dragging = false;
    let last = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;

    const paint = () => {
      b.style.transform = `translateZ(${-radius}px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
    };
    const frame = () => {
      raf = 0;
      if (!dragging) {
        rot.y += vel.x + (calm ? 0 : live.current.speed);
        rot.x = Math.max(-80, Math.min(80, rot.x + vel.y));
        vel.x *= 0.95;
        vel.y *= 0.95;
      }
      paint();
      if (visible) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      vel.x = 0;
      vel.y = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      rot.y += dx * 0.4;
      rot.x = Math.max(-80, Math.min(80, rot.x - dy * 0.4));
      vel.x = dx * 0.4;
      vel.y = -dy * 0.4;
    };
    const up = () => {
      dragging = false;
      el.style.cursor = "grab";
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    paint();
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [radius]);

  return (
    <div
      role="group"
      aria-label="Rotating gallery"
      {...props}
      ref={box}
      className={cn("relative mx-auto touch-none select-none", className)}
      style={{
        width: radius * 2 + tile,
        height: radius * 2 + tile,
        perspective: radius * 4.2,
        ...props.style,
      }}
    >
      <div
        ref={ball}
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ transform: `translateZ(${-radius}px) rotateX(-12deg)` }}
      >
        {images.map((im, i) => (
          <div
            key={im.src + i}
            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
            style={{
              width: tile,
              height: tile * 1.25,
              marginLeft: -tile / 2,
              marginTop: -(tile * 1.25) / 2,
              transform: `rotateY(${spots[i].lon}deg) rotateX(${-spots[i].lat}deg) translateZ(${radius}px)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={im.src}
              alt={im.alt}
              draggable={false}
              className="size-full rounded-lg object-cover shadow-[0_8px_20px_-6px_rgb(0_0_0/0.4)] ring-1 ring-black/10 [backface-visibility:hidden]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
