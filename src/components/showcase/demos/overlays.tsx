"use client";

import * as React from "react";
import {
  Copy,
  Export,
  Link as LinkIcon,
  MagnifyingGlass,
  Moon,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Field, Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ToastDemoButton, useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants())}>Rename project</DialogTrigger>
      <DialogContent
        title="Rename project"
        description="This changes the name everywhere it’s shown."
      >
        <Field label="Name">
          <Input defaultValue="Marketing site" autoFocus />
        </Field>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast({ tone: "success", title: "Project renamed" });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SheetDemo() {
  const [dark, setDark] = React.useState(false);
  return (
    <div className="flex gap-3">
      <Sheet
        title="Display settings"
        description="Applies to this device."
        trigger={<Button variant="secondary">Open sheet</Button>}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink">Dark appearance</span>
            <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark appearance" />
          </div>
          <Field label="Display name">
            <Input defaultValue="Maya Kline" />
          </Field>
        </div>
      </Sheet>
      <Sheet
        side="bottom"
        title="Share"
        trigger={<Button variant="ghost">Bottom sheet</Button>}
      >
        <p className="text-sm text-muted">Anchored to the bottom edge, great on mobile.</p>
      </Sheet>
    </div>
  );
}

function PopoverDemo() {
  return (
    <Popover
      trigger={<Button variant="secondary">Account</Button>}
      className="w-64"
    >
      <div className="flex items-center gap-3">
        <Avatar fallback="Maya Kline" />
        <div>
          <p className="text-sm font-medium text-ink">Maya Kline</p>
          <p className="text-xs text-muted">maya@studio.com</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 border-t border-line pt-3">
        <Button size="sm" variant="secondary" className="flex-1">Profile</Button>
        <Button size="sm" variant="ghost" className="flex-1">Sign out</Button>
      </div>
    </Popover>
  );
}

function DropdownDemo() {
  const { toast } = useToast();
  return (
    <DropdownMenu
      trigger={<Button variant="secondary">Actions</Button>}
      items={[
        { label: "Rename", icon: <PencilSimple size={14} weight="bold" />, shortcut: "R" },
        { label: "Duplicate", icon: <Copy size={14} weight="bold" />, shortcut: "⌘D" },
        {
          label: "Copy link",
          icon: <LinkIcon size={14} weight="bold" />,
          onSelect: () => toast({ title: "Link copied" }),
        },
        { label: "Export", icon: <Export size={14} weight="bold" /> },
        { separator: true },
        { label: "Delete", icon: <Trash size={14} weight="bold" />, danger: true },
      ]}
    />
  );
}

function CommandDemo() {
  const { toast } = useToast();
  return (
    <Command
      className="w-full"
      onSelect={(id) => toast({ title: `Ran “${id}”` })}
      items={[
        { id: "Go to components", label: "Go to components", hint: "G C", group: "Navigate", icon: <MagnifyingGlass size={14} weight="bold" /> },
        { id: "Toggle theme", label: "Toggle theme", hint: "T", group: "Navigate", icon: <Moon size={14} weight="bold" /> },
        { id: "Copy button", label: "Copy Button source", group: "Components" },
        { id: "Copy dialog", label: "Copy Dialog source", group: "Components" },
        { id: "Copy dock", label: "Copy Dock source", group: "Components" },
      ]}
    />
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      <ToastDemoButton />
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Heads up", description: "Something needs a look." })}
      >
        Neutral
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({ tone: "error", title: "Upload failed", description: "The file was too large." })
        }
      >
        Error
      </Button>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
      <Tooltip content="Top (default)">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Appears below" side="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Copy token path" side="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
    </div>
  );
}

function CommandTile() {
  return (
    <Command
      className={cn(TILE_W, "shadow-pop")}
      items={[
        { id: "components", label: "Go to components", hint: "G C", icon: <MagnifyingGlass size={14} weight="bold" /> },
        { id: "theme", label: "Toggle theme", hint: "T", icon: <Moon size={14} weight="bold" /> },
        { id: "button", label: "Copy Button source" },
      ]}
    />
  );
}

export const overlays: Record<string, Demo> = {
  dialog: { Component: DialogDemo },
  sheet: { Component: SheetDemo },
  popover: { Component: PopoverDemo, top: true, height: 300 },
  "dropdown-menu": { Component: DropdownDemo, top: true, height: 340 },
  command: { Component: CommandDemo, width: "md", Tile: CommandTile },
  toast: { Component: ToastDemo },
  tooltip: { Component: TooltipDemo },
};
