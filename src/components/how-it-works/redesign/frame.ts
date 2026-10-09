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
  /** The step that just failed shakes. */
  shake: boolean;
};

export type RedesignFrame = {
  /** Wednesday's run, after the redesign; Tuesday's before it. */
  after: boolean;
  /** The site shows its new layout. */
  changed: boolean;
  /** The redesign chip pings while the change is news. */
  ping: boolean;
  /** FluxIQ's scan sweeps the site sketch while it looks for the moved box. */
  scanning: boolean;
  script: SideFrame;
  flux: SideFrame;
};

/** Ticks in one telling of the story, 9 s at 50 ms. */
export const REDESIGN_CYCLE = 180;

/** Ticks each step takes while it runs. */
const STEP = 6;
/** Tuesday's run starts at 4; overnight the site changes at 44; Wednesday's run starts at 50. */
const TUE = 4;
const CHANGE = 44;
const WED = 50;
/** On Wednesday the search step fails or is found at 66; FluxIQ finds the box at 90 and keeps the fix at 104. */
const BREAK = WED + 2 * STEP + 4;
const FOUND = 90;
const FIXED = 104;
/** From here the story rests, then starts over on Tuesday. */
const REST = 166;

/** A step that runs from `start` for one STEP: idle before, working during, done after. */
const stepAt = (c: number, start: number): StepFrame => ({
  state: c < start ? "idle" : c < start + STEP ? "work" : "ok",
});

/** Tuesday's run, the same for both sides: three steps in turn, then three rows land. */
function tuesday(c: number): SideFrame {
  const done = c >= TUE + 3 * STEP;
  return {
    pill: done ? "ran" : "running",
    pillTone: done ? "ok" : "attention",
    edge: "neutral",
    steps: [stepAt(c, TUE), stepAt(c, TUE + STEP), stepAt(c, TUE + 2 * STEP)],
    rows: [0, 1, 2].map((i) => c >= TUE + 3 * STEP + 2 + i * 4),
    out: c >= TUE + 3 * STEP + 10 ? "saved" : "running",
    outTone: c >= TUE + 3 * STEP + 10 ? "ok" : "neutral",
    shake: false,
  };
}

/**
 * The redesign story at `tick`: Tuesday's run plays out for both, step by
 * step, and its rows land; overnight the search box slides into a new header;
 * on Wednesday the script's search step fails with a shake and nothing
 * arrives, while FluxIQ scans the page, finds the new box, tests the fix on a
 * full run, keeps it, and the rows land one by one. It rests, then Tuesday
 * starts again.
 */
export function redesignFrame(tick: number): RedesignFrame {
  const c = tick % REDESIGN_CYCLE;
  const resting = c >= REST;
  const after = c >= WED && !resting;
  const changed = c >= CHANGE && !resting;
  if (!after) {
    const side = tuesday(resting ? REST : c);
    return { after, changed, ping: changed, scanning: false, script: side, flux: side };
  }
  const s1 = stepAt(c, WED);
  const running = c < BREAK;
  const broke = !running;
  const looking = broke && c < FOUND;
  const found = c >= FOUND;
  const fixed = c >= FIXED;

  const script: SideFrame = {
    pill: broke ? "failed" : "running",
    pillTone: broke ? "bad" : "attention",
    edge: broke ? "bad" : "neutral",
    steps: [
      s1,
      broke ? { state: "bad", note: "notFound" } : stepAt(c, WED + STEP),
      broke ? { state: "idle", note: "neverRan" } : { state: "idle" },
    ],
    rows: [false, false, false],
    out: c >= BREAK + 14 ? "empty" : broke ? "stopped" : "running",
    outTone: broke ? "bad" : "neutral",
    shake: broke && c < BREAK + 8,
  };

  const flux: SideFrame = {
    pill: fixed ? "fixed" : found ? "testing" : looking ? "changed" : "running",
    pillTone: fixed ? "ok" : "attention",
    edge: fixed ? "ok" : broke ? "attention" : "neutral",
    steps: [
      s1,
      looking ? { state: "work", note: "looking" } : found ? { state: "ok", note: "found" } : stepAt(c, WED + STEP),
      fixed ? { state: "ok", note: "passed" } : found ? { state: "work", note: "testing" } : { state: "idle" },
    ],
    rows: [0, 1, 2].map((i) => c >= FIXED + 2 + i * 4),
    out: fixed ? "fixed" : found ? "testing" : looking ? "looking" : "running",
    outTone: fixed ? "ok" : broke ? "attention" : "neutral",
    shake: false,
  };

  return { after, changed, ping: c < BREAK, scanning: looking, script, flux };
}
