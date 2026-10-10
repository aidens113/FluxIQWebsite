import { LINKS } from "./links";
import type { HomeSectionId, SiteLink, SplitTitle } from "./types";

// Sources: Core f6ef9f4 package.json (fluxiq 0.7.0), Automation Studio and the
// TypeScript DSL (programs/automation-studio), datasets with CSV/JSON export
// (api/handlers/datasets.ts), Identity & Access and Secret Keys programs.
// Extension b6768b7: version 0.1.0 and browsers in the manifests, recorder,
// list extraction with pagination, refusal on ambiguous targets
// (docs/architecture/element-identity.md), no analytics (README.md), pairing
// over the local client gateway: press Connect in the side panel, then
// approve the matching code in FluxIQ (docs/user/install.md, quickstart.md).
// The copy is the approved one-loop boards' (FitsLoop, FitsLoopMobile;
// docs/working/home-redesign.md), which shortens the v5 copy and claims
// nothing new. Both mocks are illustrations:
// the Flow names, the code, and the search results are made up.

/** The words for one of the two zones: where it runs, its illustration's caption, and where to read more. */
export type PartCardCopy = {
  /** Where this half runs, beside its icon. */
  zone: string;
  /** Drawn in the accent after the zone, such as a release note. */
  zoneTag?: string;
  title: string;
  body: string;
  link: SiteLink;
  /** What the illustration shows, for assistive tech. */
  illustration: string;
};

/** One Flow in the framework mock's list, with when it last ran. */
export type FlowRowCopy = { name: string; lastRan: string };

/** The framework mock: the Flows screen, then the request to approve a code. */
export type FlowsMockCopy = {
  brand: string;
  /** The status pill while a browser is, or is not, connected. */
  connected: string;
  notConnected: string;
  /** The Flow that runs in the browser, and its status as it runs. */
  liveFlow: string;
  status: { ready: string; running: string; receiving: string; saved: string };
  otherFlows: readonly FlowRowCopy[];
  dialog: { title: string; note: string; approve: string; deny: string };
};

/** A step the side panel lists as the extension does it. */
export type LiveStepCopy = { verb: string; target: string };

/** The extension mock: a search page beside FluxIQ's side panel. */
export type BrowserMockCopy = {
  /** The made-up site in the address bar. */
  site: string;
  /** What gets typed into the page's search box. */
  query: string;
  search: string;
  results: readonly string[];
  /** The results on a phone, where the page column is narrow. */
  resultsShort: readonly string[];
  brand: string;
  pill: { off: string; pairing: string; connected: string };
  connect: { title: string; note: string; button: string };
  code: { title: string; waiting: string };
  steps: readonly LiveStepCopy[];
  /** Added to the last step once it has read the list. */
  stepsResult: string;
};

/** The note under the wire for each thing that travels along it, and the mark once paired. */
export type WireLabels = { code: string; job: string; rows: string; working: string; paired: string };

export type PartsSectionContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: SplitTitle;
  lede: string;
  /** The pairing code both mocks show; made up. */
  pairingCode: string;
  framework: PartCardCopy;
  extension: PartCardCopy;
  flowsMock: FlowsMockCopy;
  browserMock: BrowserMockCopy;
  wire: WireLabels;
};

export const PARTS: PartsSectionContent = {
  id: "framework",
  eyebrow: "How it fits together",
  title: { lead: "FluxIQ remembers.", muted: "Your browser does the work." },
  lede: "Connect them once with a code you approve. Then your jobs run in your browser.",
  pairingCode: "K7Q 4MD",
  framework: {
    zone: "On your computer",
    title: "Remembers every job",
    body: "Runs them on schedule and fixes them when sites change.",
    link: { ...LINKS.coreRepo, label: "Get the framework" },
    illustration:
      "Illustration: FluxIQ's list of Flows asks you to approve a browser's code, then shows a Flow running in your browser and saving its rows.",
  },
  extension: {
    zone: "In your browser",
    zoneTag: "Coming soon",
    title: "Does the clicking for you",
    body: "On the real sites you already use.",
    link: { ...LINKS.extensionPage, label: "More about the extension" },
    illustration:
      "Illustration: the extension's side panel shows a code to approve, then searches a page and reads its list of results.",
  },
  flowsMock: {
    brand: "FluxIQ",
    connected: "Browser connected",
    notConnected: "No browser connected",
    liveFlow: "Roofing leads, Calgary",
    status: {
      ready: "ready",
      running: "running in your browser",
      receiving: "receiving rows…",
      saved: "24 rows saved",
    },
    otherFlows: [
      { name: "Supplier prices", lastRan: "ran 6:00 am" },
      { name: "Weekly report", lastRan: "ran Monday" },
    ],
    dialog: {
      title: "A browser wants to connect",
      note: "Approve only if this code matches your browser.",
      approve: "Approve",
      deny: "Deny",
    },
  },
  browserMock: {
    site: "roofers.example",
    query: "roofing",
    search: "Search",
    results: ["Summit Roofing Co.", "Peak Roofers", "Bow River Roofing", "Chinook Exteriors"],
    resultsShort: ["Summit Roofing", "Peak Roofers", "Bow River", "Chinook"],
    brand: "FluxIQ",
    pill: { off: "Off", pairing: "Pairing", connected: "Connected" },
    connect: {
      title: "Not connected",
      note: "Connect to the FluxIQ running on this computer.",
      button: "Connect",
    },
    code: { title: "Approve this code in FluxIQ", waiting: "Waiting for your OK…" },
    steps: [
      { verb: "Type", target: "Search box" },
      { verb: "Click", target: "Search" },
      { verb: "Read", target: "Results list" },
    ],
    stepsResult: "24 rows",
  },
  wire: {
    code: "← the code, for you to check",
    job: "sending the job →",
    rows: "← results coming back",
    working: "working in your browser",
    paired: "✓ Paired once",
  },
};
