"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.";

// Flap colours: the face, the letter, and the light on the upper half.
const TONES = {
  ink: { face: "#1d1c1a", glyph: "#f2eee5", top: "#2b2a27", bottom: "#191816" },
  amber: { face: "#141210", glyph: "#ffb627", top: "#221f1a", bottom: "#100e0c" },
  paper: { face: "#efeae0", glyph: "#16140f", top: "#fbf8f1", bottom: "#e4ded1" },
} as const;

type Palette = (typeof TONES)[keyof typeof TONES];

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

let audio: AudioContext | null = null;
let lastClack = 0;
// A flap landing is a very short, dry click. Many at once make the rattle of a real board.
function clack() {
  const now = performance.now();
  if (now - lastClack < 14) return;
  lastClack = now;
  try {
    audio ??= new AudioContext();
    const a = audio;
    if (a.state === "suspended") void a.resume();
    const len = Math.floor(a.sampleRate * 0.022);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = a.createBufferSource();
    src.buffer = buf;
    const band = a.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1500 + Math.random() * 900;
    band.Q.value = 1.1;
    const g = a.createGain();
    g.gain.value = 0.16;
    src.connect(band).connect(g).connect(a.destination);
    src.start();
  } catch {
    // no audio; the board still turns
  }
}

/**
 * A mechanical departures board: every character is a pair of flaps that turn over through the alphabet.
 *
 * Change `value` and the cells cascade, each one flipping on to the next letter until it lands on the
 * right one, with a settling bounce and shadows that move across the fold as it turns.
 */
export function SplitFlap({
  value,
  length,
  charset = CHARS,
  size = 56,
  tone = "ink",
  stagger = 40,
  sound = false,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What to show. Letters are upper-cased; anything not in `charset` becomes a blank. */
  value: string;
  /** Number of cells. The value is padded with blanks, or cut, to fit. Defaults to its length. */
  length?: number;
  /** The characters a flap can show, in the order it cycles through them. Keep the blank first. */
  charset?: string;
  /** Height of one cell, in px. Everything else scales from it. */
  size?: number;
  /** `ink` is charcoal and warm white, `amber` is the classic orange on black, `paper` is white. */
  tone?: keyof typeof TONES;
  /** Delay between one cell starting and the next, in ms. */
  stagger?: number;
  /** Click as the flaps land. Browsers wait for a first click or tap before they allow sound. */
  sound?: boolean;
  className?: string;
}) {
  const n = length ?? value.length;
  const text = value.toUpperCase().padEnd(n, " ").slice(0, n);
  return (
    <div
      role="img"
      aria-label={value}
      {...props}
      className={cn("inline-flex", className)}
      style={{ gap: Math.max(2, size * 0.05), ...props.style }}
    >
      {Array.from(text, (ch, i) => (
        <Cell
          key={i}
          ch={ch}
          charset={charset}
          delay={i * stagger}
          size={size}
          tone={TONES[tone]}
          sound={sound}
        />
      ))}
    </div>
  );
}

function Half({
  k,
  top,
  initial,
  size,
  tone,
  z,
}: {
  k: string;
  top: boolean;
  initial: string;
  size: number;
  tone: Palette;
  z?: number;
}) {
  const r = size * 0.1;
  return (
    <div
      data-k={k}
      aria-hidden
      className={cn(
        "absolute inset-x-0 h-[calc(50%-0.5px)] overflow-hidden [backface-visibility:hidden]",
        top ? "top-0 origin-bottom" : "bottom-0 origin-top",
      )}
      style={{
        zIndex: z,
        background: `linear-gradient(to bottom, ${top ? tone.top : tone.bottom}, ${tone.face})`,
        borderRadius: top ? `${r}px ${r}px 1px 1px` : `1px 1px ${r}px ${r}px`,
      }}
    >
      <span
        className="absolute inset-x-0 flex h-[200%] items-center justify-center font-sans font-bold leading-none tracking-tight"
        style={{
          [top ? "top" : "bottom"]: 0,
          color: tone.glyph,
          fontSize: size * 0.66,
        }}
      >
        {initial}
      </span>
      {/* shade that deepens across the fold as the flap above it turns */}
      <span
        data-shade
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: top
            ? "linear-gradient(to top, rgb(0 0 0 / 0.55), transparent 80%)"
            : "linear-gradient(to bottom, rgb(0 0 0 / 0.6), transparent 80%)",
        }}
      />
    </div>
  );
}

function Cell({
  ch,
  charset,
  delay,
  size,
  tone,
  sound,
}: {
  ch: string;
  charset: string;
  delay: number;
  size: number;
  tone: Palette;
  sound: boolean;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  // The first character is rendered by React; after that the flaps are changed directly,
  // so React never rewrites a glyph in the middle of a turn.
  const [initial] = React.useState(ch);
  const at = React.useRef(Math.max(0, charset.indexOf(initial)));
  const loud = React.useRef(sound);

  React.useEffect(() => {
    loud.current = sound;
  }, [sound]);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const half = (k: string) => el.querySelector<HTMLElement>(`[data-k='${k}']`)!;
    const baseTop = half("bt");
    const baseBottom = half("bb");
    const flapTop = half("ft");
    const flapBottom = half("fb");
    const shadeTop = baseTop.querySelector<HTMLElement>("[data-shade]")!;
    const shadeBottom = baseBottom.querySelector<HTMLElement>("[data-shade]")!;
    const count = charset.length;
    const target = Math.max(0, charset.indexOf(ch));
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;

    const glyph = (e: HTMLElement, i: number) => {
      e.querySelector("span")!.textContent = charset[i] ?? " ";
    };
    const settle = (i: number) => {
      for (const e of [baseTop, baseBottom, flapTop, flapBottom]) glyph(e, i);
      flapTop.style.visibility = "visible";
      flapBottom.style.visibility = "hidden";
    };

    settle(at.current);
    if (calm) {
      at.current = target;
      settle(target);
      return;
    }

    const run = async () => {
      if (delay) await sleep(delay);
      while (alive && at.current !== target) {
        const left = (target - at.current + count) % count;
        // Far to go: turn faster. Close: let each flap read, and bounce on the last one.
        const dur = Math.min(80, Math.max(32, 960 / left));
        const last = left === 1;
        const next = (at.current + 1) % count;
        glyph(baseTop, next);
        glyph(baseBottom, at.current);
        glyph(flapTop, at.current);
        glyph(flapBottom, next);
        flapTop.style.visibility = "visible";
        flapBottom.style.visibility = "hidden";

        // The top flap falls forward; the lower half darkens as it is covered.
        const shade = shadeBottom.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: dur,
          easing: "ease-in",
          fill: "forwards",
        });
        const down = flapTop.animate(
          [
            { transform: "rotateX(0deg)", filter: "brightness(1)" },
            { transform: "rotateX(-90deg)", filter: "brightness(0.45)" },
          ],
          { duration: dur, easing: "cubic-bezier(0.55, 0, 0.9, 0.55)", fill: "forwards" },
        );
        await down.finished.catch(() => {});
        if (!alive) break;
        flapTop.style.visibility = "hidden";
        flapBottom.style.visibility = "visible";
        // The new letter swings down onto the lower half, and the upper half lights up behind it.
        const lift = shadeTop.animate([{ opacity: 0.8 }, { opacity: 0 }], {
          duration: dur,
          fill: "forwards",
        });
        const land = flapBottom.animate(
          last
            ? [
                { transform: "rotateX(90deg)", filter: "brightness(0.55)", offset: 0 },
                { transform: "rotateX(-4deg)", filter: "brightness(1)", offset: 0.8 },
                { transform: "rotateX(0deg)", offset: 1 },
              ]
            : [
                { transform: "rotateX(90deg)", filter: "brightness(0.55)" },
                { transform: "rotateX(0deg)", filter: "brightness(1)" },
              ],
          {
            duration: last ? dur * 1.5 : dur,
            easing: "cubic-bezier(0.25, 0.6, 0.45, 1)",
            fill: "forwards",
          },
        );
        await sleep(dur * 0.8);
        if (loud.current) clack();
        await land.finished.catch(() => {});
        for (const a of [down, land, shade, lift]) a.cancel();
        if (!alive) break;
        at.current = next;
        settle(next);
      }
    };
    void run();

    return () => {
      alive = false;
      for (const a of el.getAnimations({ subtree: true })) a.cancel();
      settle(at.current);
    };
  }, [ch, charset, delay]);

  return (
    <div
      ref={root}
      aria-hidden
      className="relative select-none [perspective:520px]"
      style={{
        width: size * 0.7,
        height: size,
        borderRadius: size * 0.1,
        background: "#050505",
        boxShadow: `0 ${size * 0.04}px ${size * 0.1}px rgb(0 0 0 / 0.35), inset 0 0 0 1px rgb(255 255 255 / 0.05)`,
      }}
    >
      <Half k="bt" top initial={initial} size={size} tone={tone} />
      <Half k="bb" top={false} initial={initial} size={size} tone={tone} />
      <Half k="ft" top initial={initial} size={size} tone={tone} z={2} />
      <Half k="fb" top={false} initial={initial} size={size} tone={tone} z={3} />
      {/* the axle: two little pins at the sides of the fold, just as on the real thing */}
      <span
        className="pointer-events-none absolute left-[-1px] top-1/2 z-10 -translate-y-1/2 rounded-r-full bg-black"
        style={{ width: size * 0.07, height: size * 0.12 }}
      />
      <span
        className="pointer-events-none absolute right-[-1px] top-1/2 z-10 -translate-y-1/2 rounded-l-full bg-black"
        style={{ width: size * 0.07, height: size * 0.12 }}
      />
    </div>
  );
}
