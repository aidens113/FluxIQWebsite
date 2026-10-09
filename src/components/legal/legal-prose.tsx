import { FOCUS_RING } from "@/components/ui/focus-ring";
import type { LegalText } from "@/content/types";

/** A run of legal text, with any links in it. */
export function LegalProse({ runs }: { runs: readonly LegalText[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.href ? (
          <a
            // biome-ignore lint/suspicious/noArrayIndexKey: runs are static and never reorder
            key={i}
            href={run.href}
            target={run.external ? "_blank" : undefined}
            rel={run.external ? "noopener noreferrer" : undefined}
            className={`rounded-sm text-fg underline underline-offset-4 transition-colors hover:text-amber ${FOCUS_RING}`}
          >
            {run.text}
            {run.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: runs are static and never reorder
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}
