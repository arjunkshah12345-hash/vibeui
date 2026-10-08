import type { Metadata } from "next";
import { Code, DocHeader, DocLink, H2, P } from "@/components/docs/prose";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Copy-paste patterns: a settings form, a ⌘K palette, a confirm dialog, and a searchable data table.",
};

export default function Recipes() {
  return (
    <>
      <DocHeader eyebrow="Guides" title="Recipes">
        Small, complete patterns that combine several components. Each one only uses props that exist
        in the library today.
      </DocHeader>

      <H2 id="settings-form">A settings form</H2>
      <P>
        <Code>Field</Code> handles the label, hint and error. <Code>Button</Code>&apos;s{" "}
        <Code>loading</Code> prop shows a spinner and disables it while saving, and the toast confirms
        the result. Needs <Code>ToastProvider</Code> near your root.
      </P>
      <CodeBlock
        language="tsx"
        filename="components/profile-form.tsx"
        code={`"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"

export function ProfileForm() {
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [digest, setDigest] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const invalid = email !== "" && !email.includes("@")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900)) // your request here
    setSaving(false)
    toast({ tone: "success", title: "Profile saved" })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-5">
      <Field label="Email" error={invalid ? "Enter a valid email address." : undefined}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={invalid}
        />
      </Field>
      <Field label="Language">
        <Select
          defaultValue="en"
          options={[
            { value: "en", label: "English" },
            { value: "de", label: "Deutsch" },
          ]}
        />
      </Field>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink">Weekly digest</span>
        <Switch checked={digest} onCheckedChange={setDigest} aria-label="Weekly digest" />
      </div>
      <Button type="submit" loading={saving} disabled={invalid}>
        Save changes
      </Button>
    </form>
  )
}`}
      />

      <H2 id="command-palette">A ⌘K command palette</H2>
      <P>
        <Code>Command</Code> already handles filtering, groups and arrow-key navigation, and{" "}
        <Code>autoFocus</Code> puts the cursor in the search box. Wrap it in a <Code>Dialog</Code> to
        get the overlay, the focus trap and the animation.
      </P>
      <CodeBlock
        language="tsx"
        filename="components/palette.tsx"
        code={`"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Palette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="Search" description="Jump to a page or run a command.">
        <Command
          autoFocus
          items={[
            { id: "/", label: "Home", group: "Pages" },
            { id: "/settings", label: "Settings", group: "Pages" },
            { id: "/billing", label: "Billing", group: "Pages" },
          ]}
          onSelect={(id) => {
            setOpen(false)
            router.push(id)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}`}
      />
      <P>
        This site&apos;s own palette (<Code>components/site/command-palette.tsx</Code>) is a lighter
        variant that renders <Code>Command</Code> directly in a portal, with no dialog chrome.
      </P>

      <H2 id="confirm-dialog">A destructive confirmation</H2>
      <P>
        Use the controlled form of <Code>Dialog</Code> so you can keep it open while the request is in
        flight. <Code>DialogFooter</Code> right-aligns the actions.
      </P>
      <CodeBlock
        language="tsx"
        filename="components/delete-project.tsx"
        code={`"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"

export function DeleteProject({ name, onDelete }: { name: string; onDelete: () => Promise<void> }) {
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title={\`Delete \${name}?\`}
          description="This removes the project and all of its data. It cannot be undone."
        >
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={busy}
              onClick={async () => {
                setBusy(true)
                await onDelete()
                setBusy(false)
                setOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}`}
      />

      <H2 id="data-table">A searchable, paginated table</H2>
      <CodeBlock
        language="tsx"
        filename="components/people-table.tsx"
        code={`"use client"

import * as React from "react"
import { Pagination } from "@/components/ui/pagination"
import { Pill } from "@/components/ui/pill"
import { SearchField } from "@/components/ui/search-field"
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table"

type Person = { name: string; role: string; active: boolean }
const PAGE = 5

export function PeopleTable({ people }: { people: Person[] }) {
  const [q, setQ] = React.useState("")
  const [page, setPage] = React.useState(1)

  const rows = people.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const visible = rows.slice((page - 1) * PAGE, page * PAGE)

  return (
    <div className="space-y-4">
      <SearchField
        value={q}
        onChange={(v) => {
          setQ(v)
          setPage(1)
        }}
        placeholder="Search people…"
        className="max-w-xs"
      />
      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Role</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {visible.map((p) => (
            <TR key={p.name}>
              <TD className="font-medium text-ink">{p.name}</TD>
              <TD>{p.role}</TD>
              <TD>
                <Pill tone={p.active ? "sage" : "outline"} dot pulse={p.active}>
                  {p.active ? "Active" : "Away"}
                </Pill>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <Pagination page={page} totalPages={pages} onPageChange={setPage} />
    </div>
  )
}`}
      />

      <H2 id="marketing">A marketing section with motion</H2>
      <P>
        <Code>BlurReveal</Code> fades content in as it scrolls into view and takes a <Code>delay</Code>{" "}
        for staggering. <Code>Marquee</Code> runs forever and pauses on hover.
      </P>
      <CodeBlock
        language="tsx"
        code={`import { BlurReveal } from "@/components/ui/blur-reveal"
import { Marquee } from "@/components/ui/marquee"

export function Logos({ names }: { names: string[] }) {
  return (
    <section className="space-y-10 py-24 text-center">
      <BlurReveal>
        <h2 className="font-display text-5xl tracking-tight">Trusted by teams who care.</h2>
      </BlurReveal>
      <BlurReveal delay={150}>
        <p className="mx-auto max-w-md text-muted">Small studios and large products alike.</p>
      </BlurReveal>
      <Marquee duration={50}>
        {names.map((n) => (
          <span key={n} className="whitespace-nowrap font-display text-3xl text-faint">{n}</span>
        ))}
      </Marquee>
    </section>
  )
}`}
      />

      <H2 id="more">More</H2>
      <P>
        The component pages under <DocLink href="/components">Components</DocLink> each include a live
        example you can copy from, and the home page is itself built from the library: see{" "}
        <Code>src/app/page.tsx</Code> and <Code>src/components/home/</Code>.
      </P>
    </>
  );
}
