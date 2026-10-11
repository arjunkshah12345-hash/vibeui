"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PARTY = ["#ff5d73", "#ffb547", "#ffe14d", "#3ddc97", "#4cc9f0", "#7c6cff", "#f56ee0"];

export type ConfettiOptions = {
  // Where it bursts from, in viewport px. Defaults to the centre of the element.
  x?: number;
  y?: number;
  // How many pieces.
  count?: number;
  // Launch speed in px per second.
  power?: number;
  // Spread of the cone in degrees. 360 fires in every direction.
  spread?: number;
  // Direction of the cone's middle in degrees. 0 is right, 270 is up.
  angle?: number;
  // CSS colours to draw from.
  colors?: string[];
};

export type ConfettiHandle = {
  // Fire a burst.
  fire: (options?: ConfettiOptions) => void;
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  spin: number;
  tilt: number; // phase of the flip around the long axis
  flip: number; // flip speed
  life: number;
  ttl: number;
  color: string;
  shape: 0 | 1 | 2; // 0 paper, 1 dot, 2 streamer
};

/**
 * A burst of confetti that tumbles, flips and drifts down, drawn on a canvas that spans the screen.
 *
 * Click the wrapped element to fire from the pointer, or call `fire()` on the ref when something is done.
 */
export function Confetti({
  children,
  ref,
  onClickFire = true,
  options,
  className,
  onClick,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "ref"> & {
  ref?: React.Ref<ConfettiHandle>;
  /** Fire from the pointer whenever the children are clicked. */
  onClickFire?: boolean;
  /** Defaults for every burst. */
  options?: ConfettiOptions;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const opts = React.useRef(options);
  const stage = React.useRef<{ stop: () => void; add: (p: Piece[]) => void } | null>(null);

  React.useEffect(() => {
    opts.current = options;
  }, [options]);

  // The canvas lives on the page only while there is something to draw.
  const fire = React.useCallback((o: ConfettiOptions = {}) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const merged = { ...opts.current, ...o };
    const r = root.current?.getBoundingClientRect();
    const x = merged.x ?? (r ? r.left + r.width / 2 : window.innerWidth / 2);
    const y = merged.y ?? (r ? r.top + r.height / 2 : window.innerHeight / 2);
    const count = merged.count ?? 90;
    const power = merged.power ?? 900;
    const spread = ((merged.spread ?? 70) * Math.PI) / 180;
    const angle = ((merged.angle ?? 270) * Math.PI) / 180;
    const colors = merged.colors ?? PARTY;

    const pieces: Piece[] = Array.from({ length: count }, () => {
      const a = angle + (Math.random() - 0.5) * spread;
      const v = power * (0.35 + Math.random() * 0.65);
      const shape = (Math.random() < 0.18 ? 1 : Math.random() < 0.22 ? 2 : 0) as 0 | 1 | 2;
      const size = 6 + Math.random() * 6;
      return {
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        w: shape === 2 ? size * 0.45 : shape === 1 ? size * 0.7 : size,
        h: shape === 2 ? size * 2.6 : shape === 1 ? size * 0.7 : size * 0.6,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 14,
        tilt: Math.random() * Math.PI * 2,
        flip: 6 + Math.random() * 10,
        life: 0,
        ttl: 2.4 + Math.random() * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
      };
    });

    if (stage.current) {
      stage.current.add(pieces);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "2147483000",
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const live = [...pieces];
    let raf = 0;
    let last = performance.now();
    const stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.remove();
      stage.current = null;
    };
    stage.current = { stop, add: (p) => live.push(...p) };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.04);
      last = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = live.length - 1; i >= 0; i--) {
        const p = live[i];
        p.life += dt;
        if (p.life > p.ttl || p.y > window.innerHeight + 40) {
          live.splice(i, 1);
          continue;
        }
        // Air drag bleeds off the launch; gravity pulls it down; a light sway makes it flutter.
        const drag = Math.exp(-dt * 2.6);
        p.vx *= drag;
        p.vy = p.vy * drag + 900 * dt;
        p.vy = Math.min(p.vy, 380 + p.h * 6);
        p.x += (p.vx + Math.sin(p.life * 5 + p.tilt) * 28) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        p.tilt += p.flip * dt;

        const fade = p.ttl - p.life < 0.6 ? (p.ttl - p.life) / 0.6 : 1;
        ctx.globalAlpha = Math.max(fade, 0);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Flipping around the long axis is a squash on the other one, and the back face is a shade darker.
        const flipped = Math.cos(p.tilt);
        ctx.scale(1, flipped);
        ctx.fillStyle = p.color;
        if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        if (flipped < 0) {
          ctx.fillStyle = "rgb(0 0 0 / 0.16)";
          if (p.shape === 1) {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (live.length === 0) stop();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }, []);

  React.useImperativeHandle(ref, () => ({ fire }), [fire]);
  React.useEffect(() => () => stage.current?.stop(), []);

  return (
    <div
      {...props}
      ref={root}
      className={cn("inline-block", className)}
      onClick={(e) => {
        onClick?.(e);
        if (onClickFire) {
          // A keyboard "click" has no pointer position, so burst from the middle instead.
          if (e.detail === 0) fire();
          else fire({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {children}
    </div>
  );
}
