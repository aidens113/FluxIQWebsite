// Tell it: the person types a request; FluxIQ plans, types the search, clicks
// Search and the Calgary filter, reads the rows, and offers the data.
import { DIRECTORY } from "@/content/hero-demo/directory";
import { PANEL, TELL_IT } from "@/content/hero-demo/panel";
import { type CardState, emptyPanel, type Message, type Scene, type SceneContext, type Target } from "./scene";

const { outcomes, targets, actions, tags } = PANEL;

export function tellItScene(rawStep: number, ctx: SceneContext): Scene {
  // The request types in one step (1); later beats keep their earlier
  // numbering, so step 2 onward maps up by one.
  const s = rawStep >= 2 ? rawStep + 1 : rawStep;
  const panel = emptyPanel();
  if (s <= 2) {
    panel.empty = true;
    if (s >= 1) panel.composer = ctx.typed("ask", TELL_IT.ask);
  } else {
    const card = (id: string, name: string, target: string, at: number, last: number, doneText: string): Message => {
      const working = s === at || s <= last;
      const state: CardState = working ? "working" : "done";
      return { id, kind: "card", name, target, state, outcome: working ? outcomes.working : doneText };
    };
    const m: Message[] = [{ id: "ask", kind: "user", text: TELL_IT.ask }];
    if (s === 3)
      m.push({
        id: "plan-live",
        kind: "live",
        headline: TELL_IT.planning.headline,
        step: "",
        detail: TELL_IT.planning.detail,
      });
    if (s >= 4) m.push({ id: "plan", kind: "text", text: TELL_IT.plan });
    if (s >= 4) m.push(card("type", actions.type, targets.searchBox, 4, 0, outcomes.done));
    if (s >= 5) m.push(card("search", actions.click, targets.search, 5, 0, outcomes.done));
    if (s >= 6) m.push(card("city", actions.click, targets.city, 6, 0, outcomes.done));
    if (s >= 7) m.push(card("read", actions.read, targets.results, 7, 8, outcomes.rows));
    if (s >= 9) m.push({ id: "done", kind: "text", text: TELL_IT.done });
    if (s >= 9) m.push({ id: "data", kind: "data" });
    // Cards carry the play-by-play; FluxIQ speaks only to plan and to report.
    panel.messages = m;
  }

  const target: Target | null =
    s === 4
      ? { name: "search", kind: "auto", tag: tags.typing }
      : s === 5
        ? { name: "button", kind: "auto", tag: tags.clicking, click: true }
        : s === 6
          ? { name: "calgary", kind: "auto", tag: tags.clicking, click: true }
          : s === 7 || s === 8
            ? { name: "results", kind: "auto", tag: tags.reading }
            : s >= 9
              ? { name: "results", kind: "done", tag: tags.read }
              : null;
  const filtered = s > 6 || (s === 6 && ctx.landed);

  return {
    site: {
      query: s > 4 ? DIRECTORY.query : s === 4 ? ctx.typed("chat-search", DIRECTORY.query) : "",
      caret: s === 4,
      filtered,
      rows: s > 5 || (s === 5 && ctx.landed),
      rowsLoad: filtered ? 1 : 0,
      rowsDone: s >= 9,
      redesigned: false,
      target,
    },
    panel,
    cursor: null,
  };
}
