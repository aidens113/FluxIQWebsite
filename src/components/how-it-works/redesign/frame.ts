import type { HowItWorksContent } from "@/content/how-it-works";

type Split = HowItWorksContent["split"];

/** How a step reads: done, failed, under way, or not reached. */
export type StepState = "ok" | "bad" | "work" | "idle";
/** How a card's outline, pill, or outcome line reads. */
export type SideTone = "ok" | "attention" | "bad" | "neutral";

export type StepFrame = { state: StepState; note?: keyof Split["notes"] };

/** One side of the split at one tick: the recorded script or FluxIQ. */
export type SideFrame = {
  pill: keyof Split["pills"];
  pillTone: Exclude<SideTone, "neutral">;
  edge: SideTone;
  steps: readonly [StepFrame, StepFrame, StepFrame];
  /** Which of the sheet's three rows have landed. */
  rows: readonly boolean[];
  out: keyof Split["outcomes"];
  outTone: SideTone;
};

export type RedesignFrame = {
  /** Wednesday's run, after the redesign; Tuesday's before it. */
  after: boolean;
  /** The site shows its new layout. */
  changed: boolean;
  /** The redesign chip pings while the change is news. */
  ping: boolean;
  script: SideFrame;
  flux: SideFrame;
};

/** Ticks in one telling of the story, 13 s at 50 ms. */
export const REDESIGN_CYCLE = 260;

/**
 * The redesign story at `tick`: Tuesday runs fine for both; overnight the
 * search box moves; on Wednesday the script fails and nothing arrives, while
 * FluxIQ finds the new box, tests the fix on a full run, keeps it, and the
 * rows land one by one. Near the end of each cycle the site fades back to
 * its old layout and Tuesday starts again.
 */
export function redesignFrame(tick: number): RedesignFrame {
  const c = tick % REDESIGN_CYCLE;
  const end = c < 244;
  const after = c >= 50 && end;
  const changed = c >= 56 && end;
  const broke = c >= 72 && end;
  const empty = c >= 120 && end;
  const looking = c >= 72 && c < 100;
  const found = c >= 100 && end;
  const fixed = c >= 120 && end;
  const before = !after;

  const script: SideFrame = {
    pill: broke ? "failed" : after ? "running" : "ran",
    pillTone: broke ? "bad" : after ? "attention" : "ok",
    edge: broke ? "bad" : "neutral",
    steps: [
      { state: "ok" },
      broke ? { state: "bad", note: "notFound" } : { state: after ? "work" : "ok" },
      broke ? { state: "idle", note: "neverRan" } : { state: after ? "idle" : "ok" },
    ],
    rows: [before, before, before],
    out: empty ? "empty" : broke ? "stopped" : before ? "saved" : "running",
    outTone: broke ? "bad" : before ? "ok" : "neutral",
  };

  const flux: SideFrame = {
    pill: fixed ? "fixed" : found ? "testing" : looking ? "changed" : after ? "running" : "ran",
    pillTone: fixed || before ? "ok" : "attention",
    edge: fixed ? "ok" : looking || found ? "attention" : "neutral",
    steps: [
      { state: "ok" },
      looking
        ? { state: "work", note: "looking" }
        : found
          ? { state: "ok", note: "found" }
          : { state: after ? "work" : "ok" },
      fixed
        ? { state: "ok", note: "passed" }
        : found
          ? { state: "work", note: "testing" }
          : { state: after ? "idle" : "ok" },
    ],
    rows: [0, 1, 2].map((i) => before || (fixed && c >= 126 + i * 6)),
    out: fixed ? "fixed" : found ? "testing" : looking ? "looking" : before ? "saved" : "running",
    outTone: fixed || before ? "ok" : looking || found ? "attention" : "neutral",
  };

  return { after, changed, ping: changed && c < 100, script, flux };
}
