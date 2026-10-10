# Changelog

All notable changes to VibeUI are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
uses [Semantic Versioning](https://semver.org/) (while below 1.0, minor
versions may include breaking changes).

## [Unreleased]

## [0.3.0] - 2026-10-09

### Changed

- VibeUI is now on npm: `npx vibeui add button`. The published package installs only the two dependencies the MCP server needs; the website's own dependencies (Next, React, Motion) are dev-only, so `npx vibeui` stays small.
- Light mode is now monochrome like dark mode: the default accent is the ink, and a single `--accent` variable still retints everything.
- Rebuilt the landing page: a one-line animated headline, a live composed interface in the hero, a "ten shelves" section whose previews fit their cards and reveal on scroll, a short agents section, and the source viewer.
- Gallery tiles now use compact, fixed-width `Tile` compositions for Actions, Data & surfaces and the weakest tiles in Forms, Feedback and Overlays, so the grid reads evenly. Detail pages keep the full examples.
- A short last row in each gallery section now ends with a "next shelf" card instead of leaving a gap.

### Fixed

- `Command`: moving the active item no longer scrolls the whole page, only the list.

### Added

- Eight Signature components, all dependency-free:
  - `LiquidGlass`: a surface that refracts what is behind it, with chromatic edges and a pointer-tracked rim light (frosted fallback outside Chromium).
  - `LiquidSwitch`: a toggle with a glass thumb that stretches when held, drags freely and settles with a squish.
  - `GooeyMenu`: a metaball menu whose actions bud off the button like liquid.
  - `DynamicIsland`: a pill that morphs between states with a soft overshoot.
  - `AiOrb`: a living orb for voice and AI, driven by `state` and an audio `level`, tinted by `--accent`.
  - `MeshGradient`: a flowing WebGL gradient with a static CSS fallback.
  - `ScratchReveal`: a scratch-off foil over any content.
  - `Odometer`: mechanical rolling digits with `Intl.NumberFormat` formatting.
- An `animate-eq` token (the island's equalizer bars).
- A social share image and a large Twitter card.
- `BASE_PATH` build option: set it (for example `/ui`) to serve the site under a sub-path of another domain.

## [0.2.0] - 2026-10-07

A visual and behavioral overhaul of the whole library, a rebuilt website, and a much more detailed documentation set. See the [upgrade guide](/docs/upgrading).

### Added

- A new token system in `templates/vibeui.css`: warm light and dark palettes, an accent, layered shadows, radii, easing, keyframes and the Tailwind `dark` variant, all in one file.
- Motion in every component: hover, press and focus feedback, entrance animations, and exit animations for Dialog, Sheet, Popover, DropdownMenu, HoverCard, Toast and Banner.
- New props and variants: Button `accent` / `danger` variants, `icon-sm` size and `loading`; Pill `accent` tone and `pulse`; Avatar `xs` / `xl` sizes and `AvatarGroup max`; Field `error`; Tabs `line` variant; Accordion `type` and `defaultOpen`; Stepper `horizontal`; Meter `tone` and `segments`; Marquee `reverse` and `duration`; OrbitRing `center`; CountUp `decimals`; BlurReveal `delay`; ListItem `leading`; Separator `animated`; Calendar `defaultMonth`; Sheet `bottom` and `description`; Popover `side`; DropdownMenu `icon`, `shortcut` and `align`; Command `icon` and `autoFocus`; Toast `tone`; SocialLinks `youtube` and `instagram`; Checkbox and Radio `description`.
- `DialogFooter`, and ColorSwatch click-to-copy.
- Generated API reference for every component (`api` in the registry), produced from the real TypeScript types by `scripts/props.mjs`.
- CLI and MCP `add` copy sibling components a file imports (`registryDependencies`), and report `clsx` and `tailwind-merge` as required peers.
- A website with a landing page, a searchable `/components` gallery of live previews, per-component pages with install steps, API tables and source, and fifteen documentation pages.
- Route transitions, a ⌘K command palette, and a `?theme=light|dark` URL override.
- Repository docs: `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `THIRD_PARTY_NOTICES.md`, issue and pull request templates, and a CI workflow.

### Changed

- Dark mode is monochrome: the accent is the ink itself. Light mode keeps the vermilion accent.
- Radii are now 8 / 12 / 16 / 22 px and registered with `@theme` (`rounded-sm|md|lg|xl`).
- Checkbox and Radio are native inputs; Dialog and Sheet are portaled, and Dialog traps and restores focus.
- FlipText is self-contained; RollingText accepts any number of words; BookFlip performs a real page turn; SplitShowcase uses `clip-path` and pointer events; ScrollStack is pure CSS.
- `/gallery` is now `/components`.
- Smooth scrolling was removed so Back and Forward restore position instantly.

### Fixed

- Copied components did not animate because keyframes were not in the token file.
- `dark:` utilities followed the OS setting instead of the `.dark` class.
- `vibeui add dialog` could leave a broken import by not copying sibling components.
- Duplicate React keys in Pagination, overlapping Checkbox labels, clipped text effects, an empty HoverSlide, a non-expanding HoverExpand, a clipped Calendar and several effect timings.
- Lint errors from `setState` in effects (Typewriter, Calendar, theme provider).

## [0.1.0] - 2026-10-07

Initial open-source release: about 100 components, a showcase site, the CLI and the MCP server.
