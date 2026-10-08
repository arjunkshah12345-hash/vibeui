"use client";

import * as React from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Token = { text: string; kind?: "comment" | "string" | "keyword" | "number" | "fn" | "tag" };

const KEYWORDS = new Set(
  "import export from default const let var function return if else for while new class extends type interface async await as typeof void null undefined true false npm npx git cd".split(
    " ",
  ),
);

const kindClass: Record<NonNullable<Token["kind"]>, string> = {
  comment: "text-faint italic",
  string: "text-pastel-sage-ink",
  keyword: "text-pastel-sky-ink",
  number: "text-pastel-sand-ink",
  fn: "text-pastel-rose-ink",
  tag: "text-pastel-rose-ink",
};

// Tiny single-pass tokenizer: good enough for tsx, ts, css, json and shell.
const PATTERN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Z][\w.]*)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$-]*)(?=\()|([A-Za-z_$][\w$]*)/g;

function tokenize(code: string, language: string): Token[] {
  const hashComments = language === "bash" || language === "sh" || language === "yaml";
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(PATTERN)) {
    const index = m.index ?? 0;
    if (index > last) tokens.push({ text: code.slice(last, index) });
    const [text, comment, str, tag, num, fn, word] = m;
    if (comment) {
      const isHash = comment.startsWith("#");
      if (isHash && !hashComments) tokens.push({ text });
      else tokens.push({ text, kind: "comment" });
    } else if (str) tokens.push({ text, kind: "string" });
    else if (tag) tokens.push({ text, kind: "tag" });
    else if (num) tokens.push({ text, kind: "number" });
    else if (fn) tokens.push({ text, kind: KEYWORDS.has(fn) ? "keyword" : "fn" });
    else if (word) tokens.push({ text, kind: KEYWORDS.has(word) ? "keyword" : undefined });
    else tokens.push({ text });
    last = index + text.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last) });
  return tokens;
}

/** Code panel with lightweight syntax highlighting and one-click copy. */
export function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
  maxHeight,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  maxHeight?: number;
}) {
  const [copied, setCopied] = React.useState(false);
  const tokens = React.useMemo(() => tokenize(code, language), [code, language]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface-sunken text-left",
        className,
      )}
    >
      <div className="flex h-10 items-center justify-between border-b border-line bg-surface px-3.5">
        <span className="font-mono text-[11px] text-muted">
          {filename ?? language}
        </span>
        <button
          type="button"
          aria-label="Copy code"
          className="inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? (
            <Check size={13} weight="bold" className="text-pastel-sage-ink" />
          ) : (
            <Copy size={13} weight="bold" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="overflow-auto p-4 font-mono text-[12.5px] leading-[1.7] text-ink-soft"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>
          {tokens.map((t, i) =>
            t.kind ? (
              <span key={i} className={kindClass[t.kind]}>
                {t.text}
              </span>
            ) : (
              t.text
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
