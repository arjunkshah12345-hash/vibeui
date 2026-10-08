#!/usr/bin/env node
/**
 * Extract each component's public props from its real TypeScript types and
 * write them into registry/components.json as `api`.
 *
 * Uses the TypeScript checker, so the docs are generated from the code and
 * cannot drift. Props inherited from React / the DOM are left out: only props
 * declared in this repo (including cva `variants`) are listed.
 *
 *   node scripts/props.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI = path.join(ROOT, "src/components/ui");
const REGISTRY = path.join(ROOT, "registry/components.json");

/** Fallback copy for props that every library has, so tables are never bare. */
const COMMON = {
  className: "Extra classes, merged with the component's own.",
  children: "Content rendered inside the component.",
  value: "Controlled value.",
  defaultValue: "Initial value when uncontrolled.",
  onChange: "Called when the value changes.",
  onValueChange: "Called with the new value.",
  onCheckedChange: "Called with the new checked state.",
  onPressedChange: "Called with the new pressed state.",
  onOpenChange: "Called when the open state should change.",
  open: "Controlled open state.",
  defaultOpen: "Initial open state when uncontrolled.",
  disabled: "Prevents interaction and dims the control.",
  placeholder: "Hint text shown while empty.",
  label: "Visible label.",
  title: "Heading text.",
  description: "Supporting text under the title.",
  items: "The items to render.",
  options: "The selectable options.",
  tone: "Semantic color: neutral, sky, sage, sand, rose.",
  size: "Size preset.",
  variant: "Visual style.",
  side: "Which edge or side to anchor to.",
  align: "Alignment relative to the trigger.",
  trigger: "The element that opens it.",
  href: "Link destination.",
  max: "Upper bound.",
  min: "Lower bound.",
  step: "Increment between values.",
  text: "The text to render.",
  duration: "Animation length in milliseconds (or seconds where noted).",
  delay: "Milliseconds before the animation starts.",
  id: "DOM id.",
  name: "Form field name.",
};

/** Props unique enough to a component that a short, specific sentence beats the generic one. */
Object.assign(COMMON, {
  radius: "Ring radius in pixels.",
  src: "Image URL.",
  action: "Optional action (usually a Button) shown alongside the message.",
  checked: "Controlled checked state.",
  defaultChecked: "Initial checked state when uncontrolled.",
  onClick: "Called on click.",
  maxHeight: "Maximum height in pixels before content scrolls.",
  autoFocus: "Focuses the input on mount.",
  left: "Content (or label) for the left side.",
  right: "Content (or label) for the right side.",
  icon: "Icon shown in the leading position.",
  hint: "Secondary text shown beneath.",
  links: "Array of { label, href } links.",
  brand: "Logo or wordmark node.",
  intervalMs: "Milliseconds between automatic changes.",
  orientation: "Layout direction.",
  type: "Whether one item or several can be open at once.",
  ratio: "Width divided by height, e.g. 16 / 9.",
  fallback: "Text used for initials when there is no image.",
  alt: "Alternative text for the image.",
  dismissible: "Shows a close button that animates the banner away.",
  pages: "Array of { title, body } pages.",
  defaultMonth: "Month to show before a date is chosen.",
  interactive: "Lifts and deepens the shadow on hover.",
  onRemove: "When provided, shows a remove button and calls this when pressed.",
  selected: "Renders the selected state.",
  code: "The source text to display and copy.",
  language: "Language used for highlighting (tsx, ts, css, json, bash).",
  filename: "Label shown in the header instead of the language.",
  color: "Any CSS color or var(--token).",
  onSelect: "Called with the id of the chosen item.",
  leftValue: "Magnitude of the left side.",
  rightValue: "Magnitude of the right side.",
  decimals: "Fraction digits to display.",
  suffix: "Text appended to the number.",
  prefix: "Text prepended to the number.",
  onFiles: "Called with the dropped or picked FileList.",
  front: "Content of the front face.",
  back: "Content of the back face.",
  files: "File names to show.",
  primary: "Primary call to action: { label, href }.",
  secondary: "Optional secondary action: { label, href }.",
  copyright: "Copyright text.",
  columns: "Link groups: { title, links[] }.",
  blurb: "Short description under the brand.",
  bottom: "Content for the bottom bar.",
  onSubmit: "Called with the email address on submit.",
  note: "Small text on the right.",
  error: "Error message; also styles the field as invalid.",
  leading: "Node shown before the text, such as an icon.",
  trailing: "Node shown after the text, such as a badge.",
  tabs: "Array of { value, label }.",
  pauseOnHover: "Pauses the animation while hovered.",
  reverse: "Runs the animation in the opposite direction.",
  segments: "Number of segments in the gauge.",
  body: "Message text.",
  time: "Timestamp label, e.g. “2m”.",
  unread: "Shows an animated unread dot.",
  center: "Content for the center of the ring.",
  length: "Number of digits.",
  page: "Current page, 1-based.",
  totalPages: "Total number of pages.",
  onPageChange: "Called with the new page number.",
  dot: "Shows a status dot before the label.",
  cite: "Attribution line.",
  readOnly: "Displays the rating without allowing changes.",
  words: "Words to cycle through.",
  autoPlay: "Advances automatically until hovered.",
  height: "Height in pixels; makes the component its own scroll container.",
  delta: "Change text shown under the value.",
  trend: "Direction of the change: up, down or neutral.",
  steps: "Array of { label, description? }.",
  current: "Zero-based index of the active step.",
  "aria-label": "Accessible name, required when there is no visible label.",
  tags: "Current tags.",
  external: "Opens in a new tab with rel=noreferrer.",
  pressed: "Controlled pressed state.",
  defaultPressed: "Initial pressed state when uncontrolled.",
  content: "Tooltip content.",
  subtitle: "Supporting text under the title.",
  meta: "Small label in the top corner.",
  phrases: "Phrases to type in sequence.",
  typingMs: "Milliseconds per typed character.",
  pauseMs: "Milliseconds to hold a finished phrase.",
});

const configPath = path.join(ROOT, "tsconfig.json");
const cfg = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, ROOT);
const files = fs
  .readdirSync(UI)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join(UI, f));

const program = ts.createProgram(files, { ...parsed.options, noEmit: true });
const checker = program.getTypeChecker();

const isOwn = (sym) =>
  (sym.declarations ?? []).some((d) => {
    const f = d.getSourceFile().fileName;
    return !f.includes("node_modules") && f.includes("/src/");
  });

const clip = (s, n = 140) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function bindingDefaults(param) {
  const out = new Map();
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      if (el.initializer) {
        const name = (el.propertyName ?? el.name).getText();
        out.set(name, el.initializer.getText());
      }
    }
  }
  return out;
}

function paramOf(node) {
  // function Foo(props) {}
  if (ts.isFunctionDeclaration(node)) return node.parameters[0];
  // const Foo = React.forwardRef((props, ref) => ...)
  if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
    const fn = node.initializer.arguments[0];
    if (fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) return fn.parameters[0];
  }
  return undefined;
}

function extract(file) {
  const sf = program.getSourceFile(file);
  const api = [];
  const visit = (node) => {
    let name;
    if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text)) {
      if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) name = node.name.text;
    } else if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && /^[A-Z]/.test(d.name.text) && paramOf(d)) {
          const props = describe(paramOf(d));
          api.push({ name: d.name.text, props, extends: extendsOf(paramOf(d)) });
        }
      }
      return;
    }
    if (name) api.push({ name, props: describe(paramOf(node)), extends: extendsOf(paramOf(node)) });
  };
  ts.forEachChild(sf, visit);
  return api;
}

/** Native attribute sets a component forwards to its root element. */
function extendsOf(param) {
  if (!param) return [];
  const text = param.parent?.getText?.() ?? param.getText();
  const found = new Set();
  for (const m of text.matchAll(/(?:React\.)?(\w*(?:HTMLAttributes|Attributes)<[^>]*>)/g)) found.add(m[1]);
  return [...found];
}

function describe(param) {
  if (!param) return [];
  const type = checker.getTypeAtLocation(param);
  const defaults = bindingDefaults(param);
  const rows = [];
  for (const sym of type.getProperties()) {
    if (!isOwn(sym)) continue;
    const name = sym.getName();
    if (name === "ref" || name === "key") continue;
    const decl = sym.valueDeclaration ?? sym.declarations?.[0];
    const t = checker.getTypeOfSymbolAtLocation(sym, decl ?? param);
    let typeText = checker.typeToString(
      t,
      undefined,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    );
    const optional = !!(sym.flags & ts.SymbolFlags.Optional);
    // Optional props carry `| undefined`; strip it for readability.
    typeText = typeText.replace(/\s*\|\s*undefined$/, "").replace(/\s*\|\s*null$/, "");
    const doc = ts.displayPartsToString(sym.getDocumentationComment(checker)).trim();
    rows.push({
      name,
      type: clip(typeText.replace(/\s+/g, " ")),
      required: !optional,
      default: defaults.get(name) ?? null,
      description: doc || COMMON[name] || "",
    });
  }
  // Required first, then in declaration order.
  return rows.sort((a, b) => Number(b.required) - Number(a.required));
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
let total = 0;
for (const c of registry.components) {
  const file = path.join(UI, `${c.name}.tsx`);
  const src = fs.readFileSync(file, "utf8");
  const fileLevel = [
    ...new Set([...src.matchAll(/(?:React\.)?(\w*(?:HTMLAttributes|Attributes)<[^>]*>)/g)].map((m) => m[1])),
  ];
  const api = extract(file).map((e) => ({
    ...e,
    // Components that declare `interface XProps extends React.ButtonHTMLAttributes<…>` keep it outside the param.
    extends: e.extends.length || fileLevel.length !== 1 ? e.extends : fileLevel,
  })).filter((e) => e.props.length > 0 || c.exports.includes(e.name));
  // Keep only exports the registry lists, in that order.
  c.api = c.exports
    .map((n) => api.find((e) => e.name === n) ?? { name: n, props: [], extends: [] })
    .filter(Boolean);
  total += c.api.reduce((n, e) => n + e.props.length, 0);
}
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + "\n");
console.log(`Wrote API for ${registry.components.length} components (${total} props) → registry/components.json`);
