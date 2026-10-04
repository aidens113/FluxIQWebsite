import type { SiteLink } from "./types";

// Every destination on the site. scripts/site-check.mjs allows only these
// hosts and paths in the built pages, so a new link belongs here first.
export const LINKS = {
  home: { label: "Framework", href: "/", external: false },
  extensionPage: { label: "Extension", href: "/extension/", external: false },
  coreRepo: { label: "GitHub", href: "https://github.com/aidens113/FluxIQ", external: true },
  extensionRepo: {
    label: "Extension on GitHub",
    href: "https://github.com/aidens113/FluxIQWebExtension",
    external: true,
  },
  x: { label: "@GetFluxIQ", href: "https://x.com/GetFluxIQ", external: true },
  license: {
    label: "Read the license",
    href: "https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md",
    external: true,
  },
  licenseEmail: { label: "license@getfluxiq.com", href: "mailto:license@getfluxiq.com", external: false },
} as const satisfies Record<string, SiteLink>;
