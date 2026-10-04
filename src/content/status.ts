import { LINKS } from "./links";
import type { StatusContent } from "./types";

// Sources: no package on npm (`npm view fluxiq` 404, Core
// docs/architecture/package-boundaries.md); extension not on the stores
// (Extension docs/user/store-listing.md); DeepSeek is "the only provider for
// now" (Core AiProviderSettingsSection.tsx); Node >=22 (package.json);
// Sustainable Use License 1.0 with the Consulting Permission (LICENSE.md).
export const STATUS: StatusContent = {
  id: "status",
  title: "Early, and built in the open.",
  lede: "Everything is public on GitHub. Here’s what that means today.",
  rows: [
    { label: "Install", body: "Build from source. Not on npm or the browser stores yet." },
    { label: "AI provider", body: "Bring your own DeepSeek key, the only provider for now." },
    { label: "Runs on", body: "Your machine. Node 22+, Chrome, Edge, or Firefox." },
    {
      label: "License",
      body: "Fair-code. Free for personal and internal business use; reselling or hosting it needs an agreement.",
      link: LINKS.license,
    },
  ],
};
