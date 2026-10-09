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
    /** What the example assumes, in one line under the chart. */
    assumptions: string;
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
// - The savings chart is an illustration with assumed prices, labelled
//   "Example, not real data" (model in components/why-fluxiq/savings/model.ts):
//   an agent at $0.05 a run; FluxIQ $0.10 to build, $0.01 per judged run
//   (every run at first, tapering to 1 in 50 as trust grows), and $0.05 per
//   fix, on runs 4, 9, 21, 55, 160, and 480 (rarer as edge cases are
//   handled). The line is each run's cost, smoothed, so fixes show as bumps.
//   It assumes a repeatable, deterministic job. Over 1,000 runs: $50.00
//   against $0.84, cheaper in total from run 3. The site never claims runs
//   cost nothing.
export const WHY: WhyContent = {
  id: "why",
  eyebrow: "What it saves you",
  title: "The more it runs,",
  titleMuted: "the less you pay.",
  lede: "An AI agent bills you for the same thinking every time it does a job. FluxIQ pays to build the job once, then checks it less and fixes it less as it proves itself, so each run costs less than the last.",
  ledeShort: "An AI agent pays to think every run. With FluxIQ, each run costs less as the job is learned.",
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
    notes: { learn: "Builds the job", even: "Cheaper from run 3", saved: "Checks and fixes taper off" },
    axis: { first: "1 run", ten: "10", hundred: "100", last: "1,000 runs", lastShort: "1,000" },
    assumptions:
      "Assumes a repeatable job: $0.10 to build, $0.01 to judge a run (every run at first, then 1 in 50 once trusted), and $0.05 per fix. Fixes show as bumps that fade as edge cases are handled.",
    summary:
      "Example, not real data. Over 1,000 runs of one repeatable job, an AI agent costs $50.00 and FluxIQ $0.84: the build, judging that tapers as the job earns trust, and six fixes that grow rarer as edge cases are handled. FluxIQ costs more on the first run and is cheaper in total from run 3.",
  },
  points: [
    {
      icon: "coin",
      title: "Pay for what’s new",
      body: "Routine steps replay without a model. You pay for the build, checks, and fixes.",
      shortTitle: "Pay for what’s new",
      shortBody: "AI for the build, checks, and fixes, not routine steps.",
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
