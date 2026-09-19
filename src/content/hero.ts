import { Puzzle } from "lucide-react";
import { LINKS } from "./links";
import type { HeroContent } from "./types";

export const HERO: HeroContent = {
  lede: "A source-available TypeScript framework for automations that call AI only when something is new. Describe or demonstrate the job once, and FluxIQ generates a Flow that replays without a model. When a run breaks, it diagnoses the failure and proposes a repair for your review.",
  cornerLabels: { start: "Adapt / Automate / Evolve", end: "Ideas → Action" },
  actions: [
    { ...LINKS.coreRepo, variant: "primary", icon: "github" },
    { ...LINKS.extensionRepo, variant: "ghost", icon: Puzzle },
    { ...LINKS.x, variant: "ghost", icon: "x" },
  ],
};
