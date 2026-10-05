import { LINKS } from "./links";
import type { PartsContent } from "./types";

// Sources: Core f6ef9f4 package.json (fluxiq 0.7.0), Automation Studio and the
// TypeScript DSL (programs/automation-studio), datasets with CSV/JSON export
// (api/handlers/datasets.ts), Identity & Access and Secret Keys programs.
// Extension b6768b7: version 0.1.0 and browsers in the manifests, recorder,
// list extraction with pagination, refusal on ambiguous targets
// (docs/architecture/element-identity.md), no analytics (README.md), pairing
// over the local client gateway.
export const PARTS: PartsContent = {
  id: "framework",
  title: "Two parts. One system.",
  lede: "The framework does the thinking and remembering. The extension does the clicking. They pair over a local connection you approve.",
  parts: [
    {
      kicker: "Framework · fluxiq 0.7",
      title: "The engine",
      body: "A TypeScript framework and control panel you run on your own machine. It builds Flows, runs them, checks the results, and repairs what breaks.",
      items: [
        "Automation Studio, a visual editor for Flows",
        "Write Flows by hand in TypeScript, if you prefer",
        "Datasets you can browse and export as CSV or JSON",
        "Two-factor sign-in, roles, and encrypted API keys",
      ],
      link: { ...LINKS.coreRepo, label: "Framework on GitHub" },
    },
    {
      kicker: "Extension · Coming soon",
      title: "The hands",
      body: "A browser extension, in development, that records what you do, runs Flows on real pages, and pulls data out of lists, page after page.",
      items: [
        "Record a task once from the side panel",
        "Point at one item, get the whole list",
        "Refuses rather than guesses which button you meant",
        "No analytics. Data only goes to your own FluxIQ",
      ],
      link: { ...LINKS.extensionPage, label: "More about the extension" },
    },
  ],
};
