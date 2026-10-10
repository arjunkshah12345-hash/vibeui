"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

// Chromium can run an SVG filter as a backdrop filter; Safari and Firefox cannot.
function useRefraction() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "url(#a)");
      } catch {
        return false;
      }
    },
    () => false,
  );
}

// A displacement map: neutral in the middle, bending light hard toward the rim.
function lensMap(w: number, h: number, radius: number, edge: number, soften: number) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>` +
    `<linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="black"/>` +
    `<rect width="${w}" height="${h}" rx="${radius}" fill="url(#r)"/>` +
    `<rect width="${w}" height="${h}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:difference"/>` +
    `<rect x="${edge}" y="${edge}" width="${Math.max(w - edge * 2, 1)}" height="${Math.max(h - edge * 2, 1)}" rx="${Math.max(radius - edge, 0)}" fill="hsl(0 0% 50% / .93)" style="filter:blur(${soften}px)"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Liquid glass: a surface that bends the light behind it, with a specular rim that follows the pointer.
 *
 * Real refraction with chromatic edges in Chromium, and a clean frosted fallback in Safari and Firefox.
 */
export function LiquidGlass({
  children,
  className,
  style,
  radius = 28,
  blur = 1,
  refraction = 60,
  aberration = 8,
  saturation = 1.5,
  interactive = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Corner radius in px. Use a large value for a pill. */
  radius?: number;
  /** Blur behind the glass in px. Keep it low so the refraction stays readable. */
  blur?: number;
  /** How far the rim bends the backdrop, in px. 0 turns refraction off. */
  refraction?: number;
  /** Colour fringing at the rim, in px of channel offset. */
  aberration?: number;
  /** Backdrop saturation multiplier. */
  saturation?: number;
  /** Let the highlight and rim light follow the pointer. */
  interactive?: boolean;
}) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const supported = useRefraction();
  const root = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bend = supported && refraction > 0 && size !== null && size.w > 8 && size.h > 8;
  const r = Math.min(radius, size ? Math.min(size.w, size.h) / 2 : radius);
  const edge = size ? Math.max(Math.min(size.w, size.h) * 0.14, 6) : 12;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    props.onPointerMove?.(e);
    const el = root.current;
    if (!el || !interactive) return;
    const b = el.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    el.style.setProperty("--lx", `${x}px`);
    el.style.setProperty("--ly", `${y}px`);
    const angle = (Math.atan2(y - b.height / 2, x - b.width / 2) * 180) / Math.PI + 90;
    el.style.setProperty("--la", `${angle}deg`);
    el.style.setProperty("--lo", "1");
  };

  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    props.onPointerLeave?.(e);
    root.current?.style.setProperty("--lo", "0");
  };

  const filter = `saturate(${saturation}) brightness(1.06)`;
  const backdrop = bend
    ? `url(#${id}) blur(${Math.min(blur, 6)}px) ${filter}`
    : `blur(${Math.max(blur, 8)}px) ${filter}`;

  return (
    <div
      {...props}
      ref={root}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn(
        "relative shadow-[0_14px_44px_-12px_rgb(0_0_0/0.35),0_2px_6px_rgb(0_0_0/0.08)]",
        className,
      )}
      style={{ borderRadius: radius, ...style }}
    >
      {bend && (
        <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
          <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage
              href={lensMap(size.w, size.h, r, edge, edge * 0.8)}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispR"
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction - aberration}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispG"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction - aberration * 2}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispB"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" />
          </filter>
        </svg>
      )}

      {/* the lens: blur, saturation and (where supported) refraction of whatever is behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-white/[0.05]"
        style={{ borderRadius: radius, backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
      />

      {/* bevel: a bright upper-left rim, a softer lower-right one, and an inner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          boxShadow:
            "inset 0 0 0 1px rgb(255 255 255 / 0.22), inset 1.5px 1.5px 0 -0.5px rgb(255 255 255 / 0.75), inset -1.5px -1.5px 0 -0.5px rgb(255 255 255 / 0.35), inset 0 0 22px 2px rgb(255 255 255 / 0.12), inset 0 -10px 18px -10px rgb(0 0 0 / 0.18)",
        }}
      />

      {/* specular: a soft sheen under the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius: radius,
          opacity: "var(--lo, 0)",
          background:
            "radial-gradient(180px circle at var(--lx, 30%) var(--ly, 0%), rgb(255 255 255 / 0.3), transparent 62%)",
        }}
      />

      {/* rim light: the edge brightens on the side facing the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 p-[1.5px] transition-opacity duration-300"
        style={{
          borderRadius: radius,
          opacity: "var(--lo, 0)",
          background:
            "conic-gradient(from var(--la, 135deg) at 50% 50%, transparent 0%, rgb(255 255 255 / 0.95) 9%, transparent 24%, transparent 50%, rgb(255 255 255 / 0.55) 59%, transparent 74%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        }}
      />

      <div className="relative h-full" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
}
