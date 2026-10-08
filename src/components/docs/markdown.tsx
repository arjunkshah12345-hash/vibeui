import * as React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Code, DocLink, H2, H3, List, OL, P } from "./prose";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\[|\]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** `code`, **bold**, and [links](href) inside a line. */
function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const tok = m[0];
    if (tok.startsWith("`")) out.push(<Code key={i++}>{tok.slice(1, -1)}</Code>);
    else if (tok.startsWith("**"))
      out.push(
        <strong key={i++} className="font-medium text-ink">
          {tok.slice(2, -2)}
        </strong>,
      );
    else {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      out.push(
        <DocLink key={i++} href={href}>
          {label}
        </DocLink>,
      );
    }
    last = at + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * A small markdown renderer for the repo's own docs: headings, paragraphs,
 * lists, fenced code, inline code, bold and links. Not a general parser.
 */
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={k++} className="my-5" language={lang} code={body.join("\n")} />);
      continue;
    }
    if (line.startsWith("# ")) {
      i++;
      continue; // the page supplies its own title
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push(<H2 key={k++} id={slug(text)}>{text.replace(/\[|\]/g, "")}</H2>);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(<H3 key={k++}>{line.slice(4).trim()}</H3>);
      i++;
      continue;
    }
    if (/^\s*[-*] /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\s*[-*] /.test(lines[i])) {
        items.push(<li key={items.length}>{inline(lines[i].replace(/^\s*[-*] /, ""))}</li>);
        i++;
      }
      blocks.push(<List key={k++}>{items}</List>);
      continue;
    }
    if (/^\s*\d+\. /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) {
        items.push(<li key={items.length}>{inline(lines[i].replace(/^\s*\d+\. /, ""))}</li>);
        i++;
      }
      blocks.push(<OL key={k++}>{items}</OL>);
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#|```|\s*[-*] |\s*\d+\. )/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    blocks.push(<P key={k++}>{inline(para.join(" "))}</P>);
  }

  return <>{blocks}</>;
}
