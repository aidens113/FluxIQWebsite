import { LINKS } from "./links";
import type { NavItem } from "./types";

// Header links per page. Home anchors name a `HomeSectionId`, the id the
// matching section's content carries, so an anchor cannot point at nothing.
export const HOME_NAV: readonly NavItem[] = [
  { label: "Framework", href: "#framework" },
  { label: "Extension", href: LINKS.extensionPage.href },
  { label: "Vision paper", href: LINKS.paper.href, highlight: true },
  { label: "Where it’s going", href: "#vision" },
  { label: "Status", href: "#status" },
];

export const EXTENSION_NAV: readonly NavItem[] = [
  { label: "Framework", href: LINKS.home.href },
  { label: "Setup", href: "#setup" },
  { label: "Vision paper", href: LINKS.paper.href, highlight: true },
];

export const LEGAL_NAV: readonly NavItem[] = [
  { label: "Framework", href: LINKS.home.href },
  { label: "Extension", href: LINKS.extensionPage.href },
  { label: "Vision paper", href: LINKS.paper.href, highlight: true },
];
