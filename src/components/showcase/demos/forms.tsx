"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDrop } from "@/components/ui/file-drop";
import { Field, Input, Label, Textarea } from "@/components/ui/input";
import { NumberField } from "@/components/ui/number-field";
import { OtpField } from "@/components/ui/otp-field";
import { PasswordField } from "@/components/ui/password-field";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Rating } from "@/components/ui/rating";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/ui/tag-input";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

function InputDemo() {
  return (
    <div className="w-full space-y-4">
      <Field label="Email" hint="We’ll only use this for receipts.">
        <Input type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Username" error="That name is taken.">
        <Input defaultValue="vibe" aria-invalid />
      </Field>
      <Field label="Bio">
        <Textarea rows={3} placeholder="A line or two about you…" />
      </Field>
      <div>
        <Label htmlFor="disabled-in">Disabled</Label>
        <Input id="disabled-in" disabled value="Read-only value" readOnly />
      </div>
    </div>
  );
}

function SelectDemo() {
  const [v, setV] = React.useState("");
  return (
    <div className="w-full space-y-3">
      <Field label="Framework">
        <Select
          value={v}
          onValueChange={setV}
          placeholder="Choose a framework"
          options={[
            { value: "next", label: "Next.js" },
            { value: "vite", label: "Vite" },
            { value: "remix", label: "React Router" },
            { value: "astro", label: "Astro" },
          ]}
        />
      </Field>
      <p className="text-xs text-muted">Selected: {v || "nothing yet"}</p>
    </div>
  );
}

function CheckboxDemo() {
  const [all, setAll] = React.useState(true);
  return (
    <div className="space-y-4">
      <Checkbox
        label="Include dark tokens"
        description="Adds the .dark palette to your CSS."
        checked={all}
        onCheckedChange={setAll}
      />
      <Checkbox label="Export CSS variables" defaultChecked />
      <Checkbox label="Generate TypeScript types" />
      <Checkbox label="Disabled option" disabled />
    </div>
  );
}

function RadioDemo() {
  const [plan, setPlan] = React.useState("pro");
  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <RadioItem value="free" label="Free" description="One project, community support." />
      <RadioItem value="pro" label="Pro" description="Unlimited projects and priority help." />
      <RadioItem value="team" label="Team" description="Seats, roles and shared tokens." />
    </RadioGroup>
  );
}

function SwitchDemo() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  const row = "flex items-center justify-between gap-6";
  return (
    <div className="w-full space-y-4">
      <div className={row}>
        <div>
          <p className="text-sm font-medium text-ink">Email notifications</p>
          <p className="text-[13px] text-muted">Weekly product digest.</p>
        </div>
        <Switch checked={a} onCheckedChange={setA} aria-label="Email notifications" />
      </div>
      <div className={row}>
        <div>
          <p className="text-sm font-medium text-ink">Reduced motion</p>
          <p className="text-[13px] text-muted">Tone animations down.</p>
        </div>
        <Switch checked={b} onCheckedChange={setB} aria-label="Reduced motion" />
      </div>
      <div className={row}>
        <p className="text-sm text-muted">Disabled</p>
        <Switch disabled aria-label="Disabled" />
      </div>
    </div>
  );
}

function SliderDemo() {
  const [volume, setVolume] = React.useState(62);
  const [range, setRange] = React.useState(24);
  return (
    <div className="w-full space-y-5">
      <Slider label="Volume" value={volume} onValueChange={setVolume} />
      <Slider label="Corner radius" min={0} max={32} value={range} onValueChange={setRange} />
    </div>
  );
}

function SearchDemo() {
  const [q, setQ] = React.useState("");
  return (
    <div className="w-full space-y-2">
      <SearchField value={q} onChange={setQ} placeholder="Search components…" />
      <p className="text-xs text-muted">
        {q ? `Searching for “${q}”` : "Type to see the clear button appear."}
      </p>
    </div>
  );
}

function PasswordDemo() {
  return (
    <Field label="Password" className="w-full">
      <PasswordField placeholder="At least 8 characters" defaultValue="hunter2hunter2" />
    </Field>
  );
}

function NumberDemo() {
  const [qty, setQty] = React.useState(3);
  return (
    <div className="flex flex-col items-center gap-3">
      <NumberField value={qty} onChange={setQty} min={1} max={10} />
      <p className="text-xs text-muted">1 to 10 · {qty} selected</p>
    </div>
  );
}

function OtpDemo() {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-col items-center gap-3">
      <OtpField value={code} onChange={setCode} />
      <p className="text-xs text-muted">
        {code.length === 6 ? "Code complete ✓" : "Type or paste a 6 digit code."}
      </p>
    </div>
  );
}

function TagDemo() {
  const [tags, setTags] = React.useState(["minimal", "tokens"]);
  return (
    <div className="w-full space-y-2">
      <TagInput tags={tags} onChange={setTags} />
      <p className="text-xs text-muted">Enter or comma to add · Backspace to remove.</p>
    </div>
  );
}

function FileDemo() {
  return <FileDrop className="w-full" />;
}

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 7));
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Calendar value={date} onChange={setDate} />
      <p className="text-xs text-muted">
        {date
          ? date.toLocaleDateString("en-US", { dateStyle: "full" })
          : "Pick a date"}
      </p>
    </div>
  );
}

function RatingDemo() {
  const [stars, setStars] = React.useState(4);
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating value={stars} onChange={setStars} size={26} />
      <div className="flex items-center gap-2 text-[13px] text-muted">
        Read only <Rating value={3} readOnly size={16} />
      </div>
    </div>
  );
}

/* Gallery tiles */

function InputTile() {
  return (
    <div className={cn(TILE_W, "space-y-4")}>
      <Field label="Email" hint="Only used for receipts.">
        <Input type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Username" error="That name is taken.">
        <Input defaultValue="vibe" aria-invalid />
      </Field>
    </div>
  );
}

function OtpTile() {
  const [code, setCode] = React.useState("48");
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-3")}>
      <OtpField value={code} onChange={setCode} />
      <p className="text-xs text-muted">
        {code.length === 6 ? "Code complete ✓" : "Type or paste a 6 digit code."}
      </p>
    </div>
  );
}

export const forms: Record<string, Demo> = {
  input: { Component: InputDemo, Tile: InputTile, width: "sm", height: 460, tileScale: 0.5 },
  select: { Component: SelectDemo, width: "sm" },
  checkbox: { Component: CheckboxDemo, width: "sm" },
  radio: { Component: RadioDemo, width: "sm" },
  switch: { Component: SwitchDemo, width: "sm" },
  slider: { Component: SliderDemo, width: "sm" },
  "search-field": { Component: SearchDemo, width: "sm" },
  "password-field": { Component: PasswordDemo, width: "sm" },
  "number-field": { Component: NumberDemo },
  "otp-field": { Component: OtpDemo, Tile: OtpTile },
  "tag-input": { Component: TagDemo, width: "sm" },
  "file-drop": { Component: FileDemo, width: "sm" },
  calendar: { Component: CalendarDemo, width: "sm", tileScale: 0.7 },
  rating: { Component: RatingDemo },
};
