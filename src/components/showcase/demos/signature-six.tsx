"use client";

import * as React from "react";
import { FlowField } from "@/components/ui/flow-field";
import { Kaleidoscope } from "@/components/ui/kaleidoscope";
import { PendulumWave } from "@/components/ui/pendulum-wave";
import { RadarSweep, type RadarBlip } from "@/components/ui/radar-sweep";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

const hint = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted";

/* ─────────────────────────── flow field ─────────────────────────── */

const WINDS = {
  ember: ["#f2d49b", "#e9a25b", "#d4673f", "#a8405a", "#5b4a8f", "#3f7f93"],
  ocean: ["#a8e6ff", "#4cc9f0", "#4895ef", "#4361ee", "#3a0ca3", "#7209b7"],
  mono: ["#1b1a17", "#4a4741", "#8a867c", "#b5b0a4"],
} as const;

function FlowDemo() {
  const [wind, setWind] = React.useState<keyof typeof WINDS>("ember");
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FlowField
        palette={[...WINDS[wind]]}
        className="grid h-80 w-full place-items-center rounded-3xl border border-line bg-surface"
      >
        <p className="font-display text-5xl tracking-tight text-ink sm:text-6xl">On the wind</p>
      </FlowField>
      <Segmented
        options={(Object.keys(WINDS) as (keyof typeof WINDS)[]).map((k) => ({
          value: k,
          label: k[0].toUpperCase() + k.slice(1),
        }))}
        value={wind}
        onChange={setWind}
      />
      <p className={hint}>Stir it with the pointer · press to blow</p>
    </div>
  );
}

function FlowTile() {
  return (
    <FlowField
      count={500}
      className={cn(
        TILE_W,
        "grid h-36 place-items-center rounded-xl border border-line bg-surface",
      )}
    >
      <p className="font-display text-2xl text-ink">On the wind</p>
    </FlowField>
  );
}

/* ─────────────────────────── kaleidoscope ─────────────────────────── */

function KaleidoDemo() {
  const [n, setN] = React.useState("8");
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Kaleidoscope slices={Number(n)} className="w-80" />
      <Segmented
        options={["4", "6", "8", "12"].map((v) => ({ value: v, label: `${v} slices` }))}
        value={n}
        onChange={setN}
      />
      <p className={hint}>Press and draw · double-click to clear</p>
    </div>
  );
}

function KaleidoTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center py-3")}>
      <Kaleidoscope className="w-40" />
    </div>
  );
}

/* ─────────────────────────── pendulum wave ─────────────────────────── */

function PendulumDemo() {
  return (
    <div className="w-full">
      <div className="rounded-3xl border border-line bg-surface px-4 pt-6">
        <PendulumWave count={17} period={36} swings={26} className="h-80" />
      </div>
      <p className={cn(hint, "mt-4 text-center")}>
        Hold to run time faster · double-click to restart
      </p>
    </div>
  );
}

function PendulumTile() {
  return (
    <div className={TILE_W}>
      <PendulumWave count={13} period={30} swings={22} className="h-44" />
    </div>
  );
}

/* ─────────────────────────── radar sweep ─────────────────────────── */

// A fixed spread of contacts, so the demo looks the same on every render.
const CONTACTS: RadarBlip[] = [
  ["Flight 214", 24, 0.62],
  ["Cargo 9", 71, 0.35],
  ["Heli 3", 118, 0.78],
  ["Ferry", 152, 0.52],
  ["Unknown", 196, 0.86],
  ["Flight 88", 233, 0.44],
  ["Survey", 268, 0.7],
  ["Heli 7", 301, 0.28],
  ["Tanker", 332, 0.82],
  ["Flight 51", 349, 0.55],
].map(([label, angle, distance]) => ({
  label: label as string,
  angle: angle as number,
  distance: distance as number,
}));

function RadarDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="rounded-3xl bg-[#07120d] p-6 shadow-lift">
        <RadarSweep blips={CONTACTS} className="w-80" />
      </div>
      <p className={hint}>Point at a contact to read it</p>
    </div>
  );
}

function RadarTile() {
  return (
    <div className={cn(TILE_W, "grid place-items-center rounded-xl bg-[#07120d] py-4")}>
      <RadarSweep blips={CONTACTS} className="w-40" />
    </div>
  );
}

export const signatureSix: Record<string, Demo> = {
  "flow-field": { Component: FlowDemo, width: "lg", Tile: FlowTile },
  kaleidoscope: { Component: KaleidoDemo, width: "md", Tile: KaleidoTile },
  "pendulum-wave": { Component: PendulumDemo, width: "lg", Tile: PendulumTile },
  "radar-sweep": { Component: RadarDemo, width: "md", Tile: RadarTile },
};
