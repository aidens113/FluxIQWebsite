import { GitBranch, MessageSquareText, Play, Stethoscope } from "lucide-react";
import type { HowItWorksContent } from "./types";

export const HOW_IT_WORKS: HowItWorksContent = {
  id: "how-it-works",
  eyebrow: "How it works",
  title: "From intent to a Flow that runs without a model.",
  lede: "AI handles what is new. What it produces is a Flow you can read, review, and replay without it.",
  steps: [
    {
      icon: MessageSquareText,
      title: "Describe or demonstrate",
      body: "Write what you want in plain language, or record it once in the browser with the FluxIQ Web Extension.",
    },
    {
      icon: GitBranch,
      title: "Generate",
      body: "Text becomes a proposed Flow: a Router plus Subflows, each with the conditions it runs under. A recording maps to a Subflow deterministically, with no model.",
    },
    {
      icon: Play,
      title: "Run",
      body: "The Router reads live inputs and state to pick a Subflow. Replay is deterministic and needs no API key, no grant, and no model.",
    },
    {
      icon: Stethoscope,
      title: "Diagnose and adapt",
      body: "When a run fails, recovery works inside a cost cap, token budget, deadline, and no-progress guard. It proposes an adaptation you review and can revert.",
    },
  ],
};
