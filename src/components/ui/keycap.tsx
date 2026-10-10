"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const keycap = cva(
  "relative inline-block select-none align-top outline-none [-webkit-tap-highlight-color:transparent] focus-visible:[&>[data-cap]]:ring-2 focus-visible:[&>[data-cap]]:ring-ring focus-visible:[&>[data-cap]]:ring-offset-2 focus-visible:[&>[data-cap]]:ring-offset-canvas",
  {
    variants: {
      size: {
        sm: "h-9 min-w-9 text-[13px]",
        md: "h-12 min-w-12 text-[15px]",
        lg: "h-16 min-w-16 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

// How far a key travels, in px, and the radius of its corners.
const TRAVEL = { sm: 4, md: 6, lg: 8 } as const;
const RADIUS = { sm: 9, md: 12, lg: 15 } as const;

let audio: AudioContext | null = null;
function tick(down: boolean) {
  try {
    audio ??= new AudioContext();
    const a = audio;
    if (a.state === "suspended") void a.resume();
    const t = a.currentTime;
    // A short burst of filtered noise is the plastic; a low sine is the bottoming out.
    const len = Math.floor(a.sampleRate * 0.03);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = a.createBufferSource();
    src.buffer = buf;
    const band = a.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = down ? 2100 : 3200;
    band.Q.value = 0.9;
    const g = a.createGain();
    g.gain.value = down ? 0.5 : 0.22;
    src.connect(band).connect(g).connect(a.destination);
    src.start(t);
    if (down) {
      const o = a.createOscillator();
      const og = a.createGain();
      o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.06);
      og.gain.setValueAtTime(0.28, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      o.connect(og).connect(a.destination);
      o.start(t);
      o.stop(t + 0.08);
    }
  } catch {
    // no audio available; the key still works
  }
}

// "mod+shift+k" → who must be held, and which key. `mod` is Command on a Mac and Control elsewhere.
function matches(e: KeyboardEvent, combo: string) {
  const parts = combo.toLowerCase().split("+");
  const key = parts.pop() ?? "";
  const want = (m: string) => parts.includes(m);
  const mod = want("mod")
    ? e.metaKey || e.ctrlKey
    : e.metaKey === want("meta") && e.ctrlKey === want("ctrl");
  return (
    mod &&
    e.shiftKey === want("shift") &&
    e.altKey === want("alt") &&
    (e.key.toLowerCase() === key || (key === "space" && e.key === " "))
  );
}

/**
 * A keyboard key with real travel: it dips under your finger, springs back, and can click.
 *
 * Give it a `shortcut` and it presses itself whenever that key combination is typed, a handy way to show
 * a shortcut that does something.
 */
export function Keycap({
  children,
  legend,
  size = "md",
  shortcut,
  sound = false,
  onPress,
  className,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  VariantProps<typeof keycap> & {
    /** The label on the cap. */
    children: React.ReactNode;
    /** A small label in the corner, such as a modifier symbol. */
    legend?: React.ReactNode;
    /** Press this key combination to press the cap, for example `k`, `mod+k` or `shift+enter`. */
    shortcut?: string;
    /** Play a small click. Off unless you ask for it. */
    sound?: boolean;
    /** Called on every press, whether it came from a pointer, the keyboard or the shortcut. */
    onPress?: () => void;
  }) {
  const [pressed, setPressed] = React.useState(false);
  const held = React.useRef(false);
  const cb = React.useRef({ onPress, sound });
  const s = size ?? "md";
  const travel = TRAVEL[s];
  const radius = RADIUS[s];

  React.useEffect(() => {
    cb.current = { onPress, sound };
  }, [onPress, sound]);

  const push = React.useCallback((fromShortcut: boolean) => {
    if (held.current) return;
    held.current = true;
    setPressed(true);
    if (cb.current.sound) tick(true);
    if (fromShortcut) cb.current.onPress?.();
  }, []);
  const release = React.useCallback(() => {
    if (!held.current) return;
    held.current = false;
    setPressed(false);
    if (cb.current.sound) tick(false);
  }, []);

  React.useEffect(() => {
    if (!shortcut) return;
    const down = (e: KeyboardEvent) => {
      if (e.repeat || !matches(e, shortcut)) return;
      const t = e.target as HTMLElement | null;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (typing && !/mod|meta|ctrl|alt/.test(shortcut)) return;
      push(true);
    };
    const up = () => release();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", up);
    };
  }, [shortcut, push, release]);

  return (
    <button
      type="button"
      {...props}
      className={cn(keycap({ size }), className)}
      style={{ paddingBottom: travel, ...props.style }}
      onClick={(e) => {
        props.onClick?.(e);
        // The shortcut already reported its press; a click from the pointer or Enter reports here.
        if (!e.defaultPrevented) onPress?.();
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.button === 0) push(false);
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e);
        release();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        release();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === " " || e.key === "Enter") push(false);
      }}
      onKeyUp={(e) => {
        onKeyUp?.(e);
        if (e.key === " " || e.key === "Enter") release();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        release();
      }}
    >
      {/* the housing the key sits in: its lip is what you see below the cap at rest */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-[color-mix(in_oklab,var(--line),black_32%)] shadow-[0_6px_10px_-4px_rgb(0_0_0/0.35),inset_0_1px_2px_rgb(0_0_0/0.4)]"
        style={{ top: travel * 0.6, borderRadius: radius }}
      />
      <span
        data-cap
        className="relative flex h-full min-w-[inherit] items-center justify-center px-3.5 font-medium text-ink transition-[transform,box-shadow] ease-[cubic-bezier(0.3,1.5,0.5,1)]"
        style={{
          height: "100%",
          borderRadius: radius,
          transform: `translateY(${pressed ? travel * 0.85 : 0}px) scaleX(${pressed ? 0.988 : 1})`,
          transitionDuration: pressed ? "45ms" : "240ms",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--surface), white 35%), var(--surface) 55%, color-mix(in oklab, var(--surface), var(--ink) 6%))",
          boxShadow: pressed
            ? "0 0 0 1px var(--line), inset 0 1px 0 rgb(255 255 255 / 0.5), 0 1px 2px rgb(0 0 0 / 0.25)"
            : "0 0 0 1px var(--line), inset 0 1px 0 rgb(255 255 255 / 0.8), inset 0 -2px 3px rgb(0 0 0 / 0.07), 0 2px 3px rgb(0 0 0 / 0.18)",
        }}
      >
        {/* the shallow dish where a fingertip rests */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[3px] rounded-[inherit] bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgb(0_0_0/0.045))]"
        />
        {legend != null && (
          <span className="absolute left-2 top-1 text-[0.62em] font-semibold text-muted">
            {legend}
          </span>
        )}
        <span className="relative">{children}</span>
      </span>
    </button>
  );
}
