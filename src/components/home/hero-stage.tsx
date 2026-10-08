"use client";

import * as React from "react";
import { BellSimple, Compass, Gear, House, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme/theme-provider";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Dock } from "@/components/ui/dock";
import { NotificationItem } from "@/components/ui/notification";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/segmented";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TradingCard } from "@/components/ui/trading-card";

/** A live composition of real components: the theme control here really switches the site theme. */
export function HeroStage() {
  const { theme, setTheme } = useTheme();
  const [radius, setRadius] = React.useState(58);
  const [motion, setMotion] = React.useState(true);
  const icon = (I: typeof House) => <I size={20} weight="duotone" />;

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 hero-glow opacity-80 blur-2xl"
      />
      <div className="grid gap-4 rounded-xl border border-line bg-surface-muted/60 p-3 shadow-lift backdrop-blur-sm sm:p-4 md:grid-cols-[1.1fr_0.9fr_1.1fr]">
        {/* Appearance */}
        <div className="flex flex-col rounded-lg border border-line bg-surface p-5 shadow-quiet">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-[-0.01em] text-ink">Appearance</p>
            <Pill tone="sage" dot>Live</Pill>
          </div>
          <p className="mt-1 text-[13px] text-muted">This one is real. Try it.</p>
          <Segmented
            className="mt-5 w-full"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
          <div className="mt-6 space-y-5">
            <Slider label="Corner radius" value={radius} onValueChange={setRadius} />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ink-soft">Motion</span>
              <Switch checked={motion} onCheckedChange={setMotion} aria-label="Motion" />
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between pt-7">
            <AvatarGroup>
              <Avatar fallback="Maya Kline" size="sm" />
              <Avatar fallback="Rishi Shah" size="sm" />
              <Avatar fallback="Ana López" size="sm" />
            </AvatarGroup>
            <span className="text-xs text-muted">3 collaborators</span>
          </div>
        </div>

        {/* Card */}
        <div className="flex items-center justify-center rounded-lg border border-line bg-surface bg-dots p-5 shadow-quiet">
          <TradingCard
            meta="No. 104"
            title="Vibe"
            subtitle="Tilts with the cursor and catches a soft glare."
          >
            <Pill tone="accent">Signature</Pill>
          </TradingCard>
        </div>

        {/* Activity */}
        <div className="flex flex-col rounded-lg border border-line bg-surface p-3 shadow-quiet">
          <div className="flex items-center justify-between px-2 pb-1 pt-2">
            <p className="text-sm font-medium tracking-[-0.01em] text-ink">Activity</p>
            <BellSimple size={16} weight="bold" className="text-faint" />
          </div>
          <NotificationItem unread title="Draft published" body="Your changelog is live." time="2m" />
          <NotificationItem unread title="New comment" body="Maya left a note on pricing." time="1h" />
          <NotificationItem title="Theme synced" body="Dark tokens updated." time="3h" />
          <div className="mt-auto px-3 pb-3 pt-4">
            <Progress label="Release 0.2" value={82} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex justify-center md:-mt-7">
        <Dock
          items={[
            { id: "home", label: "Home", icon: icon(House) },
            { id: "grid", label: "Components", icon: icon(SquaresFour) },
            { id: "find", label: "Search", icon: icon(MagnifyingGlass) },
            { id: "explore", label: "Explore", icon: icon(Compass) },
            { id: "gear", label: "Settings", icon: icon(Gear) },
          ]}
        />
      </div>
    </div>
  );
}
