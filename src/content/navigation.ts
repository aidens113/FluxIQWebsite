import type { NavItem } from "./types";

// Header anchors, in page order. Each href names a `SectionId`, the same id the
// matching section's content carries, so an anchor cannot point at nothing.
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Developers", href: "#developers" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "License", href: "#license" },
];
