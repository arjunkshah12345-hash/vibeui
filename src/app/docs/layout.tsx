import { DocsNav } from "@/components/docs/docs-nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-14 px-5 pb-28 pt-12">
      <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-52 shrink-0 overflow-y-auto lg:block">
        <DocsNav />
      </aside>
      <main className="min-w-0 max-w-[720px] flex-1">{children}</main>
    </div>
  );
}
