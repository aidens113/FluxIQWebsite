// The hero's three example widgets: their tabs, title cards, and the line of
// narration under the stage at each step. These are illustrations by the
// user's decision (docs/working/hero-demo.md), not a replay of the product:
// the extension (FluxIQWebExtension b6768b7) is unreleased, and the caption
// says so. Its vocabulary is kept: a chat-first side panel, a card per action,
// recording, and runs that need no model until a page changes.

export type DemoExample = {
  label: string;
  /** A small marker before the label, for the "or" between two ways to start. */
  prefix?: string;
  hint: string;
  /** The mono label before the narration line. */
  beat: string;
  intro: { kicker: string; title: string; body: string };
  /** Narration while the title card shows. */
  introLine: string;
  /** Narration for each step, in order. */
  lines: string[];
};

export const DEMO_EXAMPLES: readonly [DemoExample, DemoExample, DemoExample] = [
  {
    label: "Tell it",
    hint: "Type what you want in plain words.",
    beat: "01 · Tell it",
    intro: {
      kicker: "01",
      title: "Tell it",
      body: "Type what you want in plain words. FluxIQ works out the steps and does them on the page.",
    },
    introLine: "Here’s how it works.",
    lines: [
      "One way to start: tell FluxIQ what you want done.",
      "You type what you want, in plain words.",
      "FluxIQ plans the steps.",
      "It types the search on the real page…",
      "…clicks Search…",
      "…filters to Calgary…",
      "…and reads the results, row by row.",
      "…and reads the results, row by row.",
      "Done: 24 rows, ready to export.",
    ],
  },
  {
    label: "Record it",
    prefix: "or",
    hint: "Do the task once while FluxIQ watches.",
    beat: "02 · or Record it",
    intro: {
      kicker: "OR",
      title: "Record it",
      body: "Rather show than tell? Do the task once. FluxIQ watches and turns your steps into an automation.",
    },
    introLine: "Another way to start.",
    lines: [
      "Or, instead of typing: press record and do the task once.",
      "You click the search box.",
      "You type “roofing”.",
      "You click Search. FluxIQ captures every action.",
      "You filter to Calgary.",
      "You stop recording.",
      "FluxIQ turns your steps into an automation.",
      "Saved. From now on it runs by itself, without AI.",
    ],
  },
  {
    label: "It adapts",
    hint: "Either way, it keeps up when sites change.",
    beat: "03 · It adapts",
    intro: {
      kicker: "THEN",
      title: "It adapts",
      body: "Later, the site gets a redesign. FluxIQ replays your saved automation and fixes only what broke, using AI just for that.",
    },
    introLine: "What happens next.",
    lines: [
      "The site has been redesigned. FluxIQ replays your saved automation.",
      "The Search button moved. FluxIQ can’t find it where it was.",
      "FluxIQ uses AI once to scan the new layout.",
      "Found it. The step is fixed and the new layout remembered.",
      "…filters to Calgary…",
      "…and reads the results.",
      "AI was used once, only for what changed.",
      "Next run: the new layout is already known.",
      "Next run: the new layout is already known.",
      "No AI needed again.",
    ],
  },
];

export const DEMO_LABELS = {
  /** Read by screen readers in place of the animated stage. */
  description:
    "An animated illustration of the FluxIQ browser extension on an example lead directory. Tell it: you ask in plain words and FluxIQ searches, filters to Calgary, and reads 24 rows. Record it: you do the task once and FluxIQ captures each step as an automation. It adapts: after a redesign moves the Search button, FluxIQ uses AI once to find it, then runs again without AI.",
  caption: "An illustration of the FluxIQ browser extension, which is coming soon.",
  skipHint: "Click the demo to skip ahead",
  skipStep: "Skip to the next step",
  clickToContinue: "Click to continue",
  pause: "Pause",
  play: "Play",
  playDemo: "Play the demo",
  viewSwitch: "Demo view",
  viewSite: "Website",
  viewPanel: "FluxIQ",
  openChat: "Open the FluxIQ chat",
  chatLink: "Chat ›",
};
