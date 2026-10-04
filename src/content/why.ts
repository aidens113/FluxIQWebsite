import type { WhyContent } from "./types";

// Sources (FluxIQ Core f6ef9f4):
// - Limits: Flow Settings "LLM Budget" (interventions, tokens, spend per Flow;
//   "When exhausted: Ask before continuing / Stop training"),
//   apps/web/src/features/automation-studio/settings/FlowSettingsView.tsx.
//   Limits are user-set, so the site names no dollar figure.
// - Checks: runtime/result-check-schedule (checked early, then less often;
//   a graph change restarts the count).
// - Modes: "Fully adaptive", "Manual approval", "No LLM intervention" in the
//   same view; reverts in features/automation-studio/adaptations.
export const WHY: WhyContent = {
  id: "why",
  titleLines: [
    "Scripts break when a site changes.",
    "Agents pay for the same thinking every run.",
    "FluxIQ keeps what works and only thinks again when it has to.",
  ],
  points: [
    {
      title: "Pay for what’s new",
      body: "Routine runs replay saved steps with no model at all. AI is only called for something FluxIQ hasn’t seen before.",
    },
    {
      title: "Your limits, per Flow",
      body: "Cap how often AI can step in, how many tokens it uses, and what it spends. When a cap is hit, FluxIQ asks you or stops. Your call.",
    },
    {
      title: "Checks that relax as trust grows",
      body: "Results are checked on the first runs, then less and less often. Change the Flow and checking starts over.",
    },
    {
      title: "You choose how much it fixes itself",
      body: "Fully adaptive, approve every change, or no AI at all. Every repair is logged and can be reverted.",
    },
  ],
};
