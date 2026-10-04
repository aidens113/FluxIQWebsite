import { LINKS } from "./links";
import type { HeroContent } from "./types";

// Sources (FluxIQ Core f6ef9f4): replay without a model and the triggers for a
// model call are runtime/result-check-schedule and runtime-adaptation; "limits
// you set" is the per-Flow LLM Budget in FlowSettingsView.tsx. Recording is
// the Web Extension's recorder (b6768b7). See docs/working/site-v2.md.
export const HERO: HeroContent = {
  title: { lead: "Only pay AI for what", muted: "FluxIQ doesn’t already know." },
  lede: "Describe a job or show it once in your browser. FluxIQ turns it into an automation that replays on its own. A model only steps in when something is new, a result looks wrong, or the page has changed, and always within the limits you set.",
  actions: [
    { ...LINKS.coreRepo, label: "Get the framework", variant: "primary" },
    { ...LINKS.extensionPage, label: "See the browser extension", variant: "ghost" },
  ],
};
