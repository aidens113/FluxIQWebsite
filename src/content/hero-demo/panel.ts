// What the example extension panel says. The panel borrows the extension's
// side panel (FluxIQWebExtension b6768b7): a chat with the person's request, a
// card per action with its outcome, a recording banner, and a saved
// automation's run strip. "Flow" is FluxIQ's word for a saved automation.

export const PANEL = {
  brand: "FluxIQ",
  tabs: ["Chat", "Automations"],
  emptyTitle: "What can FluxIQ do for you?",
  emptyBody: "Describe what you want done on the page, in your own words.",
  composer: "Message FluxIQ",
  stop: "Stop recording",
  flowName: "Roofing leads, Calgary",
  run: "Run",
  running: "Running…",
  data: { label: "Data (24 rows)", formats: "CSV · JSON", peek: "ready to export" },
  outcomes: {
    working: "Working on it",
    done: "Done",
    captured: "Captured",
    rows: "Done: 24 rows",
  },
  targets: {
    searchBox: "Search box",
    search: "Search",
    city: "Calgary filter",
    results: "Results list",
    typed: "“roofing”",
  },
  actions: { click: "Click", type: "Type", read: "Read" },
  /** Labels on the page while FluxIQ or the person acts. */
  tags: {
    typing: "FluxIQ · Typing",
    clicking: "FluxIQ · Clicking",
    reading: "FluxIQ · Reading",
    read: "✓ Read 24 rows successfully",
    recorded: "● Recorded",
    missing: "Can’t find the Search button",
    scanning: "FluxIQ · Scanning the new layout",
    found: "✓ Found Search · Clicking",
  },
};

export const TELL_IT = {
  ask: "Find every roofing company in Calgary and get their phone numbers",
  planning: { headline: "Building your Flow", detail: "Planning the steps" },
  plan: "Sure. I’ll search the directory for roofing, filter to Calgary, then read each name and phone number.",
  done: "All done. I found 24 roofing companies in Calgary, each with a phone number. Export them below.",
};

export const RECORD_IT = {
  started: "I’m recording. Do the task once and I’ll write down each step.",
  building: "That’s 4 steps. Turning them into an automation now.",
  checking: { headline: "Building the automation…", detail: "Checking each step" },
  saved: "Saved as “Roofing leads, Calgary”. Next time it runs on its own, with no AI needed.",
  ready: "Ready · Runs without AI",
  recording: (count: number) => `Recording · ${count} step${count === 1 ? "" : "s"}`,
};

export const IT_ADAPTS = {
  replaying: "Running your saved automation, “Roofing leads, Calgary”.",
  again: "Running “Roofing leads, Calgary” again.",
  moved: "The Search button has moved. This page has been redesigned.",
  failed: "Didn’t work: it isn’t where it used to be",
  finding: "Finding it again…",
  found: "Done: found it in the new layout",
  fixing: { headline: "Fixing your Flow", step: "Step 2 of 4", detail: "Using AI once to find it in the new layout" },
  finished: "Run finished. AI was used once, only for the part that changed.",
  finishedAgain: "Run finished. No AI needed: the new layout is already known.",
  strip: {
    before: "Last run: Completed in 6.2s · No AI needed",
    learned: "AI activated once · Learned 1 new page variation · Future runs updated",
    again: "Running again on the new layout",
    after: "Last run: Completed in 5.9s · No AI needed",
  },
};
