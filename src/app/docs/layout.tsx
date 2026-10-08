import { DocPager } from "@/components/docs/doc-pager";
import { DocToc } from "@/components/docs/doc-toc";
import { DocsNav } from "@/components/docs/docs-nav";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-12 px-5 pb-28 pt-8 lg:pt-12">
      <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-52 shrink-0 overflow-y-auto lg:block">
        <DocsNav />
      </aside>
      <main className="min-w-0 max-w-[740px] flex-1">
        <DocsMobileNav />
        {children}
        <DocPager />
      </main>
      <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-52 shrink-0 overflow-y-auto xl:block">
        <DocToc />
      </aside>
    </div>
  );
}
