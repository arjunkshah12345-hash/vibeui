import { readFile } from "node:fs/promises";
import path from "node:path";
import registryJson from "../../registry/components.json";
import { categories, type ComponentSummary } from "./categories";

export type ComponentMeta = ComponentSummary & {
  file: string;
  exports: string[];
  client: boolean;
  dependencies: string[];
  registryDependencies: string[];
};

const all = registryJson.components as ComponentMeta[];

/** Components ordered by category (as shown on the site), then name. */
export function getComponents(): ComponentMeta[] {
  const order = new Map<string, number>(categories.map((c, i) => [c.id, i]));
  return [...all].sort(
    (a, b) =>
      (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99) ||
      a.name.localeCompare(b.name),
  );
}

export function getSummaries(): ComponentSummary[] {
  return getComponents().map(({ name, title, category, description }) => ({
    name,
    title,
    category,
    description,
  }));
}

export function getComponent(slug: string): ComponentMeta | undefined {
  return all.find((c) => c.name === slug);
}

export function getNeighbors(slug: string) {
  const list = getComponents();
  const i = list.findIndex((c) => c.name === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}

/** Raw source of a component, read at build time. */
export async function getSource(slug: string): Promise<string> {
  "use cache";
  const file = path.join(process.cwd(), "src/components/ui", `${slug}.tsx`);
  return readFile(file, "utf8");
}
