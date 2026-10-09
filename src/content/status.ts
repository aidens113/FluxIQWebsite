import { LINKS } from "./links";
import type { HomeSectionId, SiteLink } from "./types";

/** Which static icon a status item shows. */
export type StatusIconName = "install" | "key" | "machine" | "license";

export type StatusItem = {
  label: string;
  icon: StatusIconName;
  /** The tile's line, from `md` up. */
  body: string;
  /** The shorter line in the phone's list. */
  short: string;
  /** An optional link after the line. */
  link?: SiteLink;
};

export type StatusContent = {
  id: HomeSectionId;
  eyebrow: string;
  /** The heading's lead, then the muted end. */
  heading: { lead: string; muted: string };
  items: readonly StatusItem[];
  /** The button beside the heading (below the list on the phone). */
  repo: SiteLink;
};

// Sources: no package on npm (`npm view fluxiq` 404, Core
// docs/architecture/package-boundaries.md); extension not on the stores
// (Extension docs/user/store-listing.md); DeepSeek is "the only provider for
// now" (Core AiProviderSettingsSection.tsx); Node >=22 (package.json);
// Sustainable Use License 1.0 with the Consulting Permission (LICENSE.md).
// The lines are the v5 boards' shortenings of that sourced copy.
export const STATUS: StatusContent = {
  id: "status",
  eyebrow: "Status",
  heading: { lead: "Early,", muted: "and built in the open." },
  items: [
    {
      label: "Install",
      icon: "install",
      body: "Build from source; not on npm yet. Extension coming soon.",
      short: "Build from source. Extension coming soon.",
    },
    {
      label: "AI provider",
      icon: "key",
      body: "Bring your own DeepSeek key, the only provider for now.",
      short: "Your own DeepSeek key, for now.",
    },
    {
      label: "Runs on",
      icon: "machine",
      body: "Your machine. Node 22+, Chrome, Edge, or Firefox.",
      short: "Your machine. Node 22+.",
    },
    {
      label: "License",
      icon: "license",
      body: "Fair-code. Free for personal and internal use.",
      short: "Fair-code. Free for personal use.",
      link: { ...LINKS.license, label: "Read it" },
    },
  ],
  repo: { ...LINKS.coreRepo, label: "View on GitHub" },
};
