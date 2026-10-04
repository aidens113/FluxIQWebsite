import type { HowItWorksContent } from "./types";

// Sources (Core f6ef9f4): instruction-first authoring from a permission- and
// capability-filtered node catalog, with purchases, deletion, and sending
// always held for a person (runtime/flow-bootstrap,
// docs/architecture/automation-studio/llm-flow-bootstrap.md); a patch is kept
// only after a whole run on it is judged a success (judged-promotion.ts).
export const HOW_IT_WORKS: HowItWorksContent = {
  id: "how-it-works",
  title: "How a Flow is born, and stays alive",
  steps: [
    {
      label: "01 · show",
      title: "Say it or show it",
      body: "Type what you want done, or record it once in your browser.",
    },
    {
      label: "02 · build",
      title: "Built from real parts",
      body: "AI assembles the Flow only from actions FluxIQ actually has. Buying, deleting, or sending always waits for a person.",
    },
    {
      label: "03 · run",
      title: "Replays without AI",
      body: "Saved steps run the same way every time, and results get checked until the Flow has earned trust.",
    },
    {
      label: "04 · repair",
      title: "Fixes itself, with your say",
      body: "When a site changes or a check fails, FluxIQ works out why, proposes a fix, and keeps it only once a full run succeeds.",
      highlight: true,
    },
  ],
};
