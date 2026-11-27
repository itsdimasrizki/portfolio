import { ViewTransition } from "react";

/**
 * Route-change transition (native View Transitions via React).
 * The leaving page sinks back and blurs out quickly; the arriving page rises
 * into focus. The navbar is anchored separately (see globals.css) so the
 * content reads as moving under a fixed header. Initial loads do not animate.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
