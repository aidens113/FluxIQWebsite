import type { RunHistoryContent } from "./types";

// An illustration, labelled as one. The checking rhythm (runs 1, 2, 3, then 8)
// is Core's default `initial_then_exponential` result-check schedule, and the
// restart after a repair is the graph-change reset in
// runtime/result-check-schedule (Core f6ef9f4). The site and button are made up.
export const RUN_HISTORY: RunHistoryContent = {
  label: "flow.supplier-prices · run history",
  note: "example",
  columns: ["run", "what happened", "AI used", "result"],
  rows: [
    { run: "#1", event: "built from your instruction", ai: "yes", result: "checked ✓", tone: "ok", usedAi: true },
    { run: "#2 – #3", event: "replayed saved steps", ai: "no", result: "checked ✓", tone: "ok", usedAi: false },
    {
      run: "#4 – #32",
      event: "replayed · checked at #8, then less often",
      ai: "no",
      result: "ok",
      tone: "neutral",
      usedAi: false,
    },
    {
      run: "#33",
      event: "site moved the “Export” button · diagnosed",
      ai: "within limit",
      result: "fix proposed",
      tone: "attention",
      usedAi: true,
    },
    {
      run: "#34 →",
      event: "repaired Flow replays · checking starts over",
      ai: "no",
      result: "checked ✓",
      tone: "ok",
      usedAi: false,
    },
  ],
};
