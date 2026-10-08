import { ViewTransition } from "react";

// A template remounts on every navigation, which is what lets <ViewTransition>
// animate the page: the old page fades, the new one rises in. The header and
// footer sit outside it, so they stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
