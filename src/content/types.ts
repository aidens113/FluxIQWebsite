// Shared shapes for the landing page's copy. Content files hold words, links,
// and icons only: no class names and no colours. Sections decide presentation.

import type { LucideIcon } from "lucide-react";

/** A brand logo, drawn by an inline SVG component in `src/components/ui/`, since Lucide 1.x has no brand icons. */
export type BrandMark = "github" | "x";

/** A destination and its visible label. */
export type SiteLink = {
  label: string;
  href: string;
  /** True opens a new tab with `rel="noopener noreferrer"`. False for in-page anchors and `mailto:`. */
  external: boolean;
};

/** A link rendered as a pill button. `icon` is a string for a brand logo, otherwise a Lucide icon. */
export type ActionLink = SiteLink & {
  variant: "primary" | "ghost";
  icon: BrandMark | LucideIcon;
};

export type SiteContent = {
  name: string;
  /** The wordmark in two parts, so the section can style the accent ("Flux" + "IQ"). */
  wordmark: { lead: string; accent: string };
  tagline: string;
  /** The meta description, shared verbatim with the page metadata. */
  description: string;
  url: string;
  /** The status pill. */
  status: string;
  copyright: string;
};

/** Section anchors, without the leading `#`. Each section renders its own as `id`. */
export type SectionId = "why" | "how-it-works" | "features" | "developers" | "roadmap" | "license" | "follow";

export type NavItem = { label: string; href: `#${SectionId}` };

/** The eyebrow, h2 title, and optional lede a section opens with. */
export type SectionIntro = {
  id: SectionId;
  eyebrow: string;
  title: string;
  lede?: string;
};

/** A card or timeline step: an icon, a short title, and a body of at most 30 words. */
export type Card = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export type HeroContent = {
  lede: string;
  /** Decorative corner labels, in reading order. */
  cornerLabels: { start: string; end: string };
  actions: readonly ActionLink[];
};

export type WhyContent = SectionIntro & { cards: readonly Card[] };

export type HowItWorksContent = SectionIntro & { steps: readonly Card[] };

export type FeatureGroup = {
  id: "core" | "web-extension";
  title: string;
  summary: string;
  /** An optional one-line footnote under the group. */
  note?: string;
  items: readonly Card[];
};

export type FeaturesContent = SectionIntro & { groups: readonly FeatureGroup[] };

export type CodeSample = {
  id: string;
  title: string;
  /** Shown in the code block's title bar. */
  filename: string;
  language: "ts" | "sh";
  /** At most 20 lines. Verified against FluxIQ Core; see the content report. */
  code: string;
  caption: string;
};

export type PackageInfo = {
  name: string;
  version: string;
  summary: string;
};

export type DevelopersContent = SectionIntro & {
  /** The release label shown beside the samples: no package is on npm yet. */
  release: string;
  requirements: readonly string[];
  packages: readonly PackageInfo[];
  samples: readonly CodeSample[];
  /** How to build the packages today, until the npm release. */
  build: CodeSample;
  action: ActionLink;
};

export type RoadmapItem = {
  title: string;
  detail: string;
};

export type RoadmapColumn = {
  status: "shipped" | "in-progress" | "planned";
  title: string;
  icon: LucideIcon;
  items: readonly RoadmapItem[];
};

export type RoadmapContent = SectionIntro & { columns: readonly RoadmapColumn[] };

export type LicenseList = {
  title: string;
  icon: LucideIcon;
  items: readonly string[];
};

export type LicensingContent = SectionIntro & {
  freeFor: LicenseList;
  needsAgreement: LicenseList;
  disclaimer: string;
  actions: readonly ActionLink[];
};

export type FollowContent = SectionIntro & { actions: readonly ActionLink[] };
