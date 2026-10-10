"use client";

import * as React from "react";
import { Eyedropper } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type HSVA = { h: number; s: number; v: number; a: number };

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

function toRgb({ h, s, v }: HSVA): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function fromRgb(r: number, g: number, b: number, a = 1, hue?: number): HSVA {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const d = max - Math.min(R, G, B);
  let h = 0;
  if (d) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  } else if (hue != null) h = hue; // greys have no hue of their own, so keep the one you had
  return { h, s: max ? d / max : 0, v: max, a };
}

const hex2 = (n: number) => n.toString(16).padStart(2, "0");

function toHex(c: HSVA, alpha: boolean) {
  const [r, g, b] = toRgb(c);
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${alpha && c.a < 1 ? hex2(Math.round(c.a * 255)) : ""}`;
}

function parseHex(input: string, hue?: number): HSVA | null {
  let t = input.trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t)) return null;
  if (t.length === 3 || t.length === 4) t = [...t].map((c) => c + c).join("");
  if (t.length !== 6 && t.length !== 8) return null;
  const n = (i: number) => parseInt(t.slice(i, i + 2), 16);
  return fromRgb(n(0), n(2), n(4), t.length === 8 ? n(6) / 255 : 1, hue);
}

const CHECKER =
  "conic-gradient(rgb(0 0 0 / 0.1) 25%, transparent 0 50%, rgb(0 0 0 / 0.1) 0 75%, transparent 0) 0 0 / 10px 10px";

const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

/**
 * A colour picker with a saturation field, hue and opacity strips, a hex field and an eyedropper.
 *
 * It holds hue steady as you drag through greys, so the field never snaps back to red. Everything can
 * be driven by keyboard.
 */
export function ColorPicker({
  value,
  defaultValue = "#6d5dfc",
  onChange,
  alpha = false,
  swatches = SWATCHES,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Controlled colour as hex: `#rgb`, `#rrggbb` or `#rrggbbaa`. */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Show an opacity strip and write `#rrggbbaa`. */
  alpha?: boolean;
  /** Quick picks under the controls. Pass `[]` to hide them. */
  swatches?: string[];
}) {
  const [color, setColor] = React.useState<HSVA>(
    () => parseHex(value ?? defaultValue) ?? { h: 250, s: 0.64, v: 0.99, a: 1 },
  );
  const [draft, setDraft] = React.useState<string | null>(null);
  const hex = toHex(color, alpha);

  // A new `value` from outside replaces the colour, unless it is just our own change coming back.
  const [seen, setSeen] = React.useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value != null && value.toLowerCase() !== hex.toLowerCase()) {
      const next = parseHex(value, color.h);
      if (next) setColor(next);
    }
  }

  const emit = (next: HSVA) => {
    setColor(next);
    onChange?.(toHex(next, alpha));
  };

  const field = React.useRef<HTMLDivElement>(null);
  const setFromField = (e: React.PointerEvent) => {
    const r = field.current?.getBoundingClientRect();
    if (!r) return;
    emit({
      ...color,
      s: clamp((e.clientX - r.left) / r.width),
      v: 1 - clamp((e.clientY - r.top) / r.height),
    });
  };

  const onFieldKey = (e: React.KeyboardEvent) => {
    const k = e.shiftKey ? 0.1 : 0.02;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-k, 0],
      ArrowRight: [k, 0],
      ArrowUp: [0, k],
      ArrowDown: [0, -k],
    };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    emit({ ...color, s: clamp(color.s + m[0]), v: clamp(color.v + m[1]) });
  };

  const [rgb0, rgb1, rgb2] = toRgb(color);
  const solid = `rgb(${rgb0} ${rgb1} ${rgb2})`;
  const hueColor = `hsl(${color.h} 100% 50%)`;
  // Only browsers that ship the EyeDropper API get the button; the server never renders it.
  const canPick = React.useSyncExternalStore(
    () => () => {},
    () => "EyeDropper" in window,
    () => false,
  );

  const pickFromScreen = async () => {
    try {
      const Dropper = (
        window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }
      ).EyeDropper;
      const { sRGBHex } = await new Dropper().open();
      const next = parseHex(sRGBHex, color.h);
      if (next) emit({ ...next, a: color.a });
    } catch {
      // cancelled
    }
  };

  return (
    <div
      {...props}
      className={cn(
        "w-full max-w-[280px] select-none rounded-2xl border border-line bg-surface p-3 shadow-sm",
        className,
      )}
    >
      <div
        ref={field}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(color.s * 100)}
        aria-valuetext={`Saturation ${Math.round(color.s * 100)}%, brightness ${Math.round(color.v * 100)}%`}
        onKeyDown={onFieldKey}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromField(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromField(e);
        }}
        className="relative h-40 w-full cursor-crosshair touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
          boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.08)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white shadow-[0_0_0_1px_rgb(0_0_0/0.25),0_2px_6px_rgb(0_0_0/0.4)]"
          style={{ left: `${color.s * 100}%`, top: `${(1 - color.v) * 100}%`, background: solid }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Strip
            label="Hue"
            value={color.h / 360}
            max={360}
            display={Math.round(color.h)}
            onChange={(t) => emit({ ...color, h: t * 360 })}
            background="linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
            thumb={hueColor}
          />
          {alpha && (
            <Strip
              label="Opacity"
              value={color.a}
              max={100}
              display={Math.round(color.a * 100)}
              onChange={(t) => emit({ ...color, a: t })}
              background={`linear-gradient(to right, transparent, ${solid}), ${CHECKER}`}
              thumb={`rgb(${rgb0} ${rgb1} ${rgb2} / ${color.a})`}
              checker
            />
          )}
        </div>
        {canPick && (
          <button
            type="button"
            aria-label="Pick a colour from the screen"
            onClick={pickFromScreen}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <Eyedropper size={18} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span
          aria-hidden
          className="relative size-9 shrink-0 overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
          style={{ background: CHECKER }}
        >
          <span
            className="absolute inset-0"
            style={{ background: `rgb(${rgb0} ${rgb1} ${rgb2} / ${color.a})` }}
          />
        </span>
        <input
          aria-label="Hex colour"
          spellCheck={false}
          autoCapitalize="off"
          value={(draft ?? hex).toUpperCase()}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            const next = parseHex(raw, color.h);
            if (next) emit(alpha ? next : { ...next, a: 1 });
          }}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={() => setDraft(null)}
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2.5 font-mono text-sm uppercase tracking-wide text-ink outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {swatches.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {swatches.map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`Use ${s}`}
              onClick={() => {
                const next = parseHex(s);
                if (next) emit({ ...next, a: color.a });
              }}
              className={cn(
                "size-6 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                hex.slice(0, 7).toLowerCase() === s.toLowerCase() &&
                  "ring-2 ring-ink ring-offset-2 ring-offset-surface",
              )}
              style={{ background: s }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Strip({
  label,
  value,
  max,
  display,
  onChange,
  background,
  thumb,
  checker,
}: {
  label: string;
  value: number; // 0 to 1
  max: number;
  display: number;
  onChange: (t: number) => void;
  background: string;
  thumb: string;
  checker?: boolean;
}) {
  const track = React.useRef<HTMLDivElement>(null);
  const set = (e: React.PointerEvent) => {
    const r = track.current?.getBoundingClientRect();
    if (r) onChange(clamp((e.clientX - r.left) / r.width));
  };
  return (
    <div
      ref={track}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={display}
      onKeyDown={(e) => {
        const k = e.shiftKey ? 0.1 : 0.01;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(clamp(value + k));
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(clamp(value - k));
        else return;
        e.preventDefault();
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        set(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) set(e);
      }}
      className="relative h-3.5 cursor-pointer touch-none rounded-full outline-none shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      style={{ background }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[2.5px] border-white shadow-[0_0_0_1px_rgb(0_0_0/0.25),0_2px_5px_rgb(0_0_0/0.35)]"
        style={{
          left: `${value * 100}%`,
          background: checker ? `linear-gradient(${thumb}, ${thumb}), ${CHECKER}` : thumb,
        }}
      />
    </div>
  );
}
