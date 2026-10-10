"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  MusicNotes,
  PencilSimple,
  Phone,
  PhoneX,
  Play,
  Share,
  Timer,
  Trash,
} from "@phosphor-icons/react";
import { AiOrb, type OrbState } from "@/components/ui/ai-orb";
import { Button } from "@/components/ui/button";
import { DynamicIsland, type IslandView } from "@/components/ui/dynamic-island";
import { GooeyMenu } from "@/components/ui/gooey-menu";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidSwitch } from "@/components/ui/liquid-switch";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { Odometer } from "@/components/ui/odometer";
import { ScratchReveal } from "@/components/ui/scratch-reveal";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

/* ─────────────────────────── liquid glass ─────────────────────────── */

/** A vivid, busy scene: glass is only convincing over something worth bending. */
function GlassBackdrop({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-[#0f0e1a]", className)}>
      <div
        aria-hidden
        className="absolute -left-12 -top-12 size-60 animate-float rounded-full bg-[#6d5efc] opacity-90 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -right-8 top-6 size-52 animate-float rounded-full bg-[#19c3a6] opacity-80 blur-2xl [animation-delay:-2s]"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 left-1/3 size-56 animate-float rounded-full bg-[#ff5d8f] opacity-80 blur-2xl [animation-delay:-3.5s]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgb(255_255_255/0.2)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.2)_1px,transparent_1px)] [background-size:28px_28px]"
      />
      {children}
    </div>
  );
}

function GlassScene({ compact }: { compact?: boolean }) {
  const stage = React.useRef<HTMLDivElement>(null);
  // Start low, so the lens refracts the lower half of the title and its label stays readable.
  const [pos, setPos] = React.useState(compact ? { x: 34, y: 34 } : { x: 0, y: 72 });
  const drag = React.useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const lens = compact ? { w: 148, h: 64 } : { w: 224, h: 112 };

  return (
    <div ref={stage} className={compact ? "w-full" : "w-full max-w-lg"}>
      <GlassBackdrop className={compact ? "h-[176px]" : "h-[320px]"}>
        <p
          className={cn(
            "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display leading-none tracking-tight text-white",
            compact ? "text-[44px]" : "text-[84px]",
          )}
        >
          Liquid glass
        </p>
        <div
          className="absolute left-1/2 top-1/2 cursor-grab touch-none active:cursor-grabbing"
          style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            const box = stage.current?.getBoundingClientRect();
            if (!d || !box) return;
            const mx = box.width / 2 - lens.w / 2;
            const my = (compact ? 176 : 320) / 2 - lens.h / 2;
            setPos({
              x: Math.max(-mx, Math.min(mx, d.ox + e.clientX - d.px)),
              y: Math.max(-my, Math.min(my, d.oy + e.clientY - d.py)),
            });
          }}
          onPointerUp={() => (drag.current = null)}
        >
          <LiquidGlass
            radius={compact ? 32 : 56}
            className="flex items-center justify-center"
            style={{ width: lens.w, height: lens.h }}
          >
            <span className="flex h-full items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/90">
              <Play size={compact ? 12 : 14} weight="fill" /> drag me
            </span>
          </LiquidGlass>
        </div>
      </GlassBackdrop>
    </div>
  );
}

function LiquidGlassDemo() {
  return <GlassScene />;
}

function LiquidGlassTile() {
  return (
    <div className={TILE_W}>
      <GlassScene compact />
    </div>
  );
}

/* ─────────────────────────── liquid switch ─────────────────────────── */

function SwitchRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function LiquidSwitchDemo() {
  return (
    <div className="w-full max-w-sm">
      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-quiet">
        <SwitchRow label="Wi-Fi" hint="Studio network">
          <LiquidSwitch defaultChecked aria-label="Wi-Fi" />
        </SwitchRow>
        <SwitchRow label="Bluetooth" hint="Not connected">
          <LiquidSwitch aria-label="Bluetooth" />
        </SwitchRow>
        <SwitchRow label="Focus" hint="Silence notifications">
          <LiquidSwitch defaultChecked aria-label="Focus" />
        </SwitchRow>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Press and hold, then drag the thumb.</p>
    </div>
  );
}

function LiquidSwitchTile() {
  return (
    <div
      className={cn(
        TILE_W,
        "divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-quiet",
      )}
    >
      <SwitchRow label="Wi-Fi" hint="Studio network">
        <LiquidSwitch defaultChecked aria-label="Wi-Fi" />
      </SwitchRow>
      <SwitchRow label="Focus" hint="Silence alerts">
        <LiquidSwitch aria-label="Focus" />
      </SwitchRow>
    </div>
  );
}

/* ─────────────────────────── gooey menu ─────────────────────────── */

function GooeyDemo({ open, compact }: { open?: boolean; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-end justify-center",
        compact ? "h-[176px] w-[264px] pb-2" : "h-60 w-72 pb-4",
      )}
    >
      <GooeyMenu
        label="Create"
        defaultOpen={open}
        items={[
          { id: "image", label: "Add image", icon: <ImageIcon size={20} weight="bold" /> },
          { id: "edit", label: "Edit", icon: <PencilSimple size={20} weight="bold" /> },
          { id: "share", label: "Share", icon: <Share size={20} weight="bold" /> },
          { id: "trash", label: "Delete", icon: <Trash size={20} weight="bold" /> },
        ]}
      />
    </div>
  );
}

/* ─────────────────────────── dynamic island ─────────────────────────── */

type IslandKey = "idle" | "timer" | "music" | "call";
const ORDER: IslandKey[] = ["idle", "timer", "music", "call"];

function Bars() {
  return (
    <span aria-hidden className="flex h-5 items-end gap-[3px]">
      {[0, 0.2, 0.4, 0.1, 0.3].map((d) => (
        <span
          key={d}
          className="h-full w-[3px] origin-bottom animate-eq rounded-full bg-surface"
          style={{ animationDelay: `${-d}s` }}
        />
      ))}
    </span>
  );
}

const islandViews: IslandView[] = [
  {
    id: "idle",
    label: "Idle",
    width: 132,
    height: 38,
    content: (
      <div className="flex size-full items-center justify-center gap-2 text-[12px] font-medium">
        <span className="size-2 rounded-full bg-surface/70" /> Studio
      </div>
    ),
  },
  {
    id: "timer",
    label: "Focus timer, 4 minutes 32 seconds",
    width: 214,
    height: 44,
    content: (
      <div className="flex size-full items-center justify-between px-4 text-[13px]">
        <Timer size={18} weight="bold" />
        <span className="font-mono tabular-nums">04:32</span>
        <span className="text-[11px] uppercase tracking-wider text-surface/60">Focus</span>
      </div>
    ),
  },
  {
    id: "music",
    label: "Now playing: Paper Moons",
    width: 340,
    height: 78,
    content: (
      <div className="flex size-full items-center gap-3 px-3.5">
        <span className="grid size-[50px] shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#6d5efc,#ff5d8f)] text-white">
          <MusicNotes size={22} weight="fill" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">Paper Moons</span>
          <span className="block truncate text-[12px] text-surface/60">Halden Ray</span>
        </span>
        <Bars />
      </div>
    ),
  },
  {
    id: "call",
    label: "Incoming call from Maya Chen",
    width: 356,
    height: 136,
    radius: 38,
    content: (
      <div className="flex size-full flex-col justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-surface/15 text-sm font-medium">
            MC
          </span>
          <span>
            <span className="block text-[14px] font-medium">Maya Chen</span>
            <span className="block text-[12px] text-surface/60">Incoming call…</span>
          </span>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#e5484d] text-[13px] font-medium text-white"
          >
            <PhoneX size={16} weight="fill" /> Decline
          </button>
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#30a46c] text-[13px] font-medium text-white"
          >
            <Phone size={16} weight="fill" /> Accept
          </button>
        </div>
      </div>
    ),
  },
];

function useCycle(on: boolean, ms: number) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setI((n) => (n + 1) % ORDER.length), ms);
    return () => clearInterval(id);
  }, [on, ms]);
  return [i, setI] as const;
}

function IslandDemo() {
  const [auto, setAuto] = React.useState(true);
  const [i, setI] = useCycle(auto, 2800);
  const value = ORDER[i];
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <DynamicIsland views={islandViews} value={value} />
      <Segmented
        options={ORDER.map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))}
        value={value}
        onChange={(k) => {
          setAuto(false);
          setI(ORDER.indexOf(k));
        }}
      />
    </div>
  );
}

function IslandTile() {
  const [i] = useCycle(true, 2600);
  return (
    <div className={TILE_W}>
      <DynamicIsland
        views={islandViews.slice(0, 3)}
        value={ORDER[i % 3]}
        className="scale-[0.74] origin-top"
      />
    </div>
  );
}

/* ─────────────────────────── ai orb ─────────────────────────── */

/** A stand-in for microphone or voice output loudness. Real apps pass their own analyser's level. */
function useFakeLevel(active: boolean) {
  const [lvl, setLvl] = React.useState(0);
  React.useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 32) {
        last = t;
        setLvl(0.38 + 0.3 * Math.sin(t / 190) + 0.18 * Math.sin(t / 71) + 0.1 * Math.sin(t / 37));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return active ? lvl : 0;
}

const orbTints = {
  ink: "var(--ink)",
  indigo: "#5b4bff",
  rose: "#e5487a",
  teal: "#0f9d84",
} as const;

function OrbDemo() {
  const [state, setState] = React.useState<OrbState>("speaking");
  const [tint, setTint] = React.useState<keyof typeof orbTints>("indigo");
  const level = useFakeLevel(state === "speaking" || state === "listening");
  return (
    <div
      className="flex flex-col items-center gap-7"
      style={{ "--accent": orbTints[tint] } as React.CSSProperties}
    >
      <AiOrb state={state} level={level} size={190} />
      <div role="radiogroup" aria-label="Accent" className="flex gap-2.5">
        {(Object.keys(orbTints) as (keyof typeof orbTints)[]).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={tint === k}
            aria-label={k}
            onClick={() => setTint(k)}
            className={cn(
              "size-6 rounded-full outline-none ring-offset-2 ring-offset-canvas transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
              tint === k && "ring-2 ring-ink/50",
            )}
            style={{ background: orbTints[k] }}
          />
        ))}
      </div>
      <Segmented
        options={(["idle", "listening", "thinking", "speaking"] as const).map((s) => ({
          value: s,
          label: s[0].toUpperCase() + s.slice(1),
        }))}
        value={state}
        onChange={setState}
      />
    </div>
  );
}

function OrbTile() {
  const level = useFakeLevel(true);
  return (
    <div
      className={cn(TILE_W, "flex justify-center")}
      style={{ "--accent": "#5b4bff" } as React.CSSProperties}
    >
      <AiOrb state="speaking" level={level} size={128} />
    </div>
  );
}

/* ─────────────────────────── mesh gradient ─────────────────────────── */

const palettes = {
  aurora: { colors: ["#0e1020", "#5b4bff", "#19c3a6", "#ff5d8f"], dark: true },
  dusk: { colors: ["#1a1030", "#ff7a59", "#ffbf69", "#7b2cbf"], dark: true },
  ink: { colors: ["#0f0e0d", "#2b2926", "#55514a", "#9a958a"], dark: true },
  bone: { colors: ["#f4f2ee", "#e3ded3", "#c9c2b4", "#ffffff"], dark: false },
} as const;

function MeshDemo() {
  const [name, setName] = React.useState<keyof typeof palettes>("aurora");
  const p = palettes[name];
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <MeshGradient colors={[...p.colors]} className="h-64 w-full rounded-xl">
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <p
            className={cn(
              "font-display text-5xl leading-none tracking-tight",
              p.dark ? "text-white" : "text-ink",
            )}
          >
            Flowing, not looping.
          </p>
          <p
            className={cn(
              "mt-3 font-mono text-[11px] uppercase tracking-[0.2em]",
              p.dark ? "text-white/70" : "text-ink/60",
            )}
          >
            WebGL · 0 dependencies · move your cursor
          </p>
        </div>
      </MeshGradient>
      <Segmented
        options={(Object.keys(palettes) as (keyof typeof palettes)[]).map((k) => ({
          value: k,
          label: k[0].toUpperCase() + k.slice(1),
        }))}
        value={name}
        onChange={setName}
      />
    </div>
  );
}

function MeshTile() {
  return (
    <div className={TILE_W}>
      <MeshGradient colors={[...palettes.aurora.colors]} className="h-[150px] w-full rounded-xl">
        <div className="flex h-[150px] items-center justify-center">
          <p className="font-display text-[34px] leading-none text-white">Flowing.</p>
        </div>
      </MeshGradient>
    </div>
  );
}

/* ─────────────────────────── scratch reveal ─────────────────────────── */

function ScratchDemo({ compact }: { compact?: boolean }) {
  const [key, setKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <ScratchReveal
        key={key}
        onReveal={() => setOpen(true)}
        className={cn("bg-pastel-sky", compact ? "h-[132px] w-[264px]" : "h-48 w-80")}
        brush={compact ? 26 : 34}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center",
            compact ? "h-[132px]" : "h-48",
          )}
        >
          <p
            className={cn(
              "font-display leading-none text-pastel-sky-ink",
              compact ? "text-[34px]" : "text-5xl",
            )}
          >
            Yours to keep.
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-pastel-sky-ink/70">
            112 components · 0 kb runtime
          </p>
        </div>
      </ScratchReveal>
      {!compact && (
        <Button
          size="sm"
          variant="secondary"
          className={cn(
            "transition-opacity",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => {
            setKey((k) => k + 1);
            setOpen(false);
          }}
        >
          Scratch again
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── odometer ─────────────────────────── */

const usd = { style: "currency", currency: "USD", maximumFractionDigits: 0 } as const;
const pct = { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

function useTicker(start: number, ms: number) {
  const [v, setV] = React.useState(start);
  React.useEffect(() => {
    const id = setInterval(() => setV((x) => x + 140 + Math.round(Math.random() * 860)), ms);
    return () => clearInterval(id);
  }, [ms]);
  return [v, setV] as const;
}

function OdometerDemo() {
  const [revenue, setRevenue] = useTicker(12480, 2400);
  const [rate, setRate] = React.useState(0.0382);
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Revenue today
        </p>
        <Odometer value={revenue} format={usd} className="font-display text-7xl text-ink" />
      </div>
      <div className="text-center">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Conversion
        </p>
        <Odometer value={rate} format={pct} className="font-display text-4xl text-ink" />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => setRevenue((x) => x + 140 + Math.round(Math.random() * 860))}
        >
          Add a sale
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setRate(0.02 + Math.random() * 0.06)}>
          Shuffle rate
        </Button>
      </div>
    </div>
  );
}

function OdometerTile() {
  const [revenue] = useTicker(48210, 2200);
  return (
    <div className={cn(TILE_W, "text-center")}>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Revenue today
      </p>
      <Odometer value={revenue} format={usd} className="font-display text-5xl text-ink" />
    </div>
  );
}

export const signature: Record<string, Demo> = {
  "liquid-glass": { Component: LiquidGlassDemo, width: "md", Tile: LiquidGlassTile },
  "liquid-switch": { Component: LiquidSwitchDemo, width: "sm", Tile: LiquidSwitchTile },
  "gooey-menu": {
    Component: () => <GooeyDemo />,
    width: "sm",
    Tile: () => <GooeyDemo open compact />,
  },
  "dynamic-island": { Component: IslandDemo, width: "md", Tile: IslandTile },
  "ai-orb": { Component: OrbDemo, width: "sm", Tile: OrbTile },
  "mesh-gradient": { Component: MeshDemo, width: "md", Tile: MeshTile },
  "scratch-reveal": {
    Component: () => <ScratchDemo />,
    width: "sm",
    Tile: () => <ScratchDemo compact />,
  },
  odometer: { Component: OdometerDemo, width: "sm", Tile: OdometerTile },
};
