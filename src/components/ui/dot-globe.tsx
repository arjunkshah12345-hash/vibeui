"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GlobeMarker = {
  lat: number;
  lng: number;
  // Shown when the marker is hovered, and read out to screen readers.
  label?: string;
};

const QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return React.useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

// Land and sea at 1.5 degrees (240 x 120 cells, one bit each, north to south), from Natural Earth (public domain).
const MASK_W = 240;
const MASK_H = 120;
const MASK =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//8////44AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPx/n/////AAAA/AAYAAAAfAAAAAAAAAAAAAAAAEO3v4f////+AAAPgAAAAAAAAcAAAAAAAAAAAAAADAAAfgP////+AAAHAAAAAAAAAMAAAAAAAAAAAAAAA9jjCAAP///+AAAAAAAAHgAAP/8AAPAAAAAAAAAAcAAAAAAD///8AAAAAAAAYAAD//gAAAAAAAAAAAAAe6zs/AAB///4AAAAAAABgDA/////wGAAAAwAEAAAI/wM//AAf//4AAAAAAABwHf/////z/+AABAB//wPI/+sEP4A///wAAAAf8AACHf////////8B8wH/////ww3mB4Af/8AAAAD//xjf7v///////////7A////////+B/g//gAAAAH//4///f///////////GH////////0P5Af4AH4AAPx+H///////////////AAf///////Ng+AP4ADAAA/n////////////////+AD///////8COMAHwAAAAD/P///////////////v8AD/7/////4APwABgAAAAH/P//////////////wfAAA+AH////4APzAAAAAAAD/D/////////////JhgAAAFAAf///8AH/gAAAAAIAOD////////////4AHAAAAQAAP////wH/gAAAAAMBuP////////////wAPgAACAAAH////+f/8AAAAAWAhf////////////AAPAAAAAAAT////+f/+AAAAA3H//////////////+AOAAAAAAAB/////f/8AAAAAHn//////////////+AIAAAAAAAB//////8wAAAAAMf//////////////9AAAAAAAAAA//////2HAAAAAF///////////////4AAAAAAAAAAf/////+AgAAAAD///////////////4AAAAAAAAAAf//////wAAAAAB///yfx/////////wAAAAAAAAAAf/////yAAAAAAB/z/gPj/////////jAAAAAAAAAAf/////gAAAAAA/wY/gDx////////8HAAAAAAAAAAf/////AAAAAAA/gGfnn4////////wAAAAAAAAAAAf////+AAAAAAA/ACY//4///////1gGAAAAAAAAAAP////8AAAAAAA/ACM//4///////hwEAAAAAAAAAAH////4AAAAAAAOLgA//////////4wcAAAAAAAAAAH////4AAAAAAAN/gDC/////////wz8AAAAAAAAAAB////wAAAAAAAf/gAA/////////wDgAAAAAAAAAAA////AAAAAAAA//8YB/////////4EAAAAAAAAAAAAX///AAAAAAAA///f//////////4AAAAAAAAAAAAAX/5BAAAAAAAB//////z///////4AAAAAAAAAAAAAb/gBAAAAAAAH////8/5///////4AAAAAAAAAAAAAF/gBoAAAAAAP////+/4f//////wAAAAAAAAAAAAAE/gAAAAAAAAP////+f8wH/////gAAAAAAAAAAAAAAfgAAAAAAAAf/////P/4D/////IAAAAAAAAAAAAAAPgAQAAAAAAf/////v/8D/+f/4AAAAAAAAAAAAAAAPgwOAAAAAAf/////n/4Af8P+AAAAAAAAAAAAAAAAHxwAwAAAAAf/////n/wAfwH+wAAAAAAAAAAAAAAAB/gAAAAAAAf/////z/gAfgH+AMAAAAAAAAAAAAAAAT8AAAAAAAf/////z+AAfAF/AIAAAAAAAAAAAAAAAB+AAAAAAAf/////94AAOAB/gIAAAAAAAAAAAAAAAAMAAAAAAAf//////AAAOAA/gCAAAAAAAAAAAAAAAAEBQAAAAAP/////+MAAGAAHAFAAAAAAAAAAAAAAAACDfgAAAAH//////8AAGAACAAAAAAAAAAAAAAAAAABP/wAAAAH//////4AABABgADAAAAAAAAAAAAAAAAAP/4AAAAD//////4AABAAQABAAAAAAAAAAAAAAAAAP//gAAAA/H////wAAAACYBgAAAAAAAAAAAAAAAAAH//wAAAAAA////wAAAADYDAAAAAAAAAAAAAAAAAAP//wAAAAAA////gAAAABoPgAAAAAAAAAAAAAAAAAf//4AAAAAA///+AAAAAA4fuQAAAAAAAAAAAAAAAA///+AAAAAA///8AAAAAAYfASAAAAAAAAAAAAAAAA////AAAAAA///4AAAAAAcfYBYAAAAAAAAAAAAAAA////8AAAAAf//4AAAAAAOCEh/AAAAAAAAAAAAAAA/////AAAAAP//wAAAAAAGAAAPgAAAAAAAAAAAAAA/////gAAAAP//wAAAAAADIABPwIAAAAAAAAAAAAAf////gAAAAH//wAAAAAAAOAAPYCAAAAAAAAAAAAAP////AAAAAH//4AAAAAAAACAAMAAAAAAAAAAAAAAP///+AAAAAH//4AAAAAAAAAAAAAAAAAAAAAAAAAAH///+AAAAAH//4AAAAAAAAAHhAAAAAAAAAAAAAAAH///8AAAAAP//4IAAAAAAAAvjAAAAAAAAAAAAAAAD///8AAAAAP//4cAAAAAAAB/jgAAAAAAAAAAAAAAA///8AAAAAP//h4AAAAAAAD/7gAAAAAAAAAAAAAAAf//8AAAAAP//B4AAAAAAAH//wAAAAAAAAAAAAAAAf//4AAAAAH/+AwAAAAAAAf//4AQAAAAAAAAAAAAAf//4AAAAAH//BwAAAAAAB///8AIAAAAAAAAAAAAAf//gAAAAAD//BwAAAAAAD///+AAAAAAAAAAAAAAAf/8AAAAAAD/+BgAAAAAAD////AAAAAAAAAAAAAAAf/8AAAAAAD/8AAAAAAAAD////AAAAAAAAAAAAAAAf/8AAAAAAD/8AAAAAAAAD////AAAAAAAAAAAAAAA//4AAAAAAB/4AAAAAAAAB////AAAAAAAAAAAAAAA//wAAAAAAA/wAAAAAAAAB////AAAAAAAAAAAAAAA//gAAAAAAA/gAAAAAAAAB/h//AAAAAAAAAAAAAAA//AAAAAAAA+AAAAAAAAAB+Av+AAAAAAAAAAAAAAA/8AAAAAAAAAAAAAAAAAAAAAP8AAQAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAH8AAIAAAAAAAAAAAB/4AAAAAAAAAAAAAAAAAAAAADQAAOAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAYAAIAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAYAAwAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAADwAACAefH/gAAAAAAAAAAAAAAAAEAAAAAAAAAAAB//8B///////4AAAAAAAAAAAAAAA/AAAAAAAAAAH///8P////////8AAAAAAAAAAAAAB3gAAAAATf//////8//////////+AAAAAAAAAAAgAHgAAAAH////////////////////AAAAAAAB4B////gAAAAP///////////////////4AAAAD////////4AAAAD////////////////////gAAALP///////8AAAAD/////////////////////gAABj////////wAAHg//////////////////////4AAAAD///////8AQ/AB////////////////////+AAAAB//////////AGP//////////////////////AAAAA///////////////////////////////////8A/8AAf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";

const RAD = Math.PI / 180;

// Build the dot lattice once: a Fibonacci sphere, split into land and sea by the mask.
let lattice: { land: Float32Array; sea: Float32Array } | null = null;
function getLattice() {
  if (lattice) return lattice;
  const bytes = Uint8Array.from(atob(MASK), (c) => c.charCodeAt(0));
  const isLand = (lat: number, lng: number) => {
    const r = Math.min(MASK_H - 1, Math.floor(((90 - lat) / 180) * MASK_H));
    const c = Math.min(MASK_W - 1, Math.floor(((lng + 180) / 360) * MASK_W));
    const i = r * MASK_W + c;
    return (bytes[i >> 3] >> (7 - (i & 7))) & 1;
  };
  const N = 5200;
  const land: number[] = [];
  const sea: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    // Back to lat/lng so we can look the point up on the mask.
    const lat = Math.asin(y) / RAD;
    const lng = Math.atan2(x, z) / RAD;
    (isLand(lat, lng) ? land : sea).push(x, y, z);
  }
  lattice = { land: new Float32Array(land), sea: new Float32Array(sea) };
  return lattice;
}

function toVec(lat: number, lng: number): [number, number, number] {
  const p = lat * RAD;
  const l = lng * RAD;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
}

/**
 * An interactive dotted globe you drag to spin, with pulsing markers and animated arcs.
 *
 * Drawn on a canvas from real coastline data, with momentum, hover labels and no dependencies.
 */
export function DotGlobe({
  markers = [],
  arcs = [],
  autoRotate = true,
  speed = 0.12,
  initial = { lat: 18, lng: 12 },
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Places to mark, by latitude and longitude. */
  markers?: GlobeMarker[];
  /** Pairs of indexes into `markers` to join with an animated arc. */
  arcs?: [number, number][];
  /** Spin slowly when you are not dragging. */
  autoRotate?: boolean;
  /** Spin speed in radians per second. */
  speed?: number;
  /** The point facing you at first. */
  initial?: { lat: number; lng: number };
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ markers, arcs, autoRotate, speed });

  React.useEffect(() => {
    live.current = { markers, arcs, autoRotate, speed };
  }, [markers, arcs, autoRotate, speed]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const { land, sea } = getLattice();

    let w = 1;
    let h = 1;
    let dpr = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(r.width, 1);
      h = Math.max(r.height, 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    };

    // Camera: the longitude and latitude facing you, plus spin momentum.
    const cam = { lng: initial.lng, lat: initial.lat, vLng: 0, vLat: 0 };
    const drag = { on: false, x: 0, y: 0, lastMove: 0, idleSince: 0 };
    const hover = { i: -1 };

    // Colours come from the page: text colour for the land, --accent for markers and arcs.
    const ink = { key: "", text: "#1b1a17", accent: "#1b1a17", bg: "#ffffff" };
    const readInk = () => {
      const key = document.documentElement.className;
      if (key === ink.key) return;
      ink.key = key;
      const cs = getComputedStyle(host);
      ink.text = cs.color || ink.text;
      ink.accent = cs.getPropertyValue("--accent").trim() || ink.text;
      ink.bg = cs.getPropertyValue("--canvas").trim() || ink.bg;
    };

    // Rotate a unit vector so the camera's longitude and latitude face the viewer.
    const project = (
      x: number,
      y: number,
      z: number,
      cl: number,
      sl: number,
      ct: number,
      st: number,
    ) => {
      const x1 = x * cl - z * sl;
      const z1 = x * sl + z * cl;
      return [x1, y * ct - z1 * st, y * st + z1 * ct] as const;
    };

    const draw = (t: number) => {
      readInk();
      const cfg = live.current;
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const L = cam.lng * RAD;
      const T = cam.lat * RAD;
      const cl = Math.cos(L);
      const sl = Math.sin(L);
      const ct = Math.cos(T);
      const st = Math.sin(T);

      // The globe's body: a faint disc with a soft rim.
      ctx.globalAlpha = 1;
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      body.addColorStop(0, "rgba(128,128,128,0.10)");
      body.addColorStop(1, "rgba(128,128,128,0.02)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ink.text;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = ink.text;
      // Sea dots: tiny squares that give the sphere its volume.
      for (let i = 0; i < sea.length; i += 3) {
        const [px, py, pz] = project(sea[i], sea[i + 1], sea[i + 2], cl, sl, ct, st);
        if (pz <= 0) continue;
        ctx.globalAlpha = 0.05 + 0.1 * pz;
        const s = 1.1;
        ctx.fillRect(cx + px * R - s / 2, cy - py * R - s / 2, s, s);
      }
      // Land dots: bigger and brighter toward the middle of the disc.
      for (let i = 0; i < land.length; i += 3) {
        const [px, py, pz] = project(land[i], land[i + 1], land[i + 2], cl, sl, ct, st);
        if (pz <= 0) continue;
        ctx.globalAlpha = 0.28 + 0.72 * pz;
        ctx.beginPath();
        ctx.arc(cx + px * R, cy - py * R, R * 0.0072 * (0.55 + 0.75 * pz), 0, Math.PI * 2);
        ctx.fill();
      }

      const vecs = cfg.markers.map((m) => toVec(m.lat, m.lng));
      const place = (v: readonly number[], lift = 1) => {
        const [px, py, pz] = project(v[0] * lift, v[1] * lift, v[2] * lift, cl, sl, ct, st);
        return { x: cx + px * R, y: cy - py * R, z: pz };
      };

      // Arcs: great circles that rise off the surface, with a dashed trail and a travelling spark.
      ctx.lineCap = "round";
      cfg.arcs.forEach(([a, b], k) => {
        const va = vecs[a];
        const vb = vecs[b];
        if (!va || !vb) return;
        const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
        const ang = Math.acos(dot);
        if (ang < 0.01) return;
        const sinA = Math.sin(ang);
        const pts: { x: number; y: number; z: number }[] = [];
        const STEPS = 56;
        for (let s = 0; s <= STEPS; s++) {
          const u = s / STEPS;
          const ka = Math.sin((1 - u) * ang) / sinA;
          const kb = Math.sin(u * ang) / sinA;
          const lift = 1 + Math.sin(Math.PI * u) * 0.28 * (ang / Math.PI + 0.15);
          pts.push(
            place(
              [ka * va[0] + kb * vb[0], ka * va[1] + kb * vb[1], ka * va[2] + kb * vb[2]],
              lift,
            ),
          );
        }
        ctx.strokeStyle = ink.accent;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 7]);
        ctx.lineDashOffset = reduce ? 0 : -(t / 60);
        ctx.beginPath();
        let pen = false;
        for (const p of pts) {
          if (p.z > 0) {
            if (!pen) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            pen = true;
          } else pen = false;
        }
        ctx.globalAlpha = 0.65;
        ctx.stroke();
        ctx.setLineDash([]);
        if (!reduce) {
          const f = (t / 2600 + k * 0.31) % 1;
          const p = pts[Math.min(STEPS, Math.floor(f * STEPS))];
          if (p && p.z > 0) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = ink.accent;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Markers: a solid dot with a ring that pulses outward.
      vecs.forEach((v, i) => {
        const p = place(v);
        if (p.z <= 0.02) return;
        const pulse = reduce ? 0.4 : (t / 1700 + i * 0.37) % 1;
        ctx.strokeStyle = ink.accent;
        ctx.globalAlpha = (1 - pulse) * 0.6;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + pulse * 13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = ink.accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, hover.i === i ? 4.6 : 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Hover label.
      const hm = cfg.markers[hover.i];
      if (hm?.label) {
        const p = place(vecs[hover.i]);
        if (p.z > 0.02) {
          ctx.font = "500 12px system-ui, sans-serif";
          const tw = ctx.measureText(hm.label).width;
          const bx = Math.min(Math.max(p.x - tw / 2 - 9, 4), w - tw - 22);
          const by = p.y - 34;
          ctx.globalAlpha = 1;
          ctx.fillStyle = ink.text;
          ctx.beginPath();
          ctx.roundRect(bx, by, tw + 18, 24, 12);
          ctx.fill();
          ctx.fillStyle = ink.bg;
          ctx.fillText(hm.label, bx + 9, by + 16);
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let running = false;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const cfg = live.current;
      if (!drag.on) {
        // Momentum decays, then the slow auto-spin takes over again.
        cam.lng += cam.vLng * dt;
        cam.lat = Math.max(-75, Math.min(75, cam.lat + cam.vLat * dt));
        const decay = Math.exp(-dt * 2.6);
        cam.vLng *= decay;
        cam.vLat *= decay;
        const idle = now - drag.idleSince > 1800;
        if (cfg.autoRotate && idle && !reduce) cam.lng -= (cfg.speed / RAD) * dt;
        // Ease the tilt back toward a gentle default so it never stays upside down.
        if (idle && !reduce) cam.lat += (initial.lat - cam.lat) * (1 - Math.exp(-dt * 0.8));
      }
      draw(now);
    };
    const loop = (now: number) => {
      step(now);
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const nearest = (clientX: number, clientY: number) => {
      const r = cv.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      const R = Math.min(w, h) * 0.46;
      const L = cam.lng * RAD;
      const T = cam.lat * RAD;
      let best = -1;
      let bd = 16 * 16;
      live.current.markers.forEach((m, i) => {
        const v = toVec(m.lat, m.lng);
        const [px, py, pz] = project(
          v[0],
          v[1],
          v[2],
          Math.cos(L),
          Math.sin(L),
          Math.cos(T),
          Math.sin(T),
        );
        if (pz <= 0.02) return;
        const d = (w / 2 + px * R - x) ** 2 + (h / 2 - py * R - y) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };

    const onDown = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId);
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.lastMove = performance.now();
      cam.vLng = 0;
      cam.vLat = 0;
      cv.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) {
        const i = nearest(e.clientX, e.clientY);
        if (i !== hover.i) {
          hover.i = i;
          cv.style.cursor = i >= 0 ? "pointer" : "grab";
          if (reduce || !running) draw(performance.now());
        }
        return;
      }
      const now = performance.now();
      const dt = Math.max((now - drag.lastMove) / 1000, 0.001);
      const k = 0.32 * (180 / Math.min(w, h));
      const dLng = -(e.clientX - drag.x) * k;
      const dLat = (e.clientY - drag.y) * k;
      cam.lng += dLng;
      cam.lat = Math.max(-75, Math.min(75, cam.lat + dLat));
      cam.vLng = dLng / dt;
      cam.vLat = dLat / dt;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.lastMove = now;
      if (reduce) draw(now);
    };
    const onUp = () => {
      drag.on = false;
      drag.idleSince = performance.now();
      cv.style.cursor = "grab";
      if (performance.now() - drag.lastMove > 90) {
        cam.vLng = 0;
        cam.vLat = 0;
      }
      if (reduce) {
        cam.vLng = 0;
        cam.vLat = 0;
      }
    };
    const onLeave = () => {
      if (hover.i !== -1) {
        hover.i = -1;
        if (reduce || !running) draw(performance.now());
      }
    };

    cv.style.cursor = "grab";
    resize();
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, initial.lat, initial.lng]);

  return (
    <div
      {...props}
      ref={wrap}
      role="img"
      aria-label={props["aria-label"] ?? "Interactive globe. Drag to rotate."}
      className={cn("relative aspect-square w-full text-ink", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full touch-none" />
      {markers.some((m) => m.label) && (
        <ul className="sr-only">
          {markers.map((m, i) => (
            <li key={i}>{m.label ?? `${m.lat}, ${m.lng}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
