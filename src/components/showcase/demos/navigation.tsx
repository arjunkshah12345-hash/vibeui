"use client";

import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline } from "@/components/ui/timeline";
import type { Demo } from "../demo";

function TabsDemo() {
  return (
    <div className="w-full space-y-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-muted">Pill style. Arrow keys move between tabs.</p>
        </TabsContent>
        <TabsContent value="tokens">
          <p className="text-sm text-muted">CSS variables drive every surface.</p>
        </TabsContent>
        <TabsContent value="source">
          <p className="text-sm text-muted">Copy the file. It’s yours.</p>
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="a" variant="line">
        <TabsList>
          <TabsTrigger value="a">Activity</TabsTrigger>
          <TabsTrigger value="b">Members</TabsTrigger>
          <TabsTrigger value="c">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="a"><p className="text-sm text-muted">Underline style.</p></TabsContent>
        <TabsContent value="b"><p className="text-sm text-muted">Six members.</p></TabsContent>
        <TabsContent value="c"><p className="text-sm text-muted">Pro plan.</p></TabsContent>
      </Tabs>
    </div>
  );
}

function SegmentedDemo() {
  const [density, setDensity] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  return (
    <div className="flex flex-col items-center gap-5">
      <Segmented
        value={density}
        onChange={setDensity}
        options={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "spacious", label: "Spacious" },
        ]}
      />
      <Segmented
        value={view}
        onChange={setView}
        options={[
          { value: "grid", label: "Grid" },
          { value: "list", label: "List" },
        ]}
      />
    </div>
  );
}

function AccordionDemo() {
  return (
    <Accordion
      className="w-full"
      items={[
        { id: "1", title: "How does dark mode work?", content: "A .dark class on <html> swaps the CSS variables. A tiny inline script sets it before paint, so there is no flash." },
        { id: "2", title: "Do I need a package?", content: "No. Copy the component file, install the four peer dependencies, and import it." },
        { id: "3", title: "Can I retint it?", content: "Change --accent and the canvas tokens. Everything follows." },
      ]}
    />
  );
}

function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Components", href: "#" },
        { label: "Navigation", href: "#" },
        { label: "Breadcrumb" },
      ]}
    />
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(5);
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} totalPages={24} onPageChange={setPage} />
      <p className="text-xs text-muted">Page {page} of 24</p>
    </div>
  );
}

function StepperDemo() {
  const [step, setStep] = React.useState(1);
  return (
    <div className="w-full space-y-6">
      <Stepper
        orientation="horizontal"
        current={step}
        steps={[
          { label: "Tokens" },
          { label: "Primitives" },
          { label: "Signature" },
          { label: "Ship" },
        ]}
      />
      <div className="flex justify-center gap-2">
        <button
          type="button"
          className="rounded-sm border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:opacity-40"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-sm bg-ink px-3 py-1.5 text-xs text-surface disabled:opacity-40"
          disabled={step === 4}
          onClick={() => setStep((s) => s + 1)}
        >
          Next step
        </button>
      </div>
    </div>
  );
}

function TimelineDemo() {
  return (
    <Timeline
      items={[
        { title: "Tokens defined", time: "Mon", body: "Canvas, ink, accent and the dark palette." },
        { title: "Primitives shipped", time: "Wed", body: "Buttons, fields, cards and feedback." },
        { title: "Signature pieces", time: "Fri", body: "Carousel, dock and trading card." },
      ]}
    />
  );
}

export const navigation: Record<string, Demo> = {
  tabs: { Component: TabsDemo, width: "sm" },
  segmented: { Component: SegmentedDemo },
  accordion: { Component: AccordionDemo, top: true, tileScale: 0.8 },
  breadcrumb: { Component: BreadcrumbDemo },
  pagination: { Component: PaginationDemo },
  stepper: { Component: StepperDemo, width: "lg" },
  timeline: { Component: TimelineDemo, width: "sm" },
};
