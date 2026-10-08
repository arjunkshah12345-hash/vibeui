"use client";

import * as React from "react";
import { FolderOpen } from "@phosphor-icons/react";
import { Alert } from "@/components/ui/alert";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Empty } from "@/components/ui/empty";
import { Meter } from "@/components/ui/meter";
import { NotificationItem } from "@/components/ui/notification";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { TILE_W, type Demo } from "../demo";

function AlertDemo() {
  return (
    <div className="w-full space-y-3">
      <Alert tone="sage" title="Tokens synced">
        Light and dark palettes match.
      </Alert>
      <Alert tone="sky" title="Heads up">
        Prefer hairlines over shadows.
      </Alert>
      <Alert tone="sand" title="Draft">
        Publish when the copy is ready.
      </Alert>
      <Alert tone="rose" title="Connection lost">
        We’ll retry in a few seconds.
      </Alert>
    </div>
  );
}

function BannerDemo() {
  return (
    <Banner dismissible action={<Button size="sm" variant="secondary">Read more</Button>}>
      VibeUI 0.2 is here: new tokens, 104 refined components.
    </Banner>
  );
}

function CalloutDemo() {
  return (
    <Callout title="Good to know">
      Callouts use a quiet accent rule. Reach for an Alert when the message is urgent.
    </Callout>
  );
}

function EmptyDemo() {
  return (
    <Empty
      className="w-full"
      icon={<FolderOpen size={20} weight="bold" />}
      title="No projects yet"
      description="Create your first project to see it here."
      action={<Button size="sm">New project</Button>}
    />
  );
}

function MeterDemo() {
  return (
    <div className="w-full space-y-5">
      <Meter label="Storage" value={72} />
      <Meter label="Healthy" value={38} tone="sage" />
      <Meter label="Almost full" value={94} tone="rose" />
    </div>
  );
}

function NotificationDemo() {
  return (
    <div className="w-full rounded-lg border border-line bg-surface p-1.5 shadow-quiet">
      <NotificationItem unread title="Draft published" body="Your changelog is live on the preview URL." time="2m" />
      <NotificationItem unread title="New comment" body="Maya left a note on the pricing section." time="1h" />
      <NotificationItem title="Theme synced" body="Dark tokens were updated." time="3h" />
    </div>
  );
}

function ProgressDemo() {
  const [v, setV] = React.useState(12);
  React.useEffect(() => {
    const id = window.setInterval(() => setV((x) => (x >= 100 ? 8 : Math.min(100, x + 11))), 900);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="w-full space-y-5">
      <Progress label="Uploading assets" value={v} />
      <Progress label="Static" value={64} />
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex w-full gap-3.5">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2.5 pt-1">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={36} className="text-accent" />
      <Button disabled>
        <Spinner size={14} className="text-surface" /> Saving
      </Button>
    </div>
  );
}


/* Gallery tiles */

function AlertTile() {
  return (
    <div className={cn(TILE_W, "space-y-2.5")}>
      <Alert tone="sage" title="Tokens synced">Light and dark match.</Alert>
      <Alert tone="rose" title="Connection lost">Retrying shortly.</Alert>
    </div>
  );
}

function CalloutTile() {
  return (
    <Callout title="Good to know" className={TILE_W}>
      Callouts use a quiet accent rule. Reach for an Alert when it is urgent.
    </Callout>
  );
}

function EmptyTile() {
  return (
    <Empty
      className={cn(TILE_W, "py-8")}
      icon={<FolderOpen size={20} weight="bold" />}
      title="No projects yet"
      action={<Button size="sm">New project</Button>}
    />
  );
}

function SkeletonTile() {
  return (
    <div className={cn(TILE_W, "flex gap-3.5 rounded-lg border border-line bg-surface p-4 shadow-quiet")}>
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2.5 pt-1">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function SpinnerTile() {
  return (
    <div className={cn(TILE_W, "flex flex-col items-center gap-6")}>
      <div className="flex items-center gap-6">
        <Spinner size={16} />
        <Spinner size={24} />
        <Spinner size={36} className="text-accent" />
      </div>
      <Button disabled>
        <Spinner size={14} className="text-surface" /> Saving
      </Button>
    </div>
  );
}

function MeterTile() {
  return (
    <div className={cn(TILE_W, "space-y-5")}>
      <Meter label="Storage" value={72} />
      <Meter label="Healthy" value={38} tone="sage" />
      <Meter label="Almost full" value={94} tone="rose" />
    </div>
  );
}

export const feedback: Record<string, Demo> = {
  alert: { Component: AlertDemo, width: "md", Tile: AlertTile },
  banner: { Component: BannerDemo, width: "lg" },
  callout: { Component: CalloutDemo, Tile: CalloutTile },
  empty: { Component: EmptyDemo, width: "sm", Tile: EmptyTile },
  meter: { Component: MeterDemo, width: "sm", Tile: MeterTile },
  notification: { Component: NotificationDemo },
  progress: { Component: ProgressDemo, width: "sm" },
  skeleton: { Component: SkeletonDemo, Tile: SkeletonTile },
  spinner: { Component: SpinnerDemo, Tile: SpinnerTile },
};
