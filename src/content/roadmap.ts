import { CircleCheck, CircleDashed, CircleDotDashed } from "lucide-react";
import type { RoadmapContent } from "./types";

// Built from the Claim Audit verdicts in docs/working/landing-page.md. An item
// moves column only when the source moves, never on intent.
export const ROADMAP: RoadmapContent = {
  id: "roadmap",
  eyebrow: "Roadmap",
  title: "Where it stands.",
  lede: "Each item sits where the source repository classifies it today. Shipped means you can run it now, built from source.",
  columns: [
    {
      status: "shipped",
      title: "Shipped",
      icon: CircleCheck,
      items: [
        { title: "Flow engine", detail: "Router, Subflows, a recovery ladder, and pinned Call Flow nodes." },
        { title: "Automation Studio", detail: "The visual canvas for Flows, recordings, and adaptations." },
        {
          title: "Deterministic replay",
          detail: "Replays run with no key or model and produce byte-identical records.",
        },
        {
          title: "Bounded adaptation with review",
          detail: "Six guards on recovery. Lasting changes are reviewed and reversible.",
        },
        { title: "Element-identity scoring", detail: "Level 2 matching through Core's element matcher." },
        { title: "Closed failure vocabulary", detail: "Structured failure records in @fluxiq/contracts 0.2.0." },
        { title: "Identity & Access", detail: "12-hour sessions, PIN, TOTP, roles, and AES-256-GCM Secret Keys." },
        { title: "Client Gateway", detail: "Local WebSocket clients, paired by approval." },
        {
          title: "Extension recorder and executor",
          detail: "Manifest V3 builds for Chrome, Edge, and Firefox, installed unpacked.",
        },
      ],
    },
    {
      status: "in-progress",
      title: "In progress",
      icon: CircleDotDashed,
      items: [
        {
          title: "Permission-aware action gating",
          detail: "Core's gate has landed with five consequence classes. Browser actions are not wired to it yet.",
        },
        { title: "Data extraction", detail: "Core datasets are done. The extension's element picker is in progress." },
        {
          title: "Real-site test boundaries",
          detail: "A fail-closed allowlist validator exists. No real-site executor is connected yet.",
        },
        {
          title: "Compute transport",
          detail: "Nodes, queued commands, and leases exist. Live transport is not built yet.",
        },
      ],
    },
    {
      status: "planned",
      title: "Planned",
      icon: CircleDashed,
      items: [
        { title: "npm release", detail: "No package is on npm yet. Build from source today." },
        { title: "Hosted and managed deployments", detail: "Not built. Deployment Sync is local Git today." },
        {
          title: "Commercial agreement templates",
          detail: "Agreements are available on request; templates are pending.",
        },
      ],
    },
  ],
};
