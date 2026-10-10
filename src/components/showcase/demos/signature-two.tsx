"use client";

import * as React from "react";
import { ArrowRight, Bell, Heart, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import { AuraBorder } from "@/components/ui/aura-border";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CoverFlow, type CoverItem } from "@/components/ui/cover-flow";
import { HoldButton } from "@/components/ui/hold-button";
import { Input } from "@/components/ui/input";
import { Knob } from "@/components/ui/knob";
import { LiquidMetal } from "@/components/ui/liquid-metal";
import { ParticleText } from "@/components/ui/particle-text";
import { PointerMorph } from "@/components/ui/pointer-morph";
import { Segmented } from "@/components/ui/segmented";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

/* ─────────────────────────── pointer morph ─────────────────────────── */

function MorphDemo() {
  return (
    <PointerMorph className="w-full rounded-2xl border border-line bg-surface p-8 shadow-quiet">
      <p className="font-display text-4xl leading-none tracking-tight text-ink">
        Everything leans toward you.
      </p>
      <p className="mt-3 max-w-sm text-sm text-muted">
        Move across the buttons, the chips and the field. The pointer wraps itself around what you
        touch.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button>
          Get started <ArrowRight size={16} weight="bold" />
        </Button>
        <Button variant="secondary">Read the docs</Button>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-sm font-medium text-ink underline underline-offset-4"
        >
          A plain link
        </a>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["Design", "Motion", "Tokens", "Dark mode"].map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <Input placeholder="Type here: the pointer becomes a caret" className="mt-5" />
    </PointerMorph>
  );
}

function MorphTile() {
  return (
    <PointerMorph
      className={cn(TILE_W, "rounded-xl border border-line bg-surface p-5 shadow-quiet")}
    >
      <p className="font-display text-2xl leading-none text-ink">Leans toward you.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Design", "Motion", "Tokens"].map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <Button size="sm" className="mt-4">
        Try it
      </Button>
    </PointerMorph>
  );
}

/* ─────────────────────────── particle text ─────────────────────────── */

function ParticleDemo() {
  return (
    <div className="w-full">
      <ParticleText text="VibeUI" className="h-60 font-display" />
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Move through it. Click to burst.
      </p>
    </div>
  );
}

function ParticleTile() {
  return (
    <div className={TILE_W}>
      <ParticleText text="Vibe" gap={2.3} radius={60} className="h-[150px] font-display" />
    </div>
  );
}

/* ─────────────────────────── knob ─────────────────────────── */

function KnobDemo() {
  const [gain, setGain] = React.useState(62);
  return (
    <div className="flex w-full flex-col items-center gap-7">
      <div className="flex flex-wrap items-start justify-center gap-6 rounded-2xl border border-line bg-surface px-6 py-8 shadow-quiet">
        <Knob
          size={112}
          label="Gain"
          value={gain}
          onValueChange={setGain}
          defaultValue={62}
          format={(v) => `${Math.round(v)}`}
        />
        <Knob
          size={112}
          label="Tone"
          min={-12}
          max={12}
          step={0.5}
          defaultValue={0}
          format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
        />
        <Knob size={112} label="Mix" defaultValue={40} format={(v) => `${Math.round(v)}%`} />
      </div>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Drag up and down · scroll when focused · double-click to reset
      </p>
    </div>
  );
}

function KnobTile() {
  return (
    <div className={cn(TILE_W, "flex items-start justify-center gap-5")}>
      <Knob label="Gain" size={104} defaultValue={64} />
      <Knob label="Mix" size={104} defaultValue={32} format={(v) => `${Math.round(v)}%`} />
    </div>
  );
}

/* ─────────────────────────── wheel picker ─────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
const meridiem = ["AM", "PM"];

function WheelDemo() {
  const [v, setV] = React.useState(["9", "41", "AM"]);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-5">
      <p className="font-display text-6xl leading-none tabular-nums text-ink">
        {v[0]}:{v[1]} <span className="text-3xl text-muted">{v[2]}</span>
      </p>
      <WheelPicker
        className="w-full"
        value={v}
        onValueChange={setV}
        columns={[
          { id: "Hour", options: hours, align: "right" },
          { id: "Minute", options: minutes, align: "left" },
          { id: "Period", options: meridiem, width: 84 },
        ]}
      />
    </div>
  );
}

function WheelTile() {
  return (
    <div className={TILE_W}>
      <WheelPicker
        defaultValue={["9", "41", "AM"]}
        columns={[
          { id: "Hour", options: hours, align: "right" },
          { id: "Minute", options: minutes, align: "left" },
          { id: "Period", options: meridiem, width: 72 },
        ]}
      />
    </div>
  );
}

/* ─────────────────────────── aura border ─────────────────────────── */

function AuraDemo() {
  const [mode, setMode] = React.useState<"thinking" | "idle">("thinking");
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AuraBorder active={mode === "thinking"} radius={22} className="w-full max-w-md">
        <div className="rounded-[22px] bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkle size={16} weight="fill" /> Ask VibeUI
          </div>
          <p className="mt-3 min-h-[3.2rem] text-[15px] leading-relaxed text-muted">
            {mode === "thinking"
              ? "Reading your tokens and drafting a theme that keeps the contrast…"
              : "Describe the interface you want, and it will pick the components."}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] text-muted">
              {mode === "thinking" ? "thinking" : "ready"}
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-ink text-surface">
              <PaperPlaneTilt size={16} weight="fill" />
            </span>
          </div>
        </div>
      </AuraBorder>
      <Segmented
        options={[
          { value: "thinking", label: "Thinking" },
          { value: "idle", label: "Idle" },
        ]}
        value={mode}
        onChange={setMode}
      />
    </div>
  );
}

function AuraTile() {
  return (
    <div className={TILE_W}>
      <AuraBorder radius={18} glow={14} className="w-full">
        <div className="rounded-[18px] bg-surface px-4 py-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkle size={15} weight="fill" /> Thinking
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Drafting a theme that keeps the contrast…
          </p>
        </div>
      </AuraBorder>
    </div>
  );
}

/* ─────────────────────────── hold button ─────────────────────────── */

function HoldDemo() {
  const [log, setLog] = React.useState<string[]>([]);
  const note = (s: string) => setLog((l) => [s, ...l].slice(0, 3));
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <HoldButton
          tone="danger"
          onConfirm={() => note("Deleted the project")}
          confirmedLabel="Deleted"
        >
          <Bell size={16} weight="bold" /> Hold to delete
        </HoldButton>
        <HoldButton
          holdMs={700}
          onConfirm={() => note("Published to production")}
          confirmedLabel="Published"
        >
          <Heart size={16} weight="fill" /> Hold to publish
        </HoldButton>
      </div>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Let go early and it gives up
      </p>
      <ul className="h-16 text-center text-sm text-muted" aria-live="polite">
        {log.map((l, i) => (
          <li key={l + i} style={{ opacity: 1 - i * 0.3 }}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HoldTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-3")}>
      <HoldButton tone="danger" confirmedLabel="Deleted">
        Hold to delete
      </HoldButton>
      <HoldButton holdMs={700} confirmedLabel="Published">
        Hold to publish
      </HoldButton>
    </div>
  );
}

/* ─────────────────────────── cover flow ─────────────────────────── */

const covers: CoverItem[] = [
  ["Paper Moons", "Halden Ray", "#6d5efc", "#ff5d8f"],
  ["Slow Tides", "North Atlas", "#0ea5a4", "#1e3a8a"],
  ["Golden Hour", "Maya Chen", "#f59e0b", "#e11d48"],
  ["Night Shift", "Cobalt", "#312e81", "#0f172a"],
  ["Soft Static", "Lumen", "#ec4899", "#7c3aed"],
  ["Greenhouse", "Fern & Co", "#16a34a", "#064e3b"],
  ["Afterglow", "Rue", "#fb7185", "#f59e0b"],
  ["Low Orbit", "Sable", "#38bdf8", "#4338ca"],
  ["Quiet Fire", "Ember", "#ef4444", "#7f1d1d"],
].map(([title, subtitle, a, b]) => ({
  id: title,
  title,
  subtitle,
  art: (
    <div
      className="relative size-full"
      style={{ background: `radial-gradient(circle at 30% 25%, ${a}, ${b})` }}
    >
      <span className="absolute bottom-2.5 left-3 font-display text-[26px] leading-none text-white/90">
        {title.split(" ")[0]}
      </span>
      <span className="absolute right-3 top-3 size-7 rounded-full bg-white/20 ring-1 ring-white/30" />
    </div>
  ),
}));

function CoverDemo() {
  return <CoverFlow items={covers} defaultIndex={3} size={190} />;
}

function CoverTile() {
  return (
    <div className={TILE_W}>
      <CoverFlow items={covers} defaultIndex={2} size={96} />
    </div>
  );
}

/* ─────────────────────────── liquid metal ─────────────────────────── */

const tints = { silver: undefined, gold: "#ffb43a", copper: "#e8845a", ink: "#8a8f9c" } as const;

function MetalDemo() {
  const [tint, setTint] = React.useState<keyof typeof tints>("silver");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="w-full overflow-hidden rounded-2xl bg-[#0e0e12] shadow-lift">
        <LiquidMetal tint={tints[tint]} className="h-80" />
      </div>
      <Segmented
        options={(Object.keys(tints) as (keyof typeof tints)[]).map((k) => ({
          value: k,
          label: k[0].toUpperCase() + k.slice(1),
        }))}
        value={tint}
        onChange={setTint}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Move across it · click to surge
      </p>
    </div>
  );
}

function MetalTile() {
  return (
    <div className={cn(TILE_W, "overflow-hidden rounded-xl bg-[#0e0e12]")}>
      <LiquidMetal className="h-[170px]" />
    </div>
  );
}

export const signatureTwo: Record<string, Demo> = {
  "pointer-morph": { Component: MorphDemo, width: "md", Tile: MorphTile },
  "particle-text": { Component: ParticleDemo, width: "md", Tile: ParticleTile },
  knob: { Component: KnobDemo, width: "md", Tile: KnobTile },
  "wheel-picker": { Component: WheelDemo, width: "sm", Tile: WheelTile },
  "aura-border": { Component: AuraDemo, width: "md", Tile: AuraTile },
  "hold-button": { Component: HoldDemo, width: "md", Tile: HoldTile },
  "cover-flow": { Component: CoverDemo, width: "lg", Tile: CoverTile },
  "liquid-metal": { Component: MetalDemo, width: "md", Tile: MetalTile },
};
