import type { VisionContent } from "./types";

// Programs today: Core f6ef9f4 registers a fixed catalog of ten global
// programs, each with its own UI and API (programs/_shared/catalog.ts). Neither
// users nor AI can create programs yet, so generation is stated as the
// direction. The roadmap and the example prompt come from the FluxIQ Technical
// Vision & Architecture draft v0.9 (October 2026), sections 9 and 10.
export const VISION: VisionContent = {
  id: "vision",
  eyebrow: "Where it’s going",
  title: "From automations to whole applications.",
  paragraphs: [
    "FluxIQ’s own tools already run as programs on one framework. Automation Studio, the database manager, and background tasks each have their own screens and APIs.",
    "The goal is for you to describe an outcome and have FluxIQ build the program around it: the interface, the data, the Flows that do the work, and the controls that keep it honest.",
  ],
  roadmap: [
    { stage: "now", label: "Make the browser loop solid", tone: "ok" },
    { stage: "next", label: "Deploy self-repairing Flows to the cloud", tone: "attention" },
    { stage: "then", label: "Integrations and Flows that build on Flows", tone: "neutral" },
    { stage: "later", label: "Generate complete applications", tone: "neutral" },
  ],
  concept: {
    prompt: "“Build me a lead-generation app for commercial roofing companies in Western Canada.”",
    heading: "Pipeline",
    stages: [
      { label: "discovered", value: "[000]" },
      { label: "enriched", value: "[000]" },
      { label: "qualified", value: "[00]" },
      { label: "contacted", value: "[00]", highlight: true },
    ],
    columns: ["Flow", "last run", "status"],
    flows: [
      { name: "discovery", lastRun: "replay", status: "ok", tone: "ok" },
      { name: "enrichment", lastRun: "replay", status: "ok", tone: "ok" },
      { name: "qualification", lastRun: "checked", status: "ok", tone: "ok" },
      { name: "refresh", lastRun: "repairing", status: "review", tone: "attention" },
    ],
    caption: "Concept. Application generation is the long-term direction, not a shipped feature.",
  },
};
