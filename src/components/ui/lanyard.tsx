"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const POINTS = 9; // strap points; the badge is one more, hanging from the last
const CLIP = 18; // how far the metal clip rises above the card
const STEP = 1 / 120; // physics runs at a fixed rate whatever the frame rate

/**
 * A badge hanging from a woven strap that you can grab, swing and fling, driven by a real rope simulation.
 *
 * The strap is a chain of points under gravity; the badge is a heavier body on its end that turns
 * with it. Put anything on the card: a name, a ticket, a conference pass.
 */
export function Lanyard({
  children,
  width = 208,
  strapText = "VIBEUI",
  strapColor,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What is printed on the card. Leave the top 2rem free for the slot. */
  children: React.ReactNode;
  /** Width of the card, in px. */
  width?: number;
  /** Text woven into the strap. */
  strapText?: string;
  /** CSS colour of the strap. Defaults to the accent token. */
  strapColor?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const badge = React.useRef<HTMLDivElement>(null);
  const live = React.useRef({ strapText, strapColor });

  React.useEffect(() => {
    live.current = { strapText, strapColor };
  }, [strapText, strapColor]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const card = badge.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !card || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = POINTS;
    const x = new Float64Array(N + 1);
    const y = new Float64Array(N + 1);
    const ox = new Float64Array(N + 1);
    const oy = new Float64Array(N + 1);
    let W = 0;
    let H = 0;
    let dpr = 1;
    let strap = 150;
    let cardH = 260;
    let drag: { dx: number; dy: number; tx: number; ty: number } | null = null;
    let down: { x: number; y: number; id: number; moved: boolean } | null = null;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let acc = 0;
    let rest = 0;
    let started = false;

    const rod = () => cardH / 2 + CLIP;
    const seg = () => strap / (N - 1);
    const anchor = () => ({ x: W / 2, y: -24 });

    // Lay the chain out hanging at an angle from the anchor: letting go of it is the entrance.
    const pose = (angle: number) => {
      const a = anchor();
      const s = seg();
      for (let i = 0; i < N; i++) {
        x[i] = a.x + Math.sin(angle) * s * i;
        y[i] = a.y + Math.cos(angle) * s * i;
      }
      x[N] = x[N - 1] + Math.sin(angle) * rod();
      y[N] = y[N - 1] + Math.cos(angle) * rod();
      ox.set(x);
      oy.set(y);
    };

    const size = () => {
      W = el.offsetWidth;
      H = el.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cardH = card.offsetHeight;
      strap = Math.min(230, Math.max(70, H * 0.3));
      if (!started) {
        pose(calm ? 0 : 0.62);
        started = true;
      } else {
        // The anchor moved with the width; nudge the whole rope with it.
        const a = anchor();
        const shift = a.x - x[0];
        for (let i = 0; i <= N; i++) {
          x[i] += shift;
          ox[i] += shift;
        }
      }
      wake();
    };

    const solve = () => {
      const g = 2600 * STEP * STEP;
      for (let i = 1; i <= N; i++) {
        if (i === N && drag) continue;
        const vx = (x[i] - ox[i]) * (i === N ? 0.9935 : 0.989);
        const vy = (y[i] - oy[i]) * (i === N ? 0.9935 : 0.989);
        ox[i] = x[i];
        oy[i] = y[i];
        x[i] += vx;
        y[i] += vy + g;
      }
      if (drag) {
        ox[N] = x[N];
        oy[N] = y[N];
        x[N] = drag.tx;
        y[N] = drag.ty;
      }
      const a = anchor();
      x[0] = ox[0] = a.x;
      y[0] = oy[0] = a.y;
      for (let k = 0; k < 18; k++) {
        for (let i = 0; i < N; i++) {
          const len = i < N - 1 ? seg() : rod();
          const dx = x[i + 1] - x[i];
          const dy = y[i + 1] - y[i];
          const d = Math.hypot(dx, dy) || 1e-6;
          const diff = (d - len) / d;
          const wi = i === 0 ? 0 : 1;
          // The badge is heavier than the strap, so it moves less when they pull on each other.
          const wj = i + 1 === N ? (drag ? 0 : 0.4) : 1;
          const t = wi + wj;
          if (!t) continue;
          x[i] += (dx * diff * wi) / t;
          y[i] += (dy * diff * wi) / t;
          x[i + 1] -= (dx * diff * wj) / t;
          y[i + 1] -= (dy * diff * wj) / t;
        }
      }
    };

    const colours = () => {
      const cs = getComputedStyle(cv);
      return {
        strap: live.current.strapColor ?? cs.color,
        text: cs.getPropertyValue("--accent-ink").trim() || "#fff",
      };
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const { strap: base, text } = colours();

      const trace = () => {
        ctx.beginPath();
        ctx.moveTo(x[0], y[0]);
        for (let i = 1; i < N - 1; i++)
          ctx.quadraticCurveTo(x[i], y[i], (x[i] + x[i + 1]) / 2, (y[i] + y[i + 1]) / 2);
        ctx.lineTo(x[N - 1], y[N - 1]);
      };
      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
      // shadow, edge, cloth, highlight: four passes make a flat ribbon read as woven webbing
      trace();
      ctx.strokeStyle = "rgb(0 0 0 / 0.16)";
      ctx.lineWidth = 19;
      ctx.save();
      ctx.translate(2, 3);
      ctx.stroke();
      ctx.restore();
      trace();
      ctx.strokeStyle = base;
      ctx.lineWidth = 17;
      ctx.stroke();
      trace();
      ctx.strokeStyle = "rgb(255 255 255 / 0.14)";
      ctx.lineWidth = 5;
      ctx.stroke();
      trace();
      ctx.strokeStyle = "rgb(0 0 0 / 0.22)";
      ctx.lineWidth = 17;
      ctx.setLineDash([1, 3]);
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Lettering along the strap, every so often, turned to follow it.
      ctx.fillStyle = text;
      ctx.globalAlpha = 0.85;
      ctx.font = "700 7.5px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = `${live.current.strapText}  ◆`;
      const every = 56;
      let travelled = 18;
      let next = 22;
      for (let i = 0; i < N - 1; i++) {
        const dx = x[i + 1] - x[i];
        const dy = y[i + 1] - y[i];
        const L = Math.hypot(dx, dy);
        while (next <= travelled + L) {
          const f = (next - travelled) / L;
          ctx.save();
          ctx.translate(x[i] + dx * f, y[i] + dy * f);
          ctx.rotate(Math.atan2(dy, dx));
          ctx.fillText(label, 0, 0.5);
          ctx.restore();
          next += every;
        }
        travelled += L;
      }
      ctx.globalAlpha = 1;

      // The card hangs from its clip: turn it so the clip points back up the strap.
      const ux = x[N - 1] - x[N];
      const uy = y[N - 1] - y[N];
      const theta = Math.atan2(ux, -uy);
      card.style.transform = `translate3d(${x[N] - card.offsetWidth / 2}px, ${y[N] - cardH / 2}px, 0) rotate(${theta}rad)`;
    };

    const frame = (t: number) => {
      acc += Math.min((t - last) / 1000, 0.05);
      last = t;
      while (acc >= STEP) {
        solve();
        acc -= STEP;
      }
      render();
      // Asleep once nothing is moving and nobody is holding it.
      let speed = 0;
      for (let i = 1; i <= N; i++) speed += Math.abs(x[i] - ox[i]) + Math.abs(y[i] - oy[i]);
      rest = !drag && speed < 0.12 ? rest + 1 : 0;
      if (rest > 40 || !visible) {
        running = false;
        raf = 0;
      } else raf = requestAnimationFrame(frame);
    };
    function wake() {
      rest = 0;
      if (running || !visible || document.hidden) {
        if (!running) render();
        return;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = el.offsetWidth / (r.width || 1);
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const p = local(e);
      down = { x: p.x, y: p.y, id: e.pointerId, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      const p = local(e);
      if (!down.moved) {
        if (Math.hypot(p.x - down.x, p.y - down.y) < 4) return;
        down.moved = true;
        // Only a real drag takes the pointer, so buttons on the card still click.
        card.setPointerCapture(e.pointerId);
        card.style.cursor = "grabbing";
        drag = { dx: x[N] - down.x, dy: y[N] - down.y, tx: x[N], ty: y[N] };
      }
      if (!drag) return;
      drag.tx = Math.min(W - 10, Math.max(10, p.x + drag.dx));
      drag.ty = Math.min(H - 10, Math.max(40, p.y + drag.dy));
      wake();
    };
    const onUp = () => {
      down = null;
      drag = null;
      card.style.cursor = "";
      wake();
    };

    size();
    render();
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    ro.observe(card);
    const mo = new MutationObserver(() => render());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(el);
    const onVisibility = () => {
      if (!document.hidden) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      {...props}
      ref={box}
      className={cn("relative h-[460px] w-full overflow-hidden text-accent", className)}
    >
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <div
        ref={badge}
        className="absolute left-0 top-0 touch-none cursor-grab will-change-transform"
        style={{ width }}
      >
        {/* the metal clip the strap threads through */}
        <div
          aria-hidden
          className="absolute left-1/2 z-10 h-[34px] w-[26px] -translate-x-1/2 rounded-[7px] bg-[linear-gradient(100deg,#f4f4f2,#a9a9a6_45%,#e6e6e3_60%,#8f8f8c)] shadow-[0_2px_4px_rgb(0_0_0/0.35),inset_0_0_0_1px_rgb(0_0_0/0.25)]"
          style={{ top: -CLIP }}
        >
          <span className="absolute left-1/2 top-[6px] h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-black/40 shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)]" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface pt-8 shadow-[0_18px_36px_-12px_rgb(0_0_0/0.4),0_2px_6px_rgb(0_0_0/0.12)]">
          <span
            aria-hidden
            className="absolute left-1/2 top-3 h-2 w-14 -translate-x-1/2 rounded-full bg-canvas shadow-[inset_0_1px_3px_rgb(0_0_0/0.35)]"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
