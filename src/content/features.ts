import {
  Boxes,
  Cable,
  FingerprintPattern,
  Gauge,
  KeyRound,
  MousePointerClick,
  PanelsTopLeft,
  Route,
  Workflow,
} from "lucide-react";
import type { FeaturesContent } from "./types";

export const FEATURES: FeaturesContent = {
  id: "features",
  eyebrow: "Features",
  title: "What you can run today.",
  lede: "Everything here is in the public source now. Work that is partial or planned is on the roadmap instead.",
  groups: [
    {
      id: "core",
      title: "FluxIQ Core",
      summary: "The fluxiq package and its Next.js control panel.",
      items: [
        {
          icon: Workflow,
          title: "Automation Studio",
          body: "A visual canvas for Flows, the Router, Subflows, instructions, recordings, adaptations, and runtime debugging.",
        },
        {
          icon: Route,
          title: "Flow Engine",
          body: "A Router picks a Subflow from live state. Subflows carry a recovery ladder, and published Flows are reused as pinned Call Flow nodes.",
        },
        {
          icon: Gauge,
          title: "Bounded Runtime Adaptation",
          body: "Recovery stops at a USD 2 cost cap, its token budget, a 600-second deadline, or three steps without progress. Lasting changes are proposed, reviewed, and reversible.",
        },
        {
          icon: KeyRound,
          title: "Execution Grants",
          body: "Every model call needs a session-bound grant that caps calls, tokens, time, and spend. A default grant costs about USD 0.09; the hard ceiling is USD 2.",
        },
        {
          icon: Cable,
          title: "Client Gateway",
          body: "Clients connect over a local WebSocket at ws://127.0.0.1:4777/client. Pairing is an approval, not a typed code. Credentials rotate on reconnect; trust lasts 30 days.",
        },
        {
          icon: Boxes,
          title: "Domain-Neutral Core",
          body: "Domains declare their own inputs and outputs with defineDomainIo, defineInput, and defineOutput. Core never imports a domain package; manifests drive loading.",
        },
        {
          icon: PanelsTopLeft,
          title: "Control Panel Programs",
          body: "A Next.js control panel with global programs, including Identity & Access, Secret Keys, Database Manager, Compute Control, Deployment Sync, and Runtime.",
        },
      ],
    },
    {
      id: "web-extension",
      title: "FluxIQ Web Extension",
      summary:
        "Manifest V3 for Chrome, Edge, and Firefox. Version 0.1.0 installs unpacked; there is no store listing yet.",
      note: "Tested in a deterministic scenario lab.",
      items: [
        {
          icon: MousePointerClick,
          title: "Recorder and Executor",
          body: "Record a demonstration in the browser, then run Flow steps against the live page. There are Chrome and Firefox builds; Edge uses the Chrome build.",
        },
        {
          icon: FingerprintPattern,
          title: "Element Identity Scoring",
          body: "Finds the control you recorded by scoring on-page candidates with Core's element matcher. A match needs a clear margin over the runner-up, or it refuses rather than guesses.",
        },
      ],
    },
  ],
};
