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
import type { Demo } from "../demo";

function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button>Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Delete</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button size="sm">Small</Button>
        <Button size="lg">
          Get started <ArrowRight size={16} weight="bold" />
        </Button>
        <Button variant="secondary">
          <Download size={16} weight="bold" /> Export
        </Button>
        <Button size="icon" variant="secondary" aria-label="Add">
          <Plus size={16} weight="bold" />
        </Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
}

function PillDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Pill>Neutral</Pill>
      <Pill tone="accent" dot>
        Live
      </Pill>
      <Pill tone="sage" dot>
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

export const actions: Record<string, Demo> = {
  button: { Component: ButtonDemo, width: "lg" },
  pill: { Component: PillDemo, width: "lg" },
  chip: { Component: ChipDemo },
  toggle: { Component: ToggleDemo },
  kbd: { Component: KbdDemo },
  separator: { Component: SeparatorDemo, width: "sm" },
};
