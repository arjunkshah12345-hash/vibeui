"use client";

import * as React from "react";
import { Cube, MagnifyingGlass, Moon, Palette } from "@phosphor-icons/react";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { NotificationItem } from "@/components/ui/notification";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const card = "rounded-lg border border-line bg-surface shadow-quiet";

/** Staggers the entrance of each piece. */
function Piece({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("animate-fade-up", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * A composed interface built only from library components. Everything here is
 * live: type in the palette, pick a date, flip the switch.
 */
export function HeroCollage() {
  const [date, setDate] = React.useState(() => new Date(2026, 9, 14));
  const [notify, setNotify] = React.useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-muted/50 bg-dots">
      <div className="[mask-image:linear-gradient(to_bottom,#000_72%,transparent)]">
        <div className="mx-auto grid max-h-[560px] items-start gap-4 overflow-hidden p-4 sm:p-6 md:grid-cols-2 md:max-h-[600px] lg:max-h-[640px] lg:grid-cols-[1fr_1.12fr_1fr] lg:gap-5 lg:p-8">
          {/* left */}
          <div className="flex flex-col gap-4 lg:gap-5 lg:pt-16">
            <Piece delay={120} className={cn(card, "p-5")}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">Shipping 0.2</p>
                <Pill tone="sage" dot>
                  On track
                </Pill>
              </div>
              <p className="mt-1 text-[13px] text-muted">104 components · 15 docs pages</p>
              <AvatarGroup max={4} className="mt-4">
                <Avatar fallback="Maya Kline" />
                <Avatar fallback="Rishi Shah" />
                <Avatar fallback="Ana López" />
                <Avatar fallback="Sam Ito" />
                <Avatar fallback="Jo Park" />
              </AvatarGroup>
              <Progress className="mt-4" label="Docs coverage" value={92} />
            </Piece>
            <Piece delay={260} className="hidden md:block">
              <Calendar value={date} onChange={setDate} defaultMonth={new Date(2026, 9, 1)} />
            </Piece>
          </div>

          {/* middle */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <Piece delay={60}>
              <Command
                className="w-full"
                items={[
                  { id: "components", label: "Go to components", hint: "G C", group: "Navigate", icon: <MagnifyingGlass size={14} weight="bold" /> },
                  { id: "theme", label: "Toggle theme", hint: "T", group: "Navigate", icon: <Moon size={14} weight="bold" /> },
                  { id: "tokens", label: "Open the token file", group: "Navigate", icon: <Palette size={14} weight="bold" /> },
                  { id: "button", label: "Copy Button source", group: "Components", icon: <Cube size={14} weight="bold" /> },
                  { id: "dialog", label: "Copy Dialog source", group: "Components", icon: <Cube size={14} weight="bold" /> },
                ]}
              />
            </Piece>
            <Piece delay={200} className={cn(card, "p-1.5")}>
              <NotificationItem
                unread
                title="Draft published"
                body="Your changelog is live on the preview URL."
                time="2m"
              />
              <NotificationItem
                unread
                title="New comment"
                body="Maya left a note on the pricing section."
                time="1h"
              />
              <NotificationItem title="Theme synced" body="Dark tokens were updated." time="3h" />
            </Piece>
          </div>

          {/* right */}
          <div className="hidden flex-col gap-4 md:flex lg:gap-5 lg:pt-10">
            <Piece delay={160} className="grid grid-cols-2 gap-3">
              <Stat label="Components" value="104" delta="12 new" trend="up" />
              <Stat label="Runtime" value="0 kb" delta="Copy-owned" trend="neutral" />
            </Piece>
            <Piece delay={300} className={cn(card, "p-5")}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">Weekly digest</p>
                <Pill tone="accent" dot pulse>
                  Live
                </Pill>
              </div>
              <p className="mt-1 text-[13px] text-muted">Sent every Monday at 9:00.</p>
              <Input className="mt-4" placeholder="you@studio.com" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
                  Notify me
                </span>
                <Button size="sm" variant="accent">
                  Subscribe
                </Button>
              </div>
            </Piece>
            <Piece delay={420}>
              <Alert tone="sage" title="Tokens synced">
                Accent and radius updated across 104 components.
              </Alert>
            </Piece>
          </div>
        </div>
      </div>
    </div>
  );
}
