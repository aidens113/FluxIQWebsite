// The hero's three example widgets: their tabs and labels. These are illustrations by the
// user's decision (docs/working/hero-demo.md), not a replay of the product:
// the extension (FluxIQWebExtension b6768b7) is unreleased, and the caption
// says so. Its vocabulary is kept: a chat-first side panel, a card per action,
// recording, and runs that need no model until a page changes.

export type DemoExample = {
  label: string;
  /** A small marker before the label, for the "or" between two ways to start. */
  prefix?: string;
};

export const DEMO_EXAMPLES: readonly [DemoExample, DemoExample, DemoExample] = [
  {
    label: "Tell it",
  },
  {
    label: "Record it",
    prefix: "or",
  },
  {
    label: "It adapts",
  },
];

export const DEMO_LABELS = {
  /** Read by screen readers in place of the animated stage. */
  description:
    "An animated illustration of the FluxIQ browser extension on an example lead directory. Tell it: you ask in plain words and FluxIQ searches, filters to Calgary, and reads 24 rows. Record it: you do the task once and FluxIQ captures each step as an automation. It adapts: after a redesign moves the Search button, FluxIQ uses AI once to find it, then runs again without AI.",
  caption: "An illustration of the FluxIQ browser extension, which is coming soon.",
  skipStep: "Skip to the next step",
  /** Shown under the stage on a desktop and beside the view switch on a phone. */
  skipHintClick: "Click to skip forward",
  skipHintTap: "Tap to skip forward",
  pause: "Pause",
  play: "Play",
  viewSwitch: "Demo view",
  viewSite: "Website",
  viewPanel: "FluxIQ",
  openChat: "Open the FluxIQ chat",
  chatLink: "Chat ›",
};
