import type { SiteLink } from "./types";

// Every external destination on the page. Phase 4's built-site test allows
// only these hosts and paths, so a new link belongs here first.
export const LINKS = {
  coreRepo: { label: "FluxIQ on GitHub", href: "https://github.com/aidens113/FluxIQ", external: true },
  extensionRepo: { label: "Web Extension", href: "https://github.com/aidens113/FluxIQWebExtension", external: true },
  x: { label: "@GetFluxIQ", href: "https://x.com/GetFluxIQ", external: true },
  license: {
    label: "Read LICENSE.md",
    href: "https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md",
    external: true,
  },
  licenseEmail: { label: "license@getfluxiq.com", href: "mailto:license@getfluxiq.com", external: false },
} as const satisfies Record<string, SiteLink>;
