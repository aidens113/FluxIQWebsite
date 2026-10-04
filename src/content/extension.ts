import { LINKS } from "./links";
import type { ExtensionContent } from "./types";

// Sources (FluxIQ Web Extension b6768b7): version 0.1.0 and Chrome, Edge 116+
// and Firefox 128+ in apps/extension/manifest.*.json; the recorder's actions in
// content/recorder.ts; the review step after recording and "Extract Data From
// This Page" with pagination in panel/ and content/extraction/; refusal on an
// ambiguous target in docs/architecture/element-identity.md; no analytics and
// data only to the paired runtime in README.md; unpacked install, Connect, and
// approve-the-code pairing in docs/user/install.md and quickstart.md; the
// DeepSeek key lives in FluxIQ's Secret Keys. The panel sketch mirrors the
// shipped Automations tab; its automation names are made up.
export const EXTENSION: ExtensionContent = {
  kicker: "FluxIQ Web Extension · 0.1 · Chrome, Edge, Firefox",
  title: { lead: "Do it once in your browser.", muted: "Never do it by hand again." },
  lede: "Record a task, or point at the data you want. The extension hands it to FluxIQ, which turns it into a Flow and runs it back on the real page, without calling AI every time.",
  actions: [
    { ...LINKS.extensionRepo, label: "Get the extension", variant: "primary" },
    { label: "How setup works", href: "#setup", external: false, variant: "ghost" },
  ],
  panel: {
    tabs: ["Chat", "Automations"],
    connection: "paired",
    items: [
      { name: "Export weekly orders", detail: "last run ok", tone: "ok" },
      { name: "Competitor price list", detail: "extracted · 3 pages", tone: "neutral" },
    ],
    runLabel: "Run",
    record: "Record a new automation",
    extract: "Extract data from this page",
    caption: "Sketch of the side panel, not a screenshot.",
  },
  features: {
    id: "features",
    title: "What it does",
    points: [
      {
        title: "Records what you do",
        body: "Clicks, typing, dropdowns, scrolling, switching tabs, and file uploads. Review it, test it, then save it.",
      },
      {
        title: "Pulls lists off any page",
        body: "Point at one product, listing, or row. It finds the rest, and can follow the “next page” link.",
      },
      {
        title: "Won’t click the wrong thing",
        body: "If a button moved and it can’t tell which one you meant, it stops and says so instead of guessing.",
      },
      {
        title: "Stays private",
        body: "No analytics, no tracking. What it sees only goes to the FluxIQ you run and pair it with.",
      },
    ],
  },
  setup: {
    id: "setup",
    title: "It works with FluxIQ, not instead of it.",
    lede: "The extension is the hands. The FluxIQ framework on your machine is the brain that builds, stores, and repairs your Flows.",
    steps: [
      "Run FluxIQ on your computer. It needs Node 22.",
      "Load the extension in Chrome, Edge, or Firefox. It isn’t in the browser stores yet, so it installs unpacked.",
      "Press Connect. Approve the matching code in FluxIQ, and the two are paired.",
      "Add your DeepSeek key in FluxIQ for the moments AI is needed.",
    ],
  },
};
