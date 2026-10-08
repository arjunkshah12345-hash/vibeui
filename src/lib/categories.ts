/** Display metadata for registry categories. Safe to import from client code. */
export const categories = [
  { id: "actions", label: "Actions", blurb: "Buttons, chips, toggles and keys." },
  { id: "forms", label: "Forms", blurb: "Inputs that share one focus language." },
  { id: "feedback", label: "Feedback", blurb: "Status without shouting." },
  { id: "data", label: "Data & surfaces", blurb: "Cards, tables, stats and code." },
  { id: "overlays", label: "Overlays", blurb: "Dialogs, sheets, menus and command." },
  { id: "navigation", label: "Navigation", blurb: "Tabs, steps, trails and pages." },
  { id: "craft", label: "Signature", blurb: "The memorable pieces: 3D, magnetic, tactile." },
  { id: "text", label: "Text effects", blurb: "Expressive type, kept readable." },
  { id: "hover", label: "Hover effects", blurb: "Presence on pointer, never noise." },
  { id: "footers", label: "Footers", blurb: "Bars, mega columns, CTAs, legal." },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ComponentSummary = {
  name: string;
  title: string;
  category: string;
  description: string;
};

export function categoryLabel(id: string) {
  return categories.find((c) => c.id === id)?.label ?? id;
}
