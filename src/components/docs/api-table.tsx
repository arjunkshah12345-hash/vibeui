import type { ApiEntry } from "@/lib/registry";

/** One export's props, as a table generated from the component's real TypeScript types. */
export function ApiTable({ entry }: { entry: ApiEntry }) {
  return (
    <div className="mt-6 first:mt-0">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-mono text-[14px] font-medium text-ink">&lt;{entry.name}&gt;</h3>
        {entry.extends.length ? (
          <p className="text-[12.5px] text-muted">
            also accepts every{" "}
            <code className="rounded-[5px] border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[11.5px] text-ink-soft">
              {entry.extends[0]}
            </code>{" "}
            attribute
          </p>
        ) : null}
      </div>
      {entry.props.length === 0 ? (
        <p className="rounded-md border border-dashed border-line-strong px-4 py-3 text-[13px] text-muted">
          No props of its own{entry.extends.length ? ": it forwards native attributes to the element." : "."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-quiet">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-line bg-surface-muted/60 text-xs text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Prop</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Default</th>
                <th className="px-4 py-2.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              {entry.props.map((p) => (
                <tr key={p.name}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-ink">
                    {p.name}
                    {p.required ? (
                      <span title="Required" className="ml-1 text-accent">
                        *
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-[300px] px-4 py-3 font-mono text-[12px] leading-relaxed text-pastel-sky-ink">
                    {p.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-muted">
                    {p.default ?? "—"}
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-ink-soft">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
