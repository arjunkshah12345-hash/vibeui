import type { ComponentType } from "react";

export type Demo = {
  /** The example itself. May use hooks. */
  Component: ComponentType;
  /** Max width of the example on its stage. Defaults to "md". */
  width?: "sm" | "md" | "lg" | "full";
  /** Align to the top of the stage instead of centering (menus, lists). */
  top?: boolean;
  /** Stage min-height on the detail page, in px. */
  height?: number;
  /** Scale factor in gallery tiles so large examples fit. */
  tileScale?: number;
  /**
   * A compact, fixed-width composition for gallery tiles. When set it replaces
   * `Component` in the gallery, so the grid reads as a set of tidy posters while
   * the detail page keeps the full example.
   */
  Tile?: ComponentType;
};

/** Every gallery tile composition is laid out in this column. */
export const TILE_W = "w-[264px]";

export const widths = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-2xl",
  full: "max-w-none",
} as const;

/** A small gradient image as a data URI, used by image demos (no network). */
export function art(a: string, b: string, label = "") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='380' height='260' viewBox='0 0 380 260'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='380' height='260' fill='url(#g)'/><circle cx='300' cy='70' r='46' fill='white' fill-opacity='.22'/><text x='22' y='232' font-family='Georgia,serif' font-size='30' fill='white' fill-opacity='.92'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
