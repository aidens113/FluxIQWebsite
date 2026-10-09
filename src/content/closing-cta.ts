import { LINKS } from "./links";
import type { ActionLink } from "./types";

export type ClosingCtaContent = {
  heading: string;
  lede: string;
  actions: readonly ActionLink[];
};

// The closing band from the v5 boards (home-redesign.md). "Open on GitHub" and
// "run it on your machine" rest on the Status sources (public repositories;
// Core runs locally, Node >=22, package.json).
export const CLOSING_CTA: ClosingCtaContent = {
  heading: "Stop paying for the same thinking twice.",
  lede: "FluxIQ is open on GitHub. Build it and run it on your own machine.",
  actions: [
    { ...LINKS.coreRepo, label: "Get the framework", variant: "primary" },
    { ...LINKS.paper, variant: "ghost" },
  ],
};
