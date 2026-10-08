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
 * `neutral` is muted text. Shared by the run history, the roadmap, the concept
 * pipeline, and the side-panel sketch.
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

export type WhyContent = {
  id: HomeSectionId;
  /** Each line renders on its own line; the last is muted. */
  titleLines: readonly string[];
  points: readonly Point[];
};

export type Part = {
  kicker: string;
  title: string;
  body: string;
  items: readonly string[];
  link: SiteLink;
};

export type PartsContent = {
  id: HomeSectionId;
  title: string;
  lede: string;
  parts: readonly Part[];
};

export type Step = {
  label: string;
  title: string;
  body: string;
  /** True draws the step in the accent: the one where AI may step in again. */
  highlight?: boolean;
};

export type HowItWorksContent = {
  id: HomeSectionId;
  title: string;
  steps: readonly Step[];
};

export type RoadmapStage = { stage: string; label: string; tone: Tone };

export type PipelineStage = { label: string; value: string; highlight?: boolean };

export type PipelineFlow = { name: string; lastRun: string; status: string; tone: Tone };

export type ConceptContent = {
  prompt: string;
  heading: string;
  stages: readonly PipelineStage[];
  columns: readonly [string, string, string];
  flows: readonly PipelineFlow[];
  /** States plainly that the concept is not a shipped feature. */
  caption: string;
};

export type VisionContent = {
  id: HomeSectionId;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  roadmap: readonly RoadmapStage[];
  concept: ConceptContent;
};

export type StatusRow = {
  label: string;
  body: string;
  /** An optional link after the body. */
  link?: SiteLink;
};

export type StatusContent = {
  id: HomeSectionId;
  title: string;
  lede: string;
  rows: readonly StatusRow[];
};

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

/** The Technical Vision & Architecture paper and where the site promotes it. */
export type PaperContent = {
  id: HomeSectionId;
  title: string;
  /** Draft status and date, shown beside the title. */
  edition: string;
  /** Format, length, and size, shown on the download link. */
  format: string;
  eyebrow: string;
  heading: string;
  summary: string;
  /** What the paper covers, one line each. */
  contents: readonly string[];
  quote: string;
  link: SiteLink;
  cover: { src: string; width: number; height: number; alt: string };
  /** The one-line announcement above the home page headline. */
  banner: { tag: string; text: string; cta: string };
};
