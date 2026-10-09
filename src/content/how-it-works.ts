import type { HomeSectionId, Point, SplitTitle, Tone } from "./types";

/** Words with a shorter form for a phone; a plain string reads the same everywhere. */
export type HowPhrase = string | { full: string; short: string };

/** What one run left behind: a one-character mark, its words, and how it reads. */
export type HowResult = {
  mark: string;
  text: string;
  tone: Tone;
  /** The status after this run, in place of the usual "Done". */
  status?: string;
};

/** The sentence someone said, and the Flow it became: the one job the whole section follows. */
export type HowJob = {
  ask: string;
  name: string;
  schedule: string;
  /** The run time of day; the Flow runs daily. */
  time: string;
  /** The runs already done when the page opens. */
  base: number;
  /** Each run's result, in turn, repeating. */
  results: readonly HowResult[];
};

/** The static icon drawn beside a benefit. */
export type HowBenefitIcon = "clock" | "shield" | "wrench" | "trend";

export type HowBenefit = Point & {
  icon: HowBenefitIcon;
  /** The phone list's shorter body. */
  shortBody: string;
};

export type HowItWorksContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: SplitTitle;
  lede: string;
  /** The shorter lede shown below `md`. */
  ledeShort: string;
  jobs: {
    num: string;
    title: SplitTitle;
    /** What the illustration shows, for assistive tech. */
    description: string;
    labels: { youSaid: string; flow: string; runs: string; lastRun: string; running: string; done: string };
    job: HowJob;
  };
  split: {
    num: string;
    title: SplitTitle;
    description: string;
    site: string;
    search: { before: string; after: string };
    chip: { before: HowPhrase; after: HowPhrase };
    story: string;
    /** The phone's story line, followed by the day. */
    storyShort: string;
    morningRun: string;
    days: { before: string; after: string };
    sheet: string;
    script: { name: string; steps: readonly [HowPhrase, HowPhrase, HowPhrase] };
    flux: { name: string; steps: readonly [HowPhrase, HowPhrase, HowPhrase] };
    notes: {
      notFound: string;
      neverRan: string;
      looking: HowPhrase;
      found: HowPhrase;
      testing: string;
      passed: string;
    };
    pills: { ran: string; running: string; failed: string; changed: string; testing: HowPhrase; fixed: HowPhrase };
    outcomes: {
      saved: string;
      running: string;
      stopped: string;
      empty: HowPhrase;
      looking: string;
      testing: HowPhrase;
      fixed: string;
    };
  };
  benefits: readonly HowBenefit[];
};

// Sources (Core f6ef9f4): a job is a Flow, authored instruction-first from a
// plain request (runtime/flow-bootstrap,
// docs/architecture/automation-studio/llm-flow-bootstrap.md); Flows run on a
// schedule; purchases, deletion, and sending are always held for a person
// (same bootstrap); when a site changes, the adaptation finds the new element
// and a patch is kept only after a whole run on it is judged a success
// (judged-promotion.ts); checks taper as a Flow earns trust and restart after
// a fix (runtime/result-check-schedule).
// Copy follows the approved concept B boards (HowB, HowBMobile; "Concept B
// chosen" in docs/working/home-redesign.md). The job, run counts,
// times, prices, addresses, and row counts are an invented example; the
// costs match the savings model in content/why.ts: a judged run about $0.01,
// a trusted run $0.00, a fix $0.05. The site never claims runs are free.
export const HOW_IT_WORKS: HowItWorksContent = {
  id: "how-it-works",
  eyebrow: "How it works",
  title: { lead: "Automations that", muted: "survive a redesign." },
  lede: "Say what you want done in one sentence. FluxIQ turns it into a Flow that keeps running on its schedule, and keeps working when the site behind it changes.",
  ledeShort: "Say it in one sentence. It becomes a Flow that keeps running, and keeps working when the site changes.",
  jobs: {
    num: "01",
    title: { lead: "One sentence.", muted: "A job that keeps running." },
    description:
      "An example: one sentence, “Every morning, add new roofers in Calgary to my sheet”, is now a Flow that runs every day at 7:00 and adds the new roofers it finds. The card counts its runs as they happen. Part 2 follows the same job through a site redesign.",
    labels: { youSaid: "You said", flow: "Flow", runs: "Runs", lastRun: "Last run", running: "Running", done: "Done" },
    job: {
      ask: "Every morning, add new roofers in Calgary to my sheet.",
      name: "Calgary roofer leads",
      schedule: "Every day · 7:00",
      time: "7:00",
      base: 212,
      results: [
        { mark: "+", text: "3 new roofers added to your sheet", tone: "ok" },
        { mark: "+", text: "1 new roofer added to your sheet", tone: "ok" },
        { mark: "+", text: "4 new roofers added to your sheet", tone: "ok" },
        { mark: "+", text: "2 new roofers added to your sheet", tone: "ok" },
        { mark: "·", text: "No new roofers today; sheet unchanged", tone: "neutral" },
        { mark: "+", text: "5 new roofers added to your sheet", tone: "ok" },
      ],
    },
  },
  split: {
    num: "02",
    title: { lead: "Then the site redesigns overnight.", muted: "Same job, two ways to run it." },
    description:
      "An example: a leads site moves its search box into a new header overnight. On Tuesday an ordinary recorded script and FluxIQ both save 3 new rows. On Wednesday the script cannot find its search box, stops at step 2, and nothing arrives in your sheet. FluxIQ sees the site changed, finds the search box in the new header, tests the fix on a full run, and keeps it: fixed for $0.05, nothing missed.",
    site: "roofers.example",
    search: { before: "Search roofers…", after: "Search…" },
    chip: {
      before: { full: "The site, as recorded", short: "Site as recorded" },
      after: { full: "Overnight: site redesigned", short: "Site redesigned" },
    },
    story:
      "The roofer directory moves its search box into a new header. The same Calgary roofer job runs the next morning, two ways.",
    storyShort: "Its search box moves into a new header. Morning run:",
    morningRun: "Morning run",
    days: { before: "Tuesday", after: "Wednesday" },
    sheet: "Your sheet,",
    script: {
      name: "An ordinary recorded script",
      steps: [
        "Open roofers.example",
        "Click #search-box",
        { full: "Copy new rows to the sheet", short: "Copy rows to sheet" },
      ],
    },
    flux: {
      name: "FluxIQ",
      steps: [
        "Open roofers.example",
        "Find the search box",
        { full: "Copy new rows to the sheet", short: "Copy rows to sheet" },
      ],
    },
    notes: {
      notFound: "not found",
      neverRan: "never ran",
      looking: { full: "looking for it", short: "looking" },
      found: { full: "now in the header", short: "in the header" },
      testing: "testing",
      passed: "full run passed",
    },
    pills: {
      ran: "✓ Ran",
      running: "● Running",
      failed: "✕ Failed",
      changed: "Site changed",
      testing: { full: "Testing the fix", short: "Testing fix" },
      fixed: { full: "✓ Fixed for $0.05", short: "✓ Fixed, $0.05" },
    },
    outcomes: {
      saved: "3 new rows saved",
      running: "Running…",
      stopped: "Stopped at step 2.",
      empty: {
        full: "Nothing arrived. You find out when you open the sheet.",
        short: "Nothing arrived. Your sheet is empty.",
      },
      looking: "Site changed. Finding the new search box…",
      testing: { full: "Found the new box. Testing the fix on a full run…", short: "Testing the fix on a full run…" },
      fixed: "Site changed · fixed for $0.05 · nothing missed",
    },
  },
  benefits: [
    {
      icon: "clock",
      title: "Runs on your schedule",
      body: "Every morning, every hour, every Friday. Each Flow runs on its own, with nobody at the keyboard.",
      shortBody: "Every morning, every hour, every Friday, with nobody at the keyboard.",
    },
    {
      icon: "shield",
      title: "Asks before it acts",
      body: "Anything that sends, buys, or deletes waits for your OK.",
      shortBody: "Anything that sends, buys, or deletes waits for your OK.",
    },
    {
      icon: "wrench",
      title: "Fixes itself, carefully",
      body: "When a site changes, FluxIQ finds the new element and keeps the fix only after a full run passes.",
      shortBody: "It finds the new element and keeps a fix only after a full run passes.",
    },
    {
      icon: "trend",
      title: "Costs less as it earns trust",
      body: "Checks taper as a Flow proves itself: about $0.01 for a judged run, $0.00 for a trusted one.",
      shortBody: "About $0.01 for a judged run, $0.00 once the Flow is trusted.",
    },
  ],
};
