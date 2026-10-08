import type { Metadata } from "next";
import { DocHeader } from "@/components/docs/prose";
import { Markdown } from "@/components/docs/markdown";
import { readRepoFile } from "@/lib/repo-docs";

export const metadata: Metadata = {
  title: "Contributing",
  description: "How to set up the repo, add a component, run the checks and open a good pull request.",
};

export default async function Contributing() {
  const source = await readRepoFile("CONTRIBUTING.md");
  return (
    <>
      <DocHeader eyebrow="Project" title="Contributing">
        This page is the repository&apos;s CONTRIBUTING.md, rendered here so it stays in one place.
      </DocHeader>
      <Markdown source={source.replace(/^[\s\S]*?\n## Principles/, "## Principles")} />
    </>
  );
}
