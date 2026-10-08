"use client";

import * as React from "react";
import {
  ArrowRight,
  BookmarkSimple,
  Download,
  Plus,
  TextB,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Kbd } from "@/components/ui/kbd";
import { Pill } from "@/components/ui/pill";
import { Separator } from "@/components/ui/separator";
import { Toggle, ToggleGroup } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

function ButtonDemo() {
  const [saving, setSaving] = React.useState(false);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        Get started <ArrowRight size={16} weight="bold" />
      </Button>
      <Button variant="secondary">
        <Download size={16} weight="bold" /> Export
      </Button>
      <Button
        variant="soft"
        loading={saving}
        onClick={() => {
          setSaving(true);
          window.setTimeout(() => setSaving(false), 1800);
        }}
      >
        {saving ? "Saving" : "Save"}
      </Button>
      <Button size="icon" variant="ghost" aria-label="Add">
        <Plus size={16} weight="bold" />
      </Button>
    </div>
  );
}

function PillDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Pill>Neutral</Pill>
      <Pill tone="accent" dot pulse>
        Live
      </Pill>
      <Pill tone="sage" dot pulse>
        Healthy
      </Pill>
      <Pill tone="sky">Beta</Pill>
      <Pill tone="sand">Queued</Pill>
      <Pill tone="rose">Failed</Pill>
      <Pill tone="outline">Outline</Pill>
    </div>
  );
}

function ChipDemo() {
  const options = ["Design", "Motion", "Accessibility", "Dark mode"];
  const [selected, setSelected] = React.useState(["Design", "Dark mode"]);
  const [removable, setRemovable] = React.useState(["react", "tailwind", "tokens"]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <Chip
            key={o}
            selected={selected.includes(o)}
            onClick={() =>
              setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))
            }
          >
            {o}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {removable.map((r) => (
          <Chip key={r} onRemove={() => setRemovable((l) => l.filter((x) => x !== r))}>
            {r}
          </Chip>
        ))}
        {removable.length === 0 ? (
          <button
            type="button"
            className="text-xs text-accent hover:underline"
            onClick={() => setRemovable(["react", "tailwind", "tokens"])}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ToggleDemo() {
  const [fmt, setFmt] = React.useState(["bold"]);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-2">
        <Toggle defaultPressed aria-label="Bookmark">
          <BookmarkSimple size={15} weight="bold" /> Saved
        </Toggle>
        <Toggle>Notify me</Toggle>
      </div>
      <ToggleGroup
        value={fmt}
        onChange={setFmt}
        options={[
          { value: "bold", label: <TextB size={15} weight="bold" /> },
          { value: "italic", label: <TextItalic size={15} weight="bold" /> },
          { value: "underline", label: <TextUnderline size={15} weight="bold" /> },
        ]}
      />
    </div>
  );
}

function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4 text-sm text-muted">
      <p className="flex items-center gap-2">
        Open the palette with <span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </p>
      <p className="flex items-center gap-2">
        Save <span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>S</Kbd></span> · Undo{" "}
        <span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>Z</Kbd></span>
      </p>
      <p className="flex items-center gap-2">
        Dismiss with <Kbd>Esc</Kbd>
      </p>
    </div>
  );
}

function SeparatorDemo() {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-ink">VibeUI</p>
      <p className="mt-1 text-[13px] text-muted">Components you own.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-[13px] text-ink-soft">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  );
}


/* Gallery tiles: one fixed-width, evenly spaced composition per component. */

function ButtonTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col gap-2.5")}>
      <Button className="w-full">Primary</Button>
      <Button variant="accent" className="w-full">
        Accent
      </Button>
      <Button variant="secondary" className="w-full">
        Secondary
      </Button>
    </div>
  );
}

function ChipTile() {
  const [selected, setSelected] = React.useState(["Design", "Type"]);
  const [removable, setRemovable] = React.useState(["react", "tailwind", "tokens"]);
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-4")}>
      <div className="flex gap-2">
        {["Design", "Motion", "Type"].map((o) => (
          <Chip
            key={o}
            selected={selected.includes(o)}
            onClick={() =>
              setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))
            }
          >
            {o}
          </Chip>
        ))}
      </div>
      <div className="flex min-h-8 gap-2">
        {removable.map((r) => (
          <Chip key={r} onRemove={() => setRemovable((l) => l.filter((x) => x !== r))}>
            {r}
          </Chip>
        ))}
        {removable.length === 0 ? (
          <button
            type="button"
            className="text-xs text-accent hover:underline"
            onClick={() => setRemovable(["react", "tailwind", "tokens"])}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PillTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-3")}>
      <div className="flex gap-2">
        <Pill>Neutral</Pill>
        <Pill tone="accent" dot pulse>Live</Pill>
        <Pill tone="sage" dot pulse>Healthy</Pill>
      </div>
      <div className="flex gap-2">
        <Pill tone="sky">Beta</Pill>
        <Pill tone="sand">Queued</Pill>
        <Pill tone="rose">Failed</Pill>
      </div>
    </div>
  );
}

function ToggleTile() {
  const [fmt, setFmt] = React.useState(["bold"]);
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-4")}>
      <div className="flex gap-2">
        <Toggle defaultPressed aria-label="Bookmark">
          <BookmarkSimple size={15} weight="bold" /> Saved
        </Toggle>
        <Toggle>Notify me</Toggle>
      </div>
      <ToggleGroup
        value={fmt}
        onChange={setFmt}
        options={[
          { value: "bold", label: <TextB size={15} weight="bold" /> },
          { value: "italic", label: <TextItalic size={15} weight="bold" /> },
          { value: "underline", label: <TextUnderline size={15} weight="bold" /> },
        ]}
      />
    </div>
  );
}

function KbdTile() {
  const rows: [string, string[]][] = [
    ["Command palette", ["⌘", "K"]],
    ["Save", ["⌘", "S"]],
    ["Undo", ["⌘", "Z"]],
    ["Close", ["Esc"]],
  ];
  return (
    <ul className={cn(TILE_W, "divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface text-[13px] shadow-quiet")}>
      {rows.map(([label, keys]) => (
        <li key={label} className="flex items-center justify-between px-3.5 py-2.5">
          <span className="text-ink-soft">{label}</span>
          <span className="flex gap-1">
            {keys.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SeparatorTile() {
  return (
    <div className={cn(TILE_W, "rounded-lg border border-line bg-surface p-4 shadow-quiet")}>
      <p className="text-sm font-medium text-ink">VibeUI</p>
      <p className="mt-0.5 text-[13px] text-muted">Components you own.</p>
      <Separator className="my-3.5" animated />
      <div className="flex h-5 items-center justify-between text-[13px] text-ink-soft">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  );
}

export const actions: Record<string, Demo> = {
  button: { Component: ButtonDemo, width: "lg", Tile: ButtonTile },
  pill: { Component: PillDemo, width: "lg", Tile: PillTile },
  chip: { Component: ChipDemo, Tile: ChipTile },
  toggle: { Component: ToggleDemo, Tile: ToggleTile },
  kbd: { Component: KbdDemo, Tile: KbdTile },
  separator: { Component: SeparatorDemo, width: "sm", Tile: SeparatorTile },
};
