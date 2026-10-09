// It adapts: the site has been redesigned. FluxIQ replays the saved
// automation; the Search step breaks, it uses AI once to find the moved
// button, finishes, and the next run needs no AI.
import { DIRECTORY } from "@/content/hero-demo/directory";
import { IT_ADAPTS, PANEL } from "@/content/hero-demo/panel";
import { type CardState, emptyPanel, type Message, type Scene, type SceneContext, type Target } from "./scene";

const { outcomes, targets, actions, tags } = PANEL;

function target(step: number): Target | null {
  if (step === 0) return { name: "search", kind: "auto", tag: tags.typing };
  if (step === 1) return { name: "row", kind: "fail", tag: tags.missing };
  // Blue while it scans the new layout, green once it has found Search.
  if (step === 2) return { name: "row", kind: "scan", tag: tags.scanning };
  if (step === 3) return { name: "button", kind: "done", tag: tags.found, click: true };
  if (step === 4) return { name: "calgary", kind: "auto", tag: tags.clicking, click: true };
  if (step === 7) return { name: "button", kind: "auto", tag: tags.clicking, click: true };
  if (step === 5 || step === 8) return { name: "results", kind: "auto", tag: tags.reading };
  if (step === 6 || step === 9) return { name: "results", kind: "done", tag: tags.read };
  return null;
}

export function itAdaptsScene(step: number, ctx: SceneContext): Scene {
  const card = (id: string, name: string, target: string, state: CardState, outcome: string): Message => ({
    id,
    kind: "card",
    name,
    target,
    state,
    outcome,
  });
  const working = (at: number, doneText: string) => (step === at ? outcomes.working : doneText);
  const m: Message[] = [];
  if (step < 7) {
    m.push({ id: "replaying", kind: "text", text: IT_ADAPTS.replaying });
    m.push(card("type", actions.type, targets.searchBox, step === 0 ? "working" : "done", working(0, outcomes.done)));
    if (step >= 1) {
      const state: CardState = step === 1 ? "failed" : step === 2 ? "fixing" : "done";
      const outcome = step === 1 ? IT_ADAPTS.failed : step === 2 ? IT_ADAPTS.finding : IT_ADAPTS.found;
      m.push(card("search", actions.click, targets.search, state, outcome));
      m.push({ id: "moved", kind: "text", text: IT_ADAPTS.moved });
    }
    if (step === 2) m.push({ id: "fixing", kind: "live", ...IT_ADAPTS.fixing });
    if (step >= 4)
      m.push(card("city", actions.click, targets.city, step === 4 ? "working" : "done", working(4, outcomes.done)));
    if (step >= 5)
      m.push(card("read", actions.read, targets.results, step === 5 ? "working" : "done", working(5, outcomes.rows)));
    if (step >= 6) m.push({ id: "finished", kind: "text", text: IT_ADAPTS.finished });
  } else {
    m.push({ id: "again", kind: "text", text: IT_ADAPTS.again });
    m.push(card("type-2", actions.type, targets.searchBox, "done", outcomes.done));
    m.push(card("search-2", actions.click, targets.search, step === 7 ? "working" : "done", working(7, outcomes.done)));
    if (step >= 8)
      m.push(card("read-2", actions.read, targets.results, step === 8 ? "working" : "done", working(8, outcomes.rows)));
    if (step >= 9) m.push({ id: "finished-2", kind: "text", text: IT_ADAPTS.finishedAgain });
  }

  const panel = emptyPanel();
  panel.messages = m;
  panel.strip = {
    runLabel: step === 6 ? PANEL.run : PANEL.running,
    text:
      step <= 2
        ? IT_ADAPTS.strip.before
        : step <= 6
          ? IT_ADAPTS.strip.learned
          : step <= 8
            ? IT_ADAPTS.strip.again
            : IT_ADAPTS.strip.after,
    tone: step >= 3 && step <= 6 ? "amber" : "muted",
  };

  // The Calgary filter stays on for the second run; a new results load
  // replays the list either way.
  const filtered = step > 4 || (step === 4 && ctx.landed);
  return {
    site: {
      query: step === 0 ? ctx.typed("replay", DIRECTORY.query) : DIRECTORY.query,
      caret: step === 0,
      filtered,
      rows: step > 3 || (step === 3 && ctx.landed),
      rowsLoad: step > 7 || (step === 7 && ctx.landed) ? 2 : filtered ? 1 : 0,
      rowsDone: step === 6 || (step === 7 && !ctx.landed) || step === 9,
      redesigned: true,
      target: target(step),
    },
    panel,
    cursor: null,
  };
}
