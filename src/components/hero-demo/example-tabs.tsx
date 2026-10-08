import { FOCUS_RING } from "@/components/ui/focus-ring";
import { DEMO_EXAMPLES } from "@/content/hero-demo/examples";
import { stepsOf } from "./timeline";

export type ExampleTabsProps = {
  tab: number;
  step: number;
  intro: boolean;
  running: boolean;
  compact: boolean;
  onPick: (tab: number) => void;
};

/** The three examples as buttons, each with a bar showing how far through it the loop is. */
export function ExampleTabs({ tab, step, intro, running, compact, onPick }: ExampleTabsProps) {
  const durations = stepsOf(tab);
  const total = durations.reduce((a, b) => a + b, 0);
  const upTo = (n: number) => durations.slice(0, n).reduce((a, b) => a + b, 0);
  // The bar grows through the current step while playing, and holds still when paused.
  const width = intro ? 0 : Math.round(((running ? upTo(step + 1) : upTo(step)) / total) * 100);
  return (
    <div className={`mt-3 grid grid-cols-3 ${compact ? "gap-3" : "gap-6"} md:mt-[18px]`}>
      {DEMO_EXAMPLES.map((example, i) => (
        <button
          key={example.label}
          type="button"
          aria-pressed={i === tab}
          onClick={() => onPick(i)}
          className={`min-h-11 text-left transition-colors ${FOCUS_RING} ${i === tab ? "text-fg" : "text-dim hover:text-soft"}`}
        >
          <span className="block h-0.5 overflow-hidden rounded-sm bg-rule">
            <span
              className="block h-0.5 bg-amber"
              style={{
                width: i === tab ? `${width}%` : 0,
                transition: i === tab && running && !intro ? `width ${durations[step]}ms linear` : "none",
              }}
            />
          </span>
          <span className="mt-2.5 block text-sm font-semibold">
            {example.prefix && (
              <span className="mr-[7px] rounded border border-amber-edge px-1.5 py-px align-[2px] font-mono text-[11px] font-medium text-amber">
                {example.prefix}
              </span>
            )}
            {example.label}
          </span>
          {!compact && <span className="mt-[3px] block text-[12.5px] text-dim">{example.hint}</span>}
        </button>
      ))}
    </div>
  );
}
