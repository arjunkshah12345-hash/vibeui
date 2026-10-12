"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MODES = 4; // harmonics that are simulated and drawn
const SEGMENTS = 56;
const PAD = 14;
const NOTES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function frequencyOf(note: string) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(note.trim());
  if (!m) return 220;
  const midi = 12 * (Number(m[3]) + 1) + NOTES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

let audio: AudioContext | null = null;

// Karplus–Strong: a burst of noise circulating in a delay line that low-passes itself is a plucked string.
function pluckSound(freq: number, gain: number) {
  try {
    audio ??= new AudioContext();
    const a = audio;
    if (a.state === "suspended") void a.resume();
    const sr = a.sampleRate;
    const period = Math.max(2, Math.round(sr / freq));
    const line = new Float32Array(period);
    let prev = 0;
    for (let i = 0; i < period; i++) {
      // Softened noise gives a rounder attack than raw static.
      prev = prev * 0.5 + (Math.random() * 2 - 1) * 0.5;
      line[i] = prev * 1.6;
    }
    const length = Math.floor(sr * 2.4);
    const buf = a.createBuffer(1, length, sr);
    const out = buf.getChannelData(0);
    let at = 0;
    for (let i = 0; i < length; i++) {
      const y = line[at];
      const nextAt = (at + 1) % period;
      line[at] = 0.5 * (y + line[nextAt]) * 0.9985;
      out[i] = y;
      at = nextAt;
    }
    const src = a.createBufferSource();
    src.buffer = buf;
    const g = a.createGain();
    const t = a.currentTime;
    g.gain.setValueAtTime(Math.min(1, gain) * 0.5, t);
    g.gain.linearRampToValueAtTime(0, t + 2.3);
    src.connect(g).connect(a.destination);
    src.start(t);
  } catch {
    // no audio here; the string still moves
  }
}

/**
 * A string you can pluck: pull it and let go, or just sweep the pointer across it like a harp.
 *
 * It vibrates as a real one does, as a few standing waves that fade at different speeds, and
 * sounds a plucked-string tone of the note you set.
 */
export function PluckString({
  note = "A3",
  frequency,
  sound = true,
  thickness = 2,
  onPluck,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The note it sounds, for example `E2` or `F#4`. */
  note?: string;
  /** Overrides `note` with a frequency in Hz. */
  frequency?: number;
  /** Play a tone on every pluck. Browsers wait for your first click or tap before they allow sound. */
  sound?: boolean;
  /** Line width in px. */
  thickness?: number;
  /** Called on every pluck. */
  onPluck?: (note: string) => void;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ note, frequency, sound, thickness, onPluck });

  React.useEffect(() => {
    live.current = { note, frequency, sound, thickness, onPluck };
  }, [note, frequency, sound, thickness, onPluck]);

  React.useEffect(() => {
    const box = host.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!box || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    // Each mode is a damped oscillator kept as (position, velocity ÷ ω) and rotated forward every frame.
    const q = new Float64Array(MODES);
    const p = new Float64Array(MODES);
    const ghosts: Float64Array[] = [];
    let drag: { x0: number; d: number } | null = null;
    let pointerId = -1;
    let last = { x: 0, y: 0, t: 0 };
    let lastSound = 0;
    let raf = 0;
    let running = false;
    let prevT = 0;
    let silent = 0;

    const size = () => {
      W = box.offsetWidth;
      H = box.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      draw(0);
    };
    const maxPull = () => H * 0.42;
    const baseHz = () => {
      const f = live.current.frequency ?? frequencyOf(live.current.note);
      return 3.4 + Math.min(1.6, f / 600); // slowed far down so the eye can follow it
    };

    // The shape at one instant, as vertical offsets from rest.
    const shape = (out: Float64Array) => {
      for (let i = 0; i <= SEGMENTS; i++) {
        const u = i / SEGMENTS;
        let y = 0;
        if (drag) {
          y = drag.d * (u <= drag.x0 ? u / drag.x0 : (1 - u) / (1 - drag.x0));
        } else for (let k = 0; k < MODES; k++) y += q[k] * Math.sin((k + 1) * Math.PI * u);
        out[i] = y;
      }
    };

    const draw = (energy: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const colour = getComputedStyle(cv).color;
      const mid = H / 2;
      const span = W - PAD * 2;
      const now = new Float64Array(SEGMENTS + 1);
      shape(now);
      const stroke = (ys: Float64Array, alpha: number, width: number) => {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let i = 0; i <= SEGMENTS; i++) {
          const x = PAD + (span * i) / SEGMENTS;
          if (i === 0) ctx.moveTo(x, mid + ys[i]);
          else ctx.lineTo(x, mid + ys[i]);
        }
        ctx.stroke();
      };
      ctx.strokeStyle = colour;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      // Fading copies of the last few frames stand in for motion blur.
      const w = live.current.thickness;
      for (let g = 0; g < ghosts.length; g++)
        stroke(ghosts[g], 0.16 * (1 - g / ghosts.length), w + 1.5);
      stroke(now, 1, w);
      ctx.globalAlpha = 1;
      // the nut and the bridge it is tied to
      ctx.fillStyle = colour;
      for (const x of [PAD, W - PAD]) {
        ctx.beginPath();
        ctx.arc(x, mid, w + 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (energy > 0.05) {
        ghosts.unshift(now);
        if (ghosts.length > 3) ghosts.pop();
      } else ghosts.length = 0;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - prevT) / 1000, 0.05);
      prevT = t;
      const f1 = baseHz();
      let energy = 0;
      for (let k = 0; k < MODES; k++) {
        const w = 2 * Math.PI * f1 * (k + 1);
        const decay = Math.exp(-dt * 1.25 * (1 + 0.6 * k));
        const c = Math.cos(w * dt);
        const s = Math.sin(w * dt);
        const nq = (q[k] * c - p[k] * s) * decay;
        const np = (q[k] * s + p[k] * c) * decay;
        q[k] = nq;
        p[k] = np;
        energy += Math.abs(nq) + Math.abs(np);
      }
      draw(drag ? 1 : energy);
      if (!drag && energy < 0.05) {
        q.fill(0);
        p.fill(0);
        silent++;
      }
      if (drag || energy >= 0.05 || silent < 2) raf = requestAnimationFrame(tick);
      else {
        running = false;
        draw(0);
      }
    };
    const wake = () => {
      silent = 0;
      if (running) return;
      running = true;
      prevT = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // Let go (or sweep) at x0 with a pull of d px: split the triangle into standing waves.
    const release = (x0: number, d: number) => {
      const L = 1;
      for (let k = 0; k < MODES; k++) {
        const n = k + 1;
        q[k] +=
          ((2 * d * L * L) / (n * n * Math.PI * Math.PI * x0 * (L - x0))) *
          Math.sin(n * Math.PI * x0);
      }
      const now = performance.now();
      const amount = Math.min(1, Math.abs(d) / maxPull());
      if (live.current.sound && now - lastSound > 70 && amount > 0.04) {
        lastSound = now;
        pluckSound(live.current.frequency ?? frequencyOf(live.current.note), 0.25 + amount * 0.75);
      }
      live.current.onPluck?.(live.current.note);
      if (calm) {
        q.fill(0);
        p.fill(0);
        draw(0);
      } else wake();
    };

    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const k = box.offsetWidth / (r.width || 1);
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const { x, y } = local(e);
      const u = Math.min(0.94, Math.max(0.06, (x - PAD) / (W - PAD * 2)));
      drag = { x0: u, d: Math.max(-maxPull(), Math.min(maxPull(), y - H / 2)) };
      pointerId = e.pointerId;
      box.setPointerCapture(e.pointerId);
      q.fill(0);
      p.fill(0);
      wake();
      draw(1);
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = local(e);
      const t = performance.now();
      if (drag && e.pointerId === pointerId) {
        const d = y - H / 2;
        // Pulled as far as it will go: it lets go on its own, the way a plucked string does.
        if (Math.abs(d) >= maxPull()) {
          const { x0 } = drag;
          drag = null;
          pointerId = -1;
          release(x0, Math.sign(d) * maxPull());
        } else drag.d = d;
        return;
      }
      // Hovering: crossing the string plucks it, harder the faster you cross.
      const mid = H / 2;
      if (e.pointerType !== "touch" && last.t && (last.y - mid) * (y - mid) < 0) {
        const f = (mid - last.y) / (y - last.y);
        const cx = last.x + (x - last.x) * f;
        const u = (cx - PAD) / (W - PAD * 2);
        if (u > 0.04 && u < 0.96) {
          const speed = Math.abs(y - last.y) / Math.max((t - last.t) / 1000, 0.001);
          const d = Math.sign(y - last.y) * Math.min(maxPull(), 4 + speed * 0.014);
          release(u, d);
        }
      }
      last = { x, y, t };
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== pointerId) return;
      const { x0, d } = drag;
      drag = null;
      pointerId = -1;
      release(x0, d);
    };
    const onLeave = () => {
      last = { x: 0, y: 0, t: 0 };
    };

    size();
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);
    box.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(size);
    ro.observe(box);
    const mo = new MutationObserver(() => draw(0));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      {...props}
      ref={host}
      className={cn(
        "relative h-16 w-full cursor-pointer touch-none select-none text-ink",
        className,
      )}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
