import type { HomeSectionId, SplitTitle } from "./types";

/** One stage of a Flow's life, shown in the stage list beside the chat. */
export type HowStage = {
  num: string;
  title: string;
  body: string;
};

/** One planned step in the chat's plan card. */
export type HowPlanStep = {
  verb: string;
  target: string;
};

/** A colour for a run card's tag: checked closely, or passed and trusted. */
export type HowRunTone = "check" | "ok";

/** One run reported in the chat. */
export type HowRun = {
  title: string;
  detail: string;
  tag: string;
  cost: string;
  tone: HowRunTone;
};

export type HowItWorksContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: SplitTitle;
  lede: string;
  /** The shorter lede shown below `md`. */
  ledeShort: string;
  stages: readonly HowStage[];
  chat: {
    name: string;
    job: string;
    /** What the illustration shows, for assistive tech. */
    description: string;
    ask: string;
    planIntro: string;
    steps: readonly HowPlanStep[];
    /** The tag on the email step, and its phone form. */
    askTag: string;
    askTagShort: string;
    fixedTag: string;
    permission: string;
    allow: string;
    askEachTime: string;
    allowed: string;
    stopTitle: string;
    stopBody: string;
    keep: string;
    kept: string;
    fixCost: string;
    runs: readonly HowRun[];
    after: readonly HowRun[];
    badges: {
      setup: string;
      building: string;
      running: string;
      fixing: string;
      fixed: string;
    };
  };
};

// Sources (Core f6ef9f4): instruction-first authoring from a permission- and
// capability-filtered node catalog, with purchases, deletion, and sending
// always held for a person (runtime/flow-bootstrap,
// docs/architecture/automation-studio/llm-flow-bootstrap.md); a patch is kept
// only after a whole run on it is judged a success (judged-promotion.ts).
// Copy follows the approved v5 boards (HomeV4 §3, HomeV5Mobile §3); the job,
// run numbers, row counts, and the $0.05 fix are an invented example.
export const HOW_IT_WORKS: HowItWorksContent = {
  id: "how-it-works",
  eyebrow: "How it works",
  title: { lead: "Show it once.", muted: "It keeps working." },
  lede: "No scripts to write and nothing to babysit. FluxIQ learns the job, repeats it on its own, and fixes it when a site changes.",
  ledeShort: "No scripts, nothing to babysit.",
  stages: [
    { num: "01", title: "Show it once", body: "Type what you want, or do it once while FluxIQ watches." },
    {
      num: "02",
      title: "It builds the job",
      body: "From real actions only. Anything that buys, deletes, or sends waits for your OK.",
    },
    {
      num: "03",
      title: "It runs on its own",
      body: "Same steps every time, with no AI bill. Checked closely at first, then less as it proves itself.",
    },
    {
      num: "04",
      title: "It fixes itself",
      body: "A site changes? FluxIQ works out why, fixes it once, and keeps the fix when a full run passes.",
    },
  ],
  chat: {
    name: "FluxIQ",
    job: "Morning roofer leads",
    description:
      "An example chat with FluxIQ. You ask it to add new roofers in Calgary to your sheet every morning. FluxIQ lays out six steps and asks before the one that sends an email, and you allow it. Runs 1, 2, 8, and 33 add rows at $0.00 in AI, checked at first and then trusted. Run 400 stops because the site moved its search box; FluxIQ finds the new one, you keep the fix for $0.05, a test run passes, and runs 401 and 402 carry on at $0.00.",
    ask: "Every morning, add new roofers in Calgary to my sheet.",
    planIntro: "On it. Here's the job, built from real actions:",
    steps: [
      { verb: "Open", target: "the leads directory" },
      { verb: "Search", target: "for “roofing”" },
      { verb: "Filter", target: "to Calgary" },
      { verb: "Read", target: "every result, every page" },
      { verb: "Add", target: "new rows to your sheet" },
      { verb: "Email", target: "you a summary" },
    ],
    askTag: "asks you first",
    askTagShort: "asks first",
    fixedTag: "fixed",
    permission: "Emailing you the summary sends a message. Should I do it every morning?",
    allow: "Allow",
    askEachTime: "Ask me each time",
    allowed: "✓ Allowed by you",
    stopTitle: "Run 400 stopped",
    stopBody: "The site moved its search box into the header. I found the new one and tested a fix.",
    keep: "Keep the fix",
    kept: "✓ Fix kept",
    fixCost: "one fix, $0.05",
    runs: [
      { title: "Run 1", detail: "18 new rows", tag: "checked", cost: "$0.00", tone: "check" },
      { title: "Run 2", detail: "11 new rows", tag: "checked", cost: "$0.00", tone: "check" },
      { title: "Run 8", detail: "9 new rows", tag: "checked", cost: "$0.00", tone: "check" },
      { title: "Run 33", detail: "14 new rows", tag: "trusted", cost: "$0.00", tone: "ok" },
    ],
    after: [
      { title: "Test run", detail: "21 new rows", tag: "passed", cost: "$0.00", tone: "ok" },
      { title: "Run 401", detail: "15 new rows", tag: "checked", cost: "$0.00", tone: "check" },
      { title: "Run 402", detail: "12 new rows", tag: "checked", cost: "$0.00", tone: "check" },
    ],
    badges: {
      setup: "Setting up",
      building: "Building",
      running: "Running · $0.00 AI",
      fixing: "Fixing",
      fixed: "Fixed",
    },
  },
};
