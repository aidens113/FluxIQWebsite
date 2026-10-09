// Shared shapes for the site's copy. Content files hold words and links only:
// no class names and no colours. Sections decide presentation.

/** A destination and its visible label. */
export type SiteLink = {
  label: string;
  href: string;
  /** True opens a new tab with `rel="noopener noreferrer"`. False for site paths, anchors, and `mailto:`. */
  external: boolean;
};

/** A link rendered as a button. */
export type ActionLink = SiteLink & { variant: "primary" | "ghost" };

export type SiteContent = {
  name: string;
  /** The meta description, shared verbatim with the page metadata. */
  description: string;
  url: string;
  copyright: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** True draws the link in the accent, for the one item that should stand out. */
  highlight?: boolean;
};

/** A headline in two tones: the lead line, then a quieter second line. */
export type SplitTitle = { lead: string; muted: string };

/**
 * How a value reads at a glance: `ok` is green, `attention` is the accent,
 * `neutral` is muted text. Used by the extension page's side-panel sketch.
 */
export type Tone = "ok" | "attention" | "neutral";

/** A short titled paragraph: one of a section's points. */
export type Point = { title: string; body: string };

export type HeroContent = {
  title: SplitTitle;
  lede: string;
  actions: readonly ActionLink[];
};

/** Home page section anchors, without the leading `#`. */
export type HomeSectionId = "why" | "framework" | "how-it-works" | "vision" | "paper" | "status";

/** A mock automation in the side-panel sketch. */
export type PanelItem = { name: string; detail: string; tone: Tone };

export type ExtensionContent = {
  kicker: string;
  /** The release status, shown in its own notice under the lede. */
  notice: { title: string; body: string };
  title: SplitTitle;
  lede: string;
  actions: readonly ActionLink[];
  panel: {
    tabs: readonly [string, string];
    connection: string;
    items: readonly PanelItem[];
    runLabel: string;
    record: string;
    extract: string;
    caption: string;
  };
  features: { id: "features"; title: string; points: readonly Point[] };
  setup: { id: "setup"; title: string; lede: string; steps: readonly string[] };
};

// The privacy notice and terms of use (src/content/privacy.ts, terms.ts).
/** A run of text, optionally a link. */
export type LegalText = { text: string; href?: string; external?: boolean };

/** One paragraph, or a bulleted list when `items` is set. */
export type LegalBlock = { paragraph: readonly LegalText[] } | { items: readonly (readonly LegalText[])[] };

export type LegalSection = { heading: string; blocks: readonly LegalBlock[] };

export type LegalDocument = {
  title: string;
  description: string;
  path: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};
