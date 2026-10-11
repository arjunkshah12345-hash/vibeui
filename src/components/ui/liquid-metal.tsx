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

const COUNT = 8; // blobs in the shader: seven drift on their own, one chases the pointer

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform vec3 uB[${COUNT}];
uniform vec3 uTint;
uniform float uTintAmount;

// The metaball field: every blob adds a bump, and the surface sits where the sum reaches 1.
float field(vec2 p){
  float f = 0.0;
  for (int i = 0; i < ${COUNT}; i++){
    vec3 b = uB[i];
    vec2 d = p - b.xy;
    f += (b.z * b.z) / (dot(d, d) + 0.0004);
  }
  return f;
}
// How high the liquid stands. For a lone blob the field is R^2 / r^2, which makes this sqrt an exact sphere cap;
// merged blobs fuse into one smooth skin.
float height(vec2 p){
  float f = field(p);
  return f > 1.0 ? sqrt(1.0 - 1.0 / f) * 0.24 : 0.0;
}
// What a polished chrome blob would reflect: a soft sky, a sharp horizon, a bright softbox.
vec3 environment(vec3 r){
  // The horizon sits below the middle of a blob, so tops reflect sky and bottoms reflect floor.
  float h = r.y * 1.15 + r.x * 0.22 + 0.3;
  vec3 sky = mix(vec3(0.7, 0.76, 0.9), vec3(1.0), smoothstep(0.0, 0.9, h));
  vec3 ground = mix(vec3(0.07, 0.075, 0.1), vec3(0.42, 0.4, 0.38), smoothstep(-1.1, 0.0, h));
  vec3 env = mix(ground, sky, smoothstep(-0.025, 0.025, h));
  env += vec3(1.0, 0.98, 0.94) * 0.9 * exp(-pow((h - 0.66) / 0.1, 2.0));
  env *= 0.94 + 0.06 * sin(r.x * 3.0);
  return env;
}
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 2.0;
  float e = 2.2 / uRes.y;
  float f = field(p);
  float fx = field(p + vec2(e, 0.0));
  float fy = field(p + vec2(0.0, e));
  float edge = length(vec2(fx - f, fy - f)) + 0.002;
  float cover = smoothstep(1.0 - edge, 1.0 + edge, f);
  if (cover <= 0.001) { gl_FragColor = vec4(0.0); return; }

  float h0 = height(p);
  float hx = height(p + vec2(e, 0.0));
  float hy = height(p + vec2(0.0, e));
  vec3 n = normalize(vec3(-(hx - h0) / e, -(hy - h0) / e, 1.0));
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  vec3 col = environment(r);
  col = mix(col, col * uTint * 1.25, uTintAmount);
  col += pow(1.0 - n.z, 4.0) * 0.25;
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col * cover, cover);
}`;

// Resolve any CSS colour to 0-1 RGB through a 1px canvas.
function toRgb(color: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return [1, 1, 1];
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/**
 * A blob of liquid chrome that drifts, merges and splits, and chases your cursor.
 *
 * A WebGL shader reflects a studio environment off a metaball surface. Click to make it surge. Falls back to nothing without WebGL.
 */
export function LiquidMetal({
  tint,
  interactive = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Any CSS colour to stain the chrome, for gold, copper or ink. Silver by default. */
  tint?: string;
  /** Let the pointer pull one blob around. */
  interactive?: boolean;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ tint, interactive });

  React.useEffect(() => {
    live.current = { tint, interactive };
  }, [tint, interactive]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    const gl = cv.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
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
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uB = gl.getUniformLocation(prog, "uB");
    const uTint = gl.getUniformLocation(prog, "uTint");
    const uTintAmount = gl.getUniformLocation(prog, "uTintAmount");
    gl.clearColor(0, 0, 0, 0);

    let w = 1;
    let h = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = Math.max(Math.round(host.offsetWidth * dpr), 2);
      h = Math.max(Math.round(host.offsetHeight * dpr), 2);
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };

    // The blobs: seven wander on slow orbits of their own, the last one follows the pointer.
    const wander = Array.from({ length: COUNT - 1 }, (_, i) => ({
      ax: 0.35 + (i % 4) * 0.13,
      ay: 0.2 + ((i * 3) % 5) * 0.07,
      sx: 0.21 + i * 0.047,
      sy: 0.17 + i * 0.061,
      px: i * 1.9,
      py: i * 2.7,
      r: 0.2 + (i % 3) * 0.035,
    }));
    const me = { x: 0, y: 0, tx: 0, ty: 0, r: 0.2, over: false, surge: 0 };
    const out = new Float32Array(COUNT * 3);
    let tintKey = "";
    let tintRgb: [number, number, number] = [1, 1, 1];

    const draw = (time: number) => {
      const aspect = w / h;
      for (let i = 0; i < COUNT - 1; i++) {
        const b = wander[i];
        out[i * 3] = Math.cos(time * b.sx + b.px) * b.ax * aspect;
        out[i * 3 + 1] = Math.sin(time * b.sy + b.py) * b.ay * 1.4;
        out[i * 3 + 2] = b.r;
      }
      // With nobody pointing, the last blob also wanders, so the piece is never static.
      if (!me.over) {
        me.tx = Math.cos(time * 0.33) * 0.55 * aspect;
        me.ty = Math.sin(time * 0.41) * 0.35;
      }
      out[(COUNT - 1) * 3] = me.x;
      out[(COUNT - 1) * 3 + 1] = me.y;
      out[(COUNT - 1) * 3 + 2] = me.r + me.surge;

      const t = live.current.tint ?? "";
      if (t !== tintKey) {
        tintKey = t;
        tintRgb = t ? toRgb(t) : [1, 1, 1];
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, w, h);
      gl.uniform3fv(uB, out);
      gl.uniform3f(uTint, tintRgb[0], tintRgb[1], tintRgb[2]);
      gl.uniform1f(uTintAmount, t ? 0.9 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    let time = 4.2;
    let last = performance.now();
    let running = false;
    let visible = true;
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      time += dt;
      const k = 1 - Math.exp(-dt * (me.over ? 7 : 1.6));
      me.x += (me.tx - me.x) * k;
      me.y += (me.ty - me.y) * k;
      me.surge *= Math.exp(-dt * 3.2);
      draw(time);
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toWorld = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const u = (e.clientX - r.left) / (r.width || 1);
      const v = (e.clientY - r.top) / (r.height || 1);
      const aspect = host.offsetWidth / (host.offsetHeight || 1);
      return { x: (u * 2 - 1) * aspect, y: -(v * 2 - 1) };
    };
    const onMove = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      const p = toWorld(e);
      me.tx = p.x;
      me.ty = p.y;
      me.over = true;
    };
    const onLeave = () => {
      me.over = false;
    };
    const onDown = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      onMove(e);
      me.surge = 0.2;
    };

    resize();
    me.x = me.tx = Math.cos(time * 0.33) * 0.55;
    me.y = me.ty = Math.sin(time * 0.41) * 0.35;
    draw(time);
    const ro = new ResizeObserver(() => {
      resize();
      draw(time);
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
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduce]);

  return (
    <div
      {...props}
      ref={wrap}
      role="img"
      aria-label={props["aria-label"] ?? "A blob of liquid chrome"}
      className={cn("relative h-72 w-full touch-pan-y overflow-hidden", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
