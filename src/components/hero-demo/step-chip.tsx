import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { ProgressRing } from "./progress-ring";

export type StepChipProps = { ms: number; runKey: string; running: boolean; visible: boolean };

/** Desktop: the step's timer and how to skip it, in the stage's bottom-left corner. */
export function StepChip({ ms, runKey, running, visible }: StepChipProps) {
  return (
    <span
      className="pointer-events-none absolute bottom-3.5 left-3 z-[26] inline-flex items-center gap-[7px] rounded-full border border-white/14 bg-[rgba(17,19,26,0.92)] py-1.5 pr-[11px] pl-2 text-[11.5px] font-semibold text-[#eef4fb] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 250ms ease" }}
    >
      <ProgressRing ms={ms} runKey={runKey} running={running} />
      {DEMO_LABELS.clickToSkip}
    </span>
  );
}
