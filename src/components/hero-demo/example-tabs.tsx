import type { ReactNode } from "react";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import { DEMO_EXAMPLES } from "@/content/hero-demo/examples";
import { stepsOf } from "./timeline";

export type ExampleTabsProps = {
  tab: number;
  step: number;
  running: boolean;
  onPick: (tab: number) => void;
  /** The pause control, at the row's end; on a phone it sits in the view switch row instead. */
  pause?: ReactNode;
};

/**
 * Under the stage: the three examples as tabs, each with a bar showing how
 * far through it the loop is.
 */
export function ExampleTabs({ tab, step, running, onPick, pause }: ExampleTabsProps) {
  const durations = stepsOf(tab);
  const total = durations.reduce((a, b) => a + b, 0);
  const upTo = (n: number) => durations.slice(0, n).reduce((a, b) => a + b, 0);
  // The bar grows through the current step while playing, and holds still when paused.
  const width = Math.round(((running ? upTo(step + 1) : upTo(step)) / total) * 100);
  return (
    <div className="mt-4 flex items-end gap-4 sm:gap-6">
      <div className="grid flex-1 grid-cols-3 gap-3 sm:gap-6">
        {DEMO_EXAMPLES.map((example, i) => (
          <button
            key={example.label}
            type="button"
            aria-pressed={i === tab}
            onClick={() => onPick(i)}
            className={`min-h-11 rounded-sm text-left transition-colors ${FOCUS_RING} ${i === tab ? "text-fg" : "text-dim hover:text-soft"}`}
          >
            <span className="block h-0.5 overflow-hidden rounded-sm bg-rule">
              <span
                className="block h-0.5 bg-amber"
                style={{
                  width: i === tab ? `${width}%` : 0,
                  transition: i === tab && running ? `width ${durations[step]}ms linear` : "none",
                }}
              />
            </span>
            <span className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap">
              {example.prefix && (
                <span className="rounded border border-amber-edge px-1 font-mono text-[10.5px] leading-4 font-medium text-amber">
                  {example.prefix}
                </span>
              )}
              {example.label}
            </span>
          </button>
        ))}
      </div>
      {pause}
    </div>
  );
}
