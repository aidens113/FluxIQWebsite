import type { HowItWorksContent, HowPhrase } from "@/content/how-it-works";
import { FitText } from "../fit-text";
import { StatusPill } from "../status-pill";
import type { SideFrame, SideTone, StepState } from "./frame";

type Split = HowItWorksContent["split"];

export type OutcomeCardProps = {
  name: string;
  /** The recorded script's name reads quieter than FluxIQ's. */
  quiet?: boolean;
  steps: readonly [HowPhrase, HowPhrase, HowPhrase];
  frame: SideFrame;
  split: Split;
  /** The day of the run, for the sheet's label. */
  day: string;
};

const RED = "text-[#fa6571]";

const EDGE: Record<SideTone, string> = {
  ok: "border-[#2e4a38]",
  attention: "border-amber-edge",
  bad: "border-[#4a2228]",
  neutral: "border-rule",
};

const OUT: Record<SideTone, string> = { ok: "text-ok", attention: "text-amber", bad: RED, neutral: "text-dim" };

const STEP: Record<StepState, { mark: string; tone: string; edge: string }> = {
  ok: { mark: "✓", tone: "text-ok bg-ok/12", edge: "border-[#1f2125]" },
  bad: { mark: "✕", tone: `${RED} bg-[#fa6571]/12`, edge: "border-[#4a2228]" },
  work: { mark: "…", tone: "text-amber bg-amber/12", edge: "border-amber-edge" },
  idle: { mark: "–", tone: "text-dim bg-dim/12", edge: "border-[#1f2125]" },
};

/** The text colour of a step's note, which follows its step. */
const NOTE: Record<StepState, string> = { ok: "text-ok", bad: RED, work: "text-amber", idle: "text-dim" };

/**
 * One side of the redesign split: the job's three steps as they run (a
 * spinner while a step works; a failing step shakes), the sheet's rows
 * filling in as they land (from `md` up), and a one-line outcome.
 */
export function OutcomeCard({ name, quiet, steps, frame, split, day }: OutcomeCardProps) {
  return (
    <div
      className={`rounded-[18px] border bg-panel p-4 transition-[border-color] duration-400 md:p-6 ${EDGE[frame.edge]}`}
    >
      <div className="flex items-center gap-2 md:gap-2.5">
        <p className={`text-sm font-semibold md:text-[15px] ${quiet ? "text-muted" : "text-fg"}`}>{name}</p>
        <StatusPill tone={frame.pillTone}>
          <FitText phrase={split.pills[frame.pill]} />
        </StatusPill>
      </div>
      <ol className="mt-3 flex flex-col gap-1.5 md:mt-[18px] md:gap-2">
        {frame.steps.map((step, i) => {
          const look = STEP[step.state];
          return (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: the three steps are fixed and never reorder.
              key={i}
              className={`grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-2 rounded-[9px] border bg-[#141518] px-2.5 py-2 text-[12.5px] transition-[border-color,color] duration-300 md:grid-cols-[22px_minmax(0,1fr)_auto] md:gap-2.5 md:rounded-[10px] md:px-3 md:py-[9px] md:text-[13.5px] ${look.edge} ${step.state === "idle" ? "text-dim" : "text-fg"} ${frame.shake && step.state === "bad" ? "how-shake" : ""}`}
            >
              <span
                className={`inline-flex size-5 items-center justify-center rounded-full text-[10.5px] font-bold transition-colors duration-300 md:size-[22px] md:text-[11px] ${look.tone}`}
              >
                {step.state === "work" ? (
                  <span className="size-2.5 animate-spin rounded-full border-[1.5px] border-amber border-t-transparent md:size-3" />
                ) : (
                  look.mark
                )}
              </span>
              <span>
                <FitText phrase={steps[i] as HowPhrase} />
              </span>
              <span
                className={`text-[11px] whitespace-nowrap transition-colors duration-300 md:text-xs ${NOTE[step.state]}`}
              >
                {step.note && <FitText phrase={split.notes[step.note]} />}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-[18px] hidden border-t border-[#1d1f23] pt-4 md:block">
        <p className="font-mono text-[11px] tracking-[0.06em] text-dim uppercase">
          {split.sheet} {day}
        </p>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {frame.rows.map((on, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: the sheet's three rows are fixed.
              key={i}
              className={`block h-3 overflow-hidden rounded border transition-[border-color] duration-300 ${on ? "border-solid border-ok/40" : "border-dashed border-edge"}`}
              style={{ width: `${[100, 86, 92][i]}%` }}
            >
              {/* A landing row fills from the left. */}
              <span
                className={`block h-full origin-left bg-ok/20 transition-transform duration-300 ease-out ${on ? "scale-x-100" : "scale-x-0"}`}
              />
            </span>
          ))}
        </div>
      </div>
      <p
        className={`mt-3 text-[13px] leading-[1.45] font-medium transition-colors duration-300 md:text-[13.5px] ${OUT[frame.outTone]}`}
      >
        <FitText phrase={split.outcomes[frame.out]} />
      </p>
    </div>
  );
}
