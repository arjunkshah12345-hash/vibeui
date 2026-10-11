"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

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

// Where each state settles: swirl speed (rad/s), how far the swirl roams, and halo strength.
const TARGET: Record<OrbState, { speed: number; spread: number; glow: number; breathe: number }> = {
  idle: { speed: 0.2, spread: 0.35, glow: 0.45, breathe: 0.02 },
  listening: { speed: 0.55, spread: 0.6, glow: 0.7, breathe: 0.016 },
  thinking: { speed: 2.1, spread: 0.95, glow: 0.6, breathe: 0.01 },
  speaking: { speed: 0.95, spread: 0.8, glow: 0.85, breathe: 0.008 },
};

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// A glass sphere with a flowing interior, drawn analytically: no geometry, just a fragment shader.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uAngle;
uniform float uLevel;
uniform float uSpread;
uniform float uGlow;
uniform vec3 uBase;
uniform vec3 uMid;
uniform vec3 uLight;
uniform vec3 uCore;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + vec2(11.0, 7.0); a *= 0.5; }
  return v;
}
void main(){
  // The canvas is bigger than the sphere so the halo has room: the sphere has radius 1 here.
  vec2 p = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y / 0.735;
  float r = length(p);
  float edge = 1.0 - smoothstep(0.985, 1.0, r);
  float halo = exp(-max(r - 1.0, 0.0) * 5.2) * uGlow * (0.5 + uLevel * 0.7);
  halo *= 1.0 - smoothstep(1.0, 1.34, r); // zero before the canvas edge: no visible box
  vec3 n = vec3(p, sqrt(max(0.0, 1.0 - r * r)));

  // The interior flows: rotate the sampling space, then warp it twice for liquid-looking swirls.
  float ca = cos(uAngle); float sa = sin(uAngle);
  vec2 q = mat2(ca, -sa, sa, ca) * n.xy;
  vec2 w = q * (1.25 + uSpread * 0.9);
  float a = fbm(w * 1.1 + vec2(0.0, uTime * 0.07));
  float b = fbm(w * 1.7 + a * 2.0 + vec2(uTime * 0.05, 3.1));
  float c = fbm(w * 2.3 + vec2(b, a) * 2.4 - uTime * 0.04);

  float tone = smoothstep(0.22, 0.82, c);
  vec3 col = tone < 0.5 ? mix(uBase, uMid, tone * 2.0) : mix(uMid, uLight, (tone - 0.5) * 2.0);
  col = mix(col, uCore, pow(clamp(b, 0.0, 1.0), 3.0) * (0.5 + uLevel * 0.9));
  col *= 0.82 + 0.3 * a;
  col += uCore * uLevel * 0.2 * (1.0 - r * r);

  // Glass: a bright fresnel rim, a hard specular glint and a soft bounce of light from below.
  float fres = pow(1.0 - n.z, 2.3);
  col += mix(uLight, uCore, 0.55) * fres * (0.75 + uLevel * 0.6);
  col += uCore * smoothstep(0.94, 1.0, r) * 0.22;
  vec3 L = normalize(vec3(-0.45, 0.62, 0.65));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float nh = max(dot(n, H), 0.0);
  col += vec3(1.0) * (pow(nh, 80.0) * 0.95 + pow(nh, 9.0) * 0.1);
  col *= 0.72 + 0.28 * smoothstep(-1.0, 0.7, n.y);
  col += uLight * 0.12 * pow(max(dot(n, normalize(vec3(0.5, -0.7, 0.5))), 0.0), 3.0);

  vec3 haloCol = mix(uLight, uMid, 0.4);
  vec3 rgb = col * edge + haloCol * (halo * 0.8) * (1.0 - edge);
  float alpha = edge + halo * 0.8 * (1.0 - edge);
  gl_FragColor = vec4(rgb, alpha);
}`;

// Resolve any CSS colour to 0-1 RGB through a 1px canvas.
function toRgb(color: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return [0.5, 0.5, 0.5];
  ctx.fillStyle = "#808080";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

/**
 * A living orb for voice and AI moments: a glass sphere whose inside swirls faster as it moves from idle to speaking.
 *
 * It swells with `level` and is tinted by `--accent`, so it retints with your theme. Falls back to CSS without WebGL.
 */
export function AiOrb({
  state = "idle",
  level = 0,
  size = 168,
  label,
  className,
}: {
  /** What the assistant is doing. Changes are eased, never snapped. */
  state?: OrbState;
  /** Live loudness from 0 to 1 (microphone or voice output). It swells the orb. */
  level?: number;
  /** Diameter of the sphere in px. */
  size?: number;
  /** Accessible description. Defaults to the state. */
  label?: string;
  className?: string;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const fallback = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const want = React.useRef({ state, level });
  const snap = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    want.current = { state, level };
  }, [state, level]);

  React.useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    const css = fallback.current;
    if (!el || !cv || !css) return;

    const gl = cv.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    let u: Record<string, WebGLUniformLocation | null> = {};
    let live = false;
    if (gl) {
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
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const loc = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        u = Object.fromEntries(
          [
            "uRes",
            "uTime",
            "uAngle",
            "uLevel",
            "uSpread",
            "uGlow",
            "uBase",
            "uMid",
            "uLight",
            "uCore",
          ].map((n) => [n, gl.getUniformLocation(prog, n)]),
        );
        gl.clearColor(0, 0, 0, 0);
        live = true;
      }
    }

    // Colours come from the page's --accent, in a three-step ramp from shadow to light.
    const ink = {
      key: "",
      base: [0.1, 0.1, 0.1],
      mid: [0.3, 0.3, 0.3],
      light: [0.8, 0.8, 0.8],
      core: [1, 1, 1],
    };
    const readInk = () => {
      const key =
        document.documentElement.className +
        "|" +
        getComputedStyle(el).getPropertyValue("--accent");
      if (key === ink.key) return;
      ink.key = key;
      const accent = toRgb(getComputedStyle(el).getPropertyValue("--accent").trim() || "#1b1a17");
      ink.base = mix(accent, [0, 0, 0], 0.62);
      ink.mid = accent;
      ink.light = mix(accent, [1, 1, 1], 0.72);
      ink.core = mix(accent, [1, 1, 1], 0.94);
    };

    const start = TARGET[want.current.state];
    const cur = {
      speed: start.speed,
      spread: start.spread,
      glow: start.glow,
      lvl: 0,
      angle: 0,
      time: 3.7,
    };

    const fit = () => {
      if (!live || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.max(Math.round(el.offsetWidth * 1.36 * dpr), 2);
      if (cv.width !== px) {
        cv.width = px;
        cv.height = px;
        gl.viewport(0, 0, px, px);
      }
    };

    const draw = (breathing: number) => {
      const scale = 1 + cur.lvl * 0.1 + breathing;
      el.style.setProperty("--sc", scale.toFixed(4));
      if (live && gl) {
        readInk();
        fit();
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.uRes, cv.width, cv.height);
        gl.uniform1f(u.uTime, cur.time);
        gl.uniform1f(u.uAngle, cur.angle);
        gl.uniform1f(u.uLevel, cur.lvl);
        gl.uniform1f(u.uSpread, cur.spread);
        gl.uniform1f(u.uGlow, cur.glow);
        gl.uniform3fv(u.uBase, ink.base);
        gl.uniform3fv(u.uMid, ink.mid);
        gl.uniform3fv(u.uLight, ink.light);
        gl.uniform3fv(u.uCore, ink.core);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        cv.style.opacity = "1";
        css.style.visibility = "hidden";
      } else {
        // No WebGL: drive the CSS orb with the same numbers.
        css.style.setProperty("--a", `${((cur.angle * 180) / Math.PI) % 36000}deg`);
        css.style.setProperty("--sp", cur.spread.toFixed(3));
        css.style.setProperty("--gl", cur.glow.toFixed(3));
      }
    };

    // Reduced motion: no loop. Jump straight to the pose for the current state and level.
    snap.current = () => {
      const goal = TARGET[want.current.state];
      Object.assign(cur, { speed: goal.speed, spread: goal.spread, glow: goal.glow });
      cur.lvl = Math.min(Math.max(want.current.level, 0), 1);
      draw(0);
    };

    let raf = 0;
    let last = performance.now();
    let running = false;
    let visible = true;
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const goal = TARGET[want.current.state];
      const ease = (rate: number) => 1 - Math.exp(-dt * rate);
      cur.speed += (goal.speed - cur.speed) * ease(2.2);
      cur.spread += (goal.spread - cur.spread) * ease(2.2);
      cur.glow += (goal.glow - cur.glow) * ease(2.2);
      cur.lvl += (Math.min(Math.max(want.current.level, 0), 1) - cur.lvl) * ease(14);
      cur.angle += dt * cur.speed;
      cur.time += dt;
      draw(Math.sin(t / 1400) * goal.breathe);
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const halt = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    snap.current();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) run();
      else halt();
    });
    io.observe(el);
    const onVisibility = () => {
      if (document.hidden) halt();
      else if (visible) run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      halt();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      snap.current = null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduce]);

  // With reduced motion there is no loop, so repaint the held pose when the state or level changes.
  React.useEffect(() => {
    if (reduce) snap.current?.();
  }, [reduce, state, level]);

  const a = "var(--accent)";
  return (
    <div
      ref={root}
      role="img"
      aria-label={label ?? `Assistant ${state}`}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size, "--sc": 1 } as React.CSSProperties}
    >
      {/* the shader orb: a canvas larger than the sphere, so its halo can spill out */}
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute opacity-0 transition-opacity duration-500"
        style={{ inset: "-18%", width: "136%", height: "136%", transform: "scale(var(--sc))" }}
      />

      {/* the CSS fallback: shown until (and unless) WebGL takes over */}
      <div
        ref={fallback}
        aria-hidden
        className="absolute inset-0"
        style={
          {
            "--a": "0deg",
            "--sp": 0.5,
            "--gl": 0.45,
            transform: "scale(var(--sc))",
          } as React.CSSProperties
        }
      >
        <div
          className="absolute rounded-full blur-2xl"
          style={{
            inset: "-16%",
            opacity: "var(--gl)",
            background: `radial-gradient(closest-side, color-mix(in oklab, ${a} 70%, transparent), transparent)`,
          }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 40%, color-mix(in oklab, ${a} 88%, var(--canvas)), color-mix(in oklab, ${a} 96%, black) 78%)`,
            boxShadow: `0 26px 56px -20px color-mix(in oklab, ${a} 65%, transparent), inset 0 0 0 1px rgb(255 255 255 / 0.18), inset 0 -14px 30px rgb(0 0 0 / 0.28), inset 0 10px 22px rgb(255 255 255 / 0.2)`,
          }}
        >
          {[74, 64, 58, 52].map((s, i) => (
            <span
              key={s}
              className="absolute rounded-full"
              style={{
                width: `${s}%`,
                height: `${s}%`,
                left: `${(100 - s) / 2}%`,
                top: `${(100 - s) / 2}%`,
                background: `radial-gradient(circle, color-mix(in oklab, ${a} ${[6, 20, 10, 34][i]}%, var(--canvas)) 0%, transparent 68%)`,
                filter: "blur(10px)",
                transform: `rotate(calc(var(--a) * ${[1, -1.35, 1.8, -0.8][i]})) translateX(calc(var(--sp) * ${[34, 29, 37, 24][i]}%))`,
              }}
            />
          ))}
          <span
            className="absolute rounded-full"
            style={{
              left: "14%",
              top: "7%",
              width: "52%",
              height: "34%",
              background:
                "radial-gradient(ellipse at 40% 35%, rgb(255 255 255 / 0.7), transparent 70%)",
              filter: "blur(5px)",
              transform: "rotate(-24deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
