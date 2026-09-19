import { Puzzle } from "lucide-react";
import { LINKS } from "./links";
import type { FollowContent } from "./types";

export const FOLLOW: FollowContent = {
  id: "follow",
  eyebrow: "Follow the build",
  title: "Built in the open.",
  lede: "The source is public. Watch the repositories for changes, or follow @GetFluxIQ for updates.",
  actions: [
    { ...LINKS.coreRepo, variant: "primary", icon: "github" },
    { ...LINKS.extensionRepo, variant: "ghost", icon: Puzzle },
    { ...LINKS.x, variant: "ghost", icon: "x" },
  ],
};
