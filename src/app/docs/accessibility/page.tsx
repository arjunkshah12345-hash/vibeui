import type { Metadata } from "next";
import { Code, DocHeader, DocLink, DocTable, H2, List, Note, P } from "@/components/docs/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "What VibeUI components provide for keyboards, screen readers and reduced motion, and where the known gaps are.",
};

export default function Accessibility() {
  return (
    <>
      <DocHeader eyebrow="Customize" title="Accessibility">
        This page states exactly what each interactive component does today, including where it falls
        short, so you can decide what to add for your own product.
      </DocHeader>

      <H2 id="approach">Approach</H2>
      <List>
        <li><strong className="font-medium text-ink">Use the platform.</strong> Checkbox, Radio, Select, Slider and the text fields are real <Code>&lt;input&gt;</Code>/<Code>&lt;select&gt;</Code> elements, so forms, autofill, labels and assistive tech work without custom code.</li>
        <li><strong className="font-medium text-ink">Real roles on the rest.</strong> Custom widgets carry the ARIA roles and states that apply, and are reachable by keyboard.</li>
        <li><strong className="font-medium text-ink">Visible focus.</strong> A 2px accent outline everywhere, a 3px ring on fields.</li>
        <li><strong className="font-medium text-ink">Reduced motion.</strong> One global rule; see <DocLink href="/docs/motion">Motion</DocLink>.</li>
      </List>
      <Note title="Not an audit">
        These notes describe the implementation. They are not a WCAG conformance claim, and no
        automated or manual accessibility audit has been run on the library. Test your own screens.
      </Note>

      <H2 id="keyboard">Keyboard and semantics</H2>
      <DocTable
        head={["Component", "Semantics", "Keyboard"]}
        mono={[0]}
        rows={[
          ["Button, Toggle, Chip", "Native <button>; Toggle uses aria-pressed; loading sets aria-busy", "Enter / Space"],
          ["Checkbox, Radio", "Native inputs, grouped by name", "Space; arrow keys inside a radio group"],
          ["Switch", "role=switch with aria-checked", "Enter / Space"],
          ["Slider", "Native range input", "Arrow keys, Home / End, PageUp / PageDown"],
          ["Select", "Native <select>", "Native behavior"],
          ["OtpField", "One labelled input per digit; autocomplete=one-time-code", "Auto-advance, Backspace goes back, ← →, paste fills all"],
          ["Dialog", "role=dialog, aria-modal, aria-labelledby", "Esc closes; Tab and Shift+Tab are trapped; focus returns to the trigger"],
          ["Sheet", "role=dialog, aria-modal, aria-labelledby", "Esc closes; focus moves into the panel"],
          ["Popover", "Trigger sets aria-expanded", "Esc or outside click closes"],
          ["DropdownMenu", "role=menu, menuitem; trigger aria-haspopup", "↑ ↓ wrap; first item focused on open; Esc closes"],
          ["Command", "Input role=combobox with listbox / option items", "↑ ↓ move, Enter runs, typing filters"],
          ["Tabs", "tablist / tab / tabpanel with aria-controls; roving tabindex", "← → move and activate"],
          ["Accordion", "Button with aria-expanded / aria-controls; region panels", "Enter / Space"],
          ["Tooltip", "role=tooltip with aria-describedby", "Shown on hover and on focus within"],
          ["Toast", "Region aria-live=polite; each toast role=status", "Dismiss is a button; hover pauses the timer"],
          ["Breadcrumb, Pagination", "nav with aria-label; aria-current on the current item", "Native links and buttons"],
          ["Stepper", "Ordered list; aria-current=step", "Not interactive"],
          ["Progress, Meter", "role=progressbar / role=meter with aria-value*", "Not interactive"],
          ["Calendar", "Day buttons with aria-pressed and aria-current=date", "Tab through days"],
          ["RotatingCarousel", "role=group, aria-roledescription=carousel", "← → on the focused carousel; dots and buttons are focusable"],
          ["SplitShowcase", "role=slider with aria-value*", "← → adjust the divider"],
          ["Skeleton, Spinner", "Skeleton is aria-hidden; Spinner has role=status and a label", "—"],
        ]}
      />

      <H2 id="gaps">Known gaps</H2>
      <P>Listed plainly, so you can plan for them:</P>
      <List>
        <li><strong className="font-medium text-ink">Sheet and Popover do not trap focus.</strong> Dialog does. If a Sheet holds a form, consider rendering it inside a Dialog or adding the same Tab handling.</li>
        <li><strong className="font-medium text-ink">DropdownMenu does not return focus to its trigger</strong> on close, and has no type-ahead.</li>
        <li><strong className="font-medium text-ink">Command</strong> highlights the active row visually but does not set <Code>aria-activedescendant</Code>.</li>
        <li><strong className="font-medium text-ink">Segmented and Rating</strong> expose radio roles on buttons but do not implement arrow-key navigation between options; each is a Tab stop.</li>
        <li><strong className="font-medium text-ink">Tabs</strong> do not handle Home and End.</li>
        <li><strong className="font-medium text-ink">Calendar</strong> is a button grid without grid arrow-key navigation.</li>
        <li><strong className="font-medium text-ink">Decorative effects</strong> (Marquee, Typewriter, Scramble, Orbit and similar) animate indefinitely and do not offer a pause control. Avoid them for essential content, and note that reduced motion shortens but does not remove their text.</li>
      </List>
      <P>
        Fixes are welcome: see <DocLink href="/docs/contributing">Contributing</DocLink>, or open an
        issue on <DocLink href={`${site.url}/issues`}>GitHub</DocLink>.
      </P>

      <H2 id="contrast">Color and contrast</H2>
      <List>
        <li>Body text uses <Code>ink-soft</Code> and <Code>muted</Code> on <Code>surface</Code> or <Code>canvas</Code>. <Code>faint</Code> is for placeholders and decoration and is intentionally low contrast.</li>
        <li>Never rely on color alone: status pills and alerts always include text, and alerts include an icon.</li>
        <li>If you retint the accent, keep a 4.5:1 ratio between <Code>--accent</Code> and <Code>--accent-ink</Code>.</li>
      </List>

      <H2 id="testing">Testing your screens</H2>
      <List>
        <li>Tab through the whole page without a mouse. Every control should be reachable and visibly focused.</li>
        <li>Turn on reduced motion in your OS and reload. Nothing should depend on an animation to be understood.</li>
        <li>Run a screen reader on a form and an overlay. Labels, roles and names should be announced sensibly.</li>
        <li>Check both themes. Contrast problems often appear in only one.</li>
      </List>
    </>
  );
}
