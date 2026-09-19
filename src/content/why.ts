import { Coins, ScrollText, ShieldCheck } from "lucide-react";
import type { WhyContent } from "./types";

export const WHY: WhyContent = {
  id: "why",
  eyebrow: "Why FluxIQ",
  title: "The reliability of scripts, the flexibility of AI.",
  lede: "Scripts are cheap but brittle. Agents adapt, but call a model on every run. FluxIQ calls a model only for what is new, and replays the rest.",
  cards: [
    {
      icon: Coins,
      title: "Spend scales with novelty",
      body: "Token use grows with what is new, not with how often a Flow runs. Replays need no API key and no model.",
    },
    {
      icon: ShieldCheck,
      title: "Bounded by default",
      body: "No grant, no model call. Each grant caps calls, tokens, time, and cost, never above $2. New Flows start fail-closed.",
    },
    {
      icon: ScrollText,
      title: "Every change on the record",
      body: "Run records itemize every model call. Saved traces exclude credentials. Adaptations are reviewed before they apply and can be reverted after.",
    },
  ],
};
