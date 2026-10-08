// Record it: the person clicks record, does the task once on the site, and
// stops; FluxIQ captures a card per action and saves the automation.
import { DIRECTORY } from "@/content/hero-demo/directory";
import { PANEL, RECORD_IT } from "@/content/hero-demo/panel";
import { type CursorSpot, emptyPanel, type Message, type Scene, type SceneContext, type TargetName } from "./scene";

const { outcomes, targets, actions, tags } = PANEL;

// The cursor travels to each target: the record button, the site, Stop.
// After Stop the person is done; the cursor fades out while FluxIQ builds the
// automation.
const CURSOR: CursorSpot[] = ["record", "search", "search", "button", "calgary", "stop", null, null];
const TARGET: (TargetName | null)[] = [null, "search", "search", "button", "calgary"];
const CLICKS = [1, 3, 4];

export function recordItScene(step: number, ctx: SceneContext): Scene {
  // Each action counts, and its card appears, once it has landed; typing
  // counts once the last letter is in.
  const typedAll = ctx.typed("recorded", DIRECTORY.query) === DIRECTORY.query;
  const done = (at: number) => step > at || (step === at && (at === 2 ? typedAll : ctx.landed));
  const count = [1, 2, 3, 4].filter(done).length;
  const captured = (id: string, name: string, target: string): Message => ({
    id,
    kind: "card",
    name,
    target,
    state: "captured",
    outcome: outcomes.captured,
  });

  const panel = emptyPanel();
  panel.recordClick = step === 0;
  panel.stopClick = step === 5;
  panel.empty = !done(0);
  panel.recording = done(0) && step <= 5 ? count : null;
  const m: Message[] = [];
  if (done(0)) m.push({ id: "started", kind: "text", text: RECORD_IT.started });
  if (done(1)) m.push(captured("box", actions.click, targets.searchBox));
  if (done(2)) m.push(captured("typed", actions.type, targets.typed));
  if (done(3)) m.push(captured("search", actions.click, targets.search));
  if (done(4)) m.push(captured("city", actions.click, targets.city));
  if (step >= 6) m.push({ id: "building", kind: "text", text: RECORD_IT.building });
  if (step === 6)
    m.push({
      id: "checking",
      kind: "live",
      headline: RECORD_IT.checking.headline,
      step: "",
      detail: RECORD_IT.checking.detail,
    });
  if (step >= 7) m.push({ id: "saved", kind: "text", text: RECORD_IT.saved });
  panel.messages = m.slice(-4);
  if (step >= 7) panel.strip = { runLabel: PANEL.run, text: RECORD_IT.ready, tone: "green" };

  const targetName = TARGET[step] ?? null;
  return {
    site: {
      query: step >= 3 ? DIRECTORY.query : step === 2 ? ctx.typed("recorded", DIRECTORY.query) : "",
      caret: step === 2 || (step === 1 && ctx.landed),
      filtered: done(4),
      rows: done(3),
      rowsLoad: done(4) ? 1 : 0,
      rowsDone: false,
      redesigned: false,
      target: targetName ? { name: targetName, kind: "user", tag: tags.recorded, click: CLICKS.includes(step) } : null,
    },
    panel,
    cursor: CURSOR[Math.min(step, CURSOR.length - 1)] ?? null,
  };
}
