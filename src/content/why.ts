import type { HomeSectionId } from "./types";

/** The static icon drawn beside a value point. */
export type WhyIcon = "coin" | "gauge" | "shield" | "sliders";

export type WhyPoint = {
  icon: WhyIcon;
  /** The tile's words, from `md` up. */
  title: string;
  body: string;
  /** The icon list's shorter words, below `md`. */
  shortTitle: string;
  shortBody: string;
};

export type WhyContent = {
  id: HomeSectionId;
  eyebrow: string;
  /** The headline, then its muted second half. */
  title: string;
  titleMuted: string;
  /** The lede from `md` up, and the shorter one below it. */
  lede: string;
  ledeShort: string;
  card: {
    example: string;
    learningLabel: string;
    savedLabel: string;
    /** Wraps the run count: "over 12 runs of one job". */
    runsBefore: string;
    runsAfter: string;
    run: string;
    runs: string;
    chartTitle: string;
    agent: string;
    flux: string;
    agentLine: string;
    notes: { learn: string; even: string; saved: string };
    axis: { first: string; ten: string; hundred: string; last: string; lastShort: string };
    /** Read by assistive tech in place of the animation, with the final figures. */
    summary: string;
  };
  points: readonly WhyPoint[];
};

// Sources (FluxIQ Core f6ef9f4):
// - Limits: Flow Settings "LLM Budget" (interventions, tokens, spend per Flow;
//   "When exhausted: Ask before continuing / Stop training"),
//   apps/web/src/features/automation-studio/settings/FlowSettingsView.tsx.
//   Limits are user-set, so the site names no dollar figure.
// - Checks: runtime/result-check-schedule (checked early, then less often;
//   a graph change restarts the count).
// - Modes: "Fully adaptive", "Manual approval", "No LLM intervention" in the
//   same view; reverts in features/automation-studio/adaptations.
// - The savings chart is an illustration with assumed prices (agent $0.05 a
//   run, learn $0.10, then $0.00016 a run on average for checks and fixes),
//   shaped after the paper and labelled "Example, not real data".
export const WHY: WhyContent = {
  id: "why",
  eyebrow: "What it saves you",
  title: "The more it runs,",
  titleMuted: "the less you pay.",
  lede: "An AI agent bills you for the same thinking every time it does a job. FluxIQ learns the job once, then repeats it for free. You only pay again when something actually changes.",
  ledeShort: "An AI agent pays to think every run. FluxIQ learns the job once, then repeats it for free.",
  card: {
    example: "Example, not real data",
    learningLabel: "Learning the job",
    savedLabel: "You’ve saved",
    runsBefore: "over",
    runsAfter: "of one job",
    run: "run",
    runs: "runs",
    chartTitle: "Cost per run",
    agent: "AI agent",
    flux: "FluxIQ",
    agentLine: "$0.05 every run",
    notes: { learn: "Learns the job", even: "Cheaper from run 3", saved: "You keep the difference" },
    axis: { first: "1 run", ten: "10", hundred: "100", last: "1,000 runs", lastShort: "1,000" },
    summary:
      "Example, not real data. Over 1,000 runs of one job, an AI agent costs $50.00 and FluxIQ costs $0.26, so you save $49.74. FluxIQ pays more on the first run to learn the job and is cheaper from run 3.",
  },
  points: [
    {
      icon: "coin",
      title: "Pay for what’s new",
      body: "Routine runs replay saved steps with no model at all.",
      shortTitle: "Pay for what’s new",
      shortBody: "Routine runs need no AI at all.",
    },
    {
      icon: "gauge",
      title: "Your limits, per Flow",
      body: "Cap calls, tokens, and spend. At a cap, FluxIQ asks or stops.",
      shortTitle: "Your limits",
      shortBody: "Cap spend per Flow. At a cap, it asks or stops.",
    },
    {
      icon: "shield",
      title: "Checks that relax",
      body: "Every run is checked at first, then less often as it earns trust.",
      shortTitle: "Checks that relax",
      shortBody: "Checked often at first, less as it earns trust.",
    },
    {
      icon: "sliders",
      title: "You set the autonomy",
      body: "Fully adaptive, approve each fix, or no AI. Every repair can be reverted.",
      shortTitle: "Your autonomy",
      shortBody: "Adaptive, approve each fix, or no AI.",
    },
  ],
};
