"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uPull;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + vec2(17.0, 9.0); a *= 0.5; }
  return v;
}
void main(){
  float s = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / s;
  vec2 m = (uMouse - 0.5 * uRes) / s;
  float t = uTime * 0.1;
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, 1.3) - t));
  float d = length(p - m);
  q += (m - p) * exp(-d * 2.6) * 0.5 * uPull;
  vec2 r = vec2(fbm(p * 1.2 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p * 1.2 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.2 * r);
  vec3 col = mix(uC0, uC1, clamp(f * 1.7, 0.0, 1.0));
  col = mix(col, uC2, clamp(length(q) * 1.15, 0.0, 1.0) * 0.9);
  col = mix(col, uC3, smoothstep(0.3, 0.85, r.x * f * 2.8));
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}`;

// Resolve any CSS colour to 0–1 RGB through a 1px canvas.
function toRgb(color: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return [0.5, 0.5, 0.5];
  ctx.fillStyle = "#808080";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const DEFAULT_COLORS = ["#f4f2ee", "#d9d4c9", "#b9b2a5", "#ffffff"];

/**
 * A flowing mesh gradient drawn by a WebGL shader, with no images and no dependencies.
 *
 * It reacts to the pointer, pauses off-screen, and falls back to a CSS gradient without WebGL.
 */
export function MeshGradient({
  colors = DEFAULT_COLORS,
  speed = 1,
  interactive = true,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Four CSS colours, blended from the base to the highlights. */
  colors?: string[];
  /** Flow speed multiplier. 0 freezes it. */
  speed?: number;
  /** Let the gradient bend toward the pointer. */
  interactive?: boolean;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ colors, speed, interactive });

  React.useEffect(() => {
    live.current = { colors, speed, interactive };
  }, [colors, speed, interactive]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uPull = u("uPull");
    const uC = [u("uC0"), u("uC1"), u("uC2"), u("uC3")];

    let w = 1;
    let h = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let k = dpr;
      const px = r.width * r.height * dpr * dpr;
      if (px > 1_100_000) k *= Math.sqrt(1_100_000 / px);
      w = Math.max(Math.round(r.width * k), 2);
      h = Math.max(Math.round(r.height * k), 2);
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, pull: 0, shown: 0 };
    const onMove = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      const r = host.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      mouse.pull = 1;
    };
    const onLeave = () => {
      mouse.pull = 0;
    };

    const cache = new Map<string, [number, number, number]>();
    const toRgbCached = (c: string) => {
      let v = cache.get(c);
      if (!v) {
        v = toRgb(c);
        cache.set(c, v);
      }
      return v;
    };

    let time = 7.3;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    let running = false;

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt * live.current.speed;
      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));
      mouse.shown += (mouse.pull - mouse.shown) * (1 - Math.exp(-dt * 3));
      gl.uniform1f(uPull, mouse.shown);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x * w, mouse.y * h);
      const cols = live.current.colors;
      for (let i = 0; i < 4; i++) {
        const [r, g, b] = toRgbCached(cols[i % cols.length]);
        gl.uniform3f(uC[i], r, g, b);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      cv.style.opacity = "1";
    };

    const loop = (now: number) => {
      draw(now);
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || reduce || live.current.speed === 0) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

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
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduce]);

  const [c0, c1, c2, c3] = [0, 1, 2, 3].map((i) => colors[i % colors.length]);
  const fallback = `radial-gradient(60% 70% at 18% 22%, ${c1}, transparent 70%), radial-gradient(55% 60% at 82% 28%, ${c2}, transparent 70%), radial-gradient(60% 60% at 60% 90%, ${c3}, transparent 70%), ${c0}`;

  return (
    <div
      {...props}
      ref={wrap}
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: fallback, ...props.style }}
    >
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-700"
      />
      {children}
    </div>
  );
}
