import type { HomeSectionId, SplitTitle, Tone } from "./types";

/** One stage of the public roadmap. */
export type VisionRoadmapStage = { stage: string; label: string; tone: Tone };

/** An invented company in the concept app: its name, city, and lead score. */
export type ConceptLead = { name: string; city: string; score: number };

/** Where an invented lead stands in the concept app's pipeline. */
export type ConceptLeadStatus = "new" | "enriched" | "qualified" | "contacted" | "replied";

/** One of the concept app's Flows: what it does, in a few words. */
export type ConceptFlow = { name: string; what: string };

/** A counter on the concept app's pipeline view. `{n}` in `note` is replaced with a live number. */
export type ConceptCounter = { label: string; note: string };

/** What a concept Flow is doing right now. */
export type ConceptFlowState = "running" | "checked" | "ok" | "fixing" | "fixed";

/** Words for the concept app. `{n}` marks where a live number goes. */
export type ConceptAppContent = {
  name: string;
  /** The letter on the app's icon. */
  initial: string;
  /** Sidebar items on desktop; the first three are also the phone's tabs. */
  nav: readonly string[];
  pipeline: {
    title: string;
    scope: string;
    live: string;
    counters: readonly ConceptCounter[];
    chartLabel: string;
    todayLabel: string;
  };
  leads: {
    title: string;
    total: string;
    regions: readonly string[];
    columns: readonly [string, string, string, string];
    statuses: Readonly<Record<ConceptLeadStatus, string>>;
    /** A score not yet worked out. */
    pendingScore: string;
  };
  flows: {
    title: string;
    lede: string;
    runs: string;
    states: Readonly<Record<ConceptFlowState, string>>;
    /** Follows a one-off cost, as in "$0.05 once". */
    once: string;
  };
  budget: { label: string; of: string; ofShort: string; saved: string; savedShort: string };
  /** The invented companies the app finds, newest first as they arrive. */
  pool: readonly ConceptLead[];
  /** The app's four Flows, in the order the Flows view lists them. */
  flowList: readonly ConceptFlow[];
};

export type VisionContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: SplitTitle;
  /** The lede from `md` up. */
  lede: string;
  /** The shorter lede below `md`. */
  ledeShort: string;
  roadmap: readonly VisionRoadmapStage[];
  chat: {
    /** The visitor's request, revealed smoothly. */
    prompt: string;
    /** FluxIQ's reply, revealed after the typing dots. */
    reply: string;
    /** Names the reply for assistive tech, since the animated text is hidden from it. */
    replyLabel: string;
  };
  app: ConceptAppContent;
  /** States plainly that the app is a concept, not a shipped feature. */
  caption: string;
};

// Programs today: Core f6ef9f4 registers a fixed catalog of ten global
// programs, each with its own UI and API (programs/_shared/catalog.ts). Neither
// users nor AI can create programs yet, so generation is stated as the
// direction. The roadmap and the example prompt come from the FluxIQ Technical
// Vision & Architecture draft v0.9 (October 2026), sections 9 and 10.
//
// The concept app (RoofLeads) and everything in it, every company, city,
// score, count, and dollar figure, is invented for the illustration and is
// captioned "Concept" on the page. The copy is the approved v5 board's
// (docs/working/home-redesign.md, Build Plan v5).
export const VISION: VisionContent = {
  id: "vision",
  eyebrow: "Where it’s going",
  title: { lead: "Ask for an outcome.", muted: "Get the whole app." },
  lede: "In time, FluxIQ will build the software around what you want done: the screens, the data, and the Flows that keep it current, all within the budget you set.",
  ledeShort: "In time, FluxIQ will build the software around what you want done, within your budget.",
  roadmap: [
    { stage: "Now", label: "Make the browser loop solid", tone: "ok" },
    { stage: "Next", label: "Deploy self-repairing Flows to the cloud", tone: "attention" },
    { stage: "Then", label: "Integrations and Flows that build on Flows", tone: "neutral" },
    { stage: "Later", label: "Generate complete applications", tone: "neutral" },
  ],
  chat: {
    prompt: "Build me a lead-generation app for commercial roofing companies in Western Canada.",
    reply:
      "Certainly! Here’s RoofLeads: your leads, a live pipeline, and four Flows that keep it current, within a $5 weekly AI budget.",
    replyLabel: "FluxIQ replies:",
  },
  app: {
    name: "RoofLeads",
    initial: "R",
    nav: ["Pipeline", "Leads", "Flows", "Settings"],
    pipeline: {
      title: "Pipeline",
      scope: "Commercial roofing · AB, BC, SK",
      live: "live",
      counters: [
        { label: "Discovered", note: "+{n} this wk" },
        { label: "Enriched", note: "+{n}" },
        { label: "Qualified", note: "+{n}" },
        { label: "Contacted", note: "{n} replied" },
      ],
      chartLabel: "New leads per day",
      todayLabel: "today: {n} new",
    },
    leads: {
      title: "Leads",
      total: "{n} total",
      regions: ["AB", "BC", "SK"],
      columns: ["Company", "City", "Score", "Status"],
      statuses: {
        new: "New",
        enriched: "Enriched",
        qualified: "Qualified",
        contacted: "Contacted",
        replied: "Replied",
      },
      pendingScore: "—",
    },
    flows: {
      title: "Flows",
      lede: "the jobs that keep this app current",
      runs: "{n} runs",
      states: { running: "running", checked: "checked", ok: "ok", fixing: "site changed · fixing", fixed: "fixed" },
      once: "once",
    },
    budget: {
      label: "AI this week",
      of: "of $5 limit",
      ofShort: "of $5",
      saved: "Saved with FluxIQ",
      savedShort: "Saved",
    },
    pool: [
      { name: "Northline Commercial Roofing", city: "Edmonton", score: 86 },
      { name: "Island Roof Systems", city: "Victoria", score: 79 },
      { name: "Kelowna Flat Roof Pros", city: "Kelowna", score: 84 },
      { name: "Summit Roofing Co.", city: "Calgary", score: 92 },
      { name: "Coastline Roofing", city: "Vancouver", score: 88 },
      { name: "Prairie Peak Roofers", city: "Regina", score: 81 },
      { name: "Saskatoon Roof Works", city: "Saskatoon", score: 77 },
      { name: "Foothills Roofing Ltd.", city: "Red Deer", score: 83 },
    ],
    flowList: [
      { name: "discover", what: "finds new companies" },
      { name: "enrich", what: "adds phone and website" },
      { name: "qualify", what: "scores new leads" },
      { name: "refresh", what: "rechecks old leads" },
    ],
  },
  caption: "Concept. Generating applications is the long-term direction, not a shipped feature.",
};
