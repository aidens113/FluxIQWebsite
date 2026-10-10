import type { HomeSectionId, SplitTitle } from "./types";

/** Words with a shorter form for a phone. */
export type HowPhrase = { full: string; short: string };

/** The static icon drawn beside a benefit. */
export type HowBenefitIcon = "clock" | "shield" | "wrench" | "trend";

/** One thing a Flow gives you, in a few words. */
export type HowBenefit = {
  icon: HowBenefitIcon;
  title: string;
  detail: string;
};

export type HowItWorksContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: SplitTitle;
  lede: string;
  /** What the illustration shows, for assistive tech. */
  description: string;
  ask: { label: string; text: string };
  flow: { label: string; name: string; schedule: HowPhrase };
  lanes: { flux: string; script: HowPhrase };
  /** The eight mornings along the tracks, and the rows each morning adds. */
  days: readonly string[];
  rows: readonly number[];
  site: string;
  marker: { before: HowPhrase; after: HowPhrase };
  notes: { looking: HowPhrase; testing: HowPhrase; fixed: HowPhrase; notFound: HowPhrase };
  sheet: { label: HowPhrase; unit: string };
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
// Copy follows the approved concept C boards (HowTracks, HowTracksMobile;
// "concept C" in docs/working/home-redesign.md). The job, the site, the days,
// and the row counts are an invented example; the fix cost matches the savings
// model in components/why-fluxiq/savings/model.ts (a fix about $0.05). The
// site never claims runs are free.
export const HOW_IT_WORKS: HowItWorksContent = {
  id: "how-it-works",
  eyebrow: "How it works",
  title: { lead: "Automations that", muted: "survive a redesign." },
  lede: "Say it once. It runs every day, and fixes itself when the site changes.",
  description:
    "An example: “Every morning, add new roofers in Calgary to my sheet” becomes a Flow that runs every day at 7:00. Over eight mornings it runs two ways, as FluxIQ and as an ordinary recorded script. Overnight before Wednesday the site moves its search box into a new header. From Wednesday the recorded script cannot find the search box and adds nothing, so the sheet stops at 4 rows. FluxIQ sees the site changed, finds the box, tests the fix on a full run, keeps it for about $0.05, and carries on: 21 rows by the next Monday.",
  ask: { label: "You said", text: "Every morning, add new roofers in Calgary to my sheet." },
  flow: {
    label: "Flow",
    name: "Calgary roofer leads",
    schedule: { full: "· every day, 7:00", short: "· daily, 7:00" },
  },
  lanes: { flux: "FluxIQ", script: { full: "Recorded script", short: "Script" } },
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
  rows: [3, 1, 4, 2, 3, 5, 1, 2],
  site: "roofers.example",
  marker: {
    before: { full: "The site, as recorded", short: "The site, as recorded" },
    after: { full: "Overnight: site redesigned", short: "Overnight: site redesigned" },
  },
  notes: {
    looking: { full: "site changed, looking", short: "looking" },
    testing: { full: "testing the fix", short: "testing" },
    fixed: { full: "fixed for $0.05", short: "fixed, $0.05" },
    notFound: { full: "search box not found", short: "not found" },
  },
  sheet: { label: { full: "In your sheet", short: "Sheet" }, unit: "rows" },
  benefits: [
    { icon: "clock", title: "Runs on your schedule", detail: "Daily, hourly, or weekly" },
    { icon: "shield", title: "Asks before high-risk actions", detail: "Sending, buying, or deleting" },
    { icon: "wrench", title: "Fixes itself, tested first", detail: "Kept only after a full run passes" },
    { icon: "trend", title: "Costs less as it earns trust", detail: "Checks taper as it proves itself" },
  ],
};
