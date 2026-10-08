import type { Metadata } from "next";
import { DocHeader } from "@/components/docs/prose";
import { Markdown } from "@/components/docs/markdown";
import { readRepoFile } from "@/lib/repo-docs";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What changed in each VibeUI release.",
};

export default async function Changelog() {
  const source = await readRepoFile("CHANGELOG.md");
  // Drop the file's own title and preamble; keep the release sections.
  const body = source.slice(source.indexOf("\n## ") + 1);
  return (
    <>
      <DocHeader eyebrow="Project" title="Changelog">
        Every release, newest first. This is rendered from <code className="font-mono text-[13px]">CHANGELOG.md</code> in the repository.
      </DocHeader>
      <Markdown source={body} />
    </>
  );
}
