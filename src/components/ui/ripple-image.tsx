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
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uTime;
uniform float uStrength;
uniform vec4 uR[8];

vec2 cover(vec2 uv){
  float rs = uRes.x / uRes.y;
  float is = uImg.x / uImg.y;
  vec2 s = rs > is ? vec2(1.0, is / rs) : vec2(rs / is, 1.0);
  return (uv - 0.5) * s + 0.5;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 off = vec2(0.0);
  float shine = 0.0;
  for (int i = 0; i < 8; i++){
    vec4 r = uR[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 3.0) continue;
    vec2 d = uv - r.xy;
    d.x *= aspect;
    float dist = length(d);
    float w = dist - age * 0.5;
    float env = exp(-w * w * 190.0) * exp(-age * 1.5) * r.w;
    float wave = sin(w * 52.0);
    off += (d / (dist + 0.0001)) * wave * env * 0.024;
    shine += wave * env;
  }
  off *= uStrength;
  off.x /= aspect;
  vec2 t = clamp(cover(uv + off), 0.0, 1.0);
  float cr = texture2D(uTex, clamp(cover(uv + off * 1.35), 0.0, 1.0)).r;
  float cg = texture2D(uTex, t).g;
  float cb = texture2D(uTex, clamp(cover(uv + off * 0.65), 0.0, 1.0)).b;
  vec3 col = vec3(cr, cg, cb) + shine * 0.11 * uStrength;
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * An image that ripples like liquid wherever the pointer moves: refraction, colour splitting and a glint on every crest.
 *
 * It is a real `<img>` underneath, so it works without WebGL, without JavaScript and with reduced motion.
 */
export function RippleImage({
  src,
  alt,
  strength = 1,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  src: string;
  /** Describes the image. Required, because this is content, not decoration. */
  alt: string;
  /** How hard the ripples bend the image. 0 turns them off. */
  strength?: number;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ strength });

  React.useEffect(() => {
    live.current = { strength };
  }, [strength]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv || reduce) return;
    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, source);
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
    const uImg = gl.getUniformLocation(prog, "uImg");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uStrength = gl.getUniformLocation(prog, "uStrength");
    const uR = gl.getUniformLocation(prog, "uR");

    // A ring buffer of ripples: x, y (0 to 1), start time (s), amplitude.
    const ripples = new Float32Array(32).fill(0);
    for (let i = 0; i < 8; i++) ripples[i * 4 + 2] = -100;
    let head = 0;
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    const spawn = (x: number, y: number, amp: number) => {
      ripples.set([x, y, now(), amp], head * 4);
      head = (head + 1) % 8;
      kick();
    };

    let ready = false;
    let imgW = 1;
    let imgH = 1;
    let w = 1;
    let h = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(Math.round(r.width * dpr), 2);
      h = Math.max(Math.round(r.height * dpr), 2);
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = () => {
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uImg, imgW, imgH);
      gl.uniform1f(uTime, now());
      gl.uniform1f(uStrength, live.current.strength);
      gl.uniform4fv(uR, ripples);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // Render only while a ripple is alive, so an idle image costs nothing.
    let raf = 0;
    const frame = () => {
      draw();
      const t = now();
      let alive = false;
      for (let i = 0; i < 8; i++) if (t - ripples[i * 4 + 2] < 3) alive = true;
      raf = alive ? requestAnimationFrame(frame) : 0;
    };
    function kick() {
      if (ready && !raf) raf = requestAnimationFrame(frame);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      imgW = img.naturalWidth || 1;
      imgH = img.naturalHeight || 1;
      ready = true;
      resize();
      draw();
      cv.style.opacity = "1";
    };
    img.src = src;

    let lx = 0;
    let ly = 0;
    let lt = 0;
    const onMove = (e: PointerEvent) => {
      if (!ready) return;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const moved = Math.hypot(x - lx, y - ly);
      const t = performance.now();
      if (moved > 38 && t - lt > 55) {
        const speed = Math.min(moved / Math.max(t - lt, 1), 3);
        spawn(x / r.width, 1 - y / r.height, 0.55 + Math.min(speed, 1.6) * 0.45);
        lx = x;
        ly = y;
        lt = t;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!ready) return;
      const r = host.getBoundingClientRect();
      spawn((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height, 1.6);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      resize();
      if (ready) draw();
    });
    ro.observe(host);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      img.onload = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, reduce]);

  return (
    <div
      {...props}
      ref={wrap}
      className={cn("relative aspect-[4/3] w-full overflow-hidden", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-500"
      />
    </div>
  );
}
