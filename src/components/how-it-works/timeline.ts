/**
 * The How it works story as a pure function of the shared 50 ms clock, ported
 * from the board's `how(t, fine)`. One pass is 500 ticks (25 s); the story
 * steps every 5 ticks (`beat`, 0 to 99), and only the typing uses the fine
 * ticks. Beats:
 *   0  you type the request          17  the plan, its steps arrive one by one
 *  28  FluxIQ asks before emailing   31  Allow pressed, 32 allowed
 *  36  runs 1, 2, 8, 33 report in    58  run 400 stops, FluxIQ fixes
 *  69  Keep the fix pressed, 70 kept 73  the test run passes
 *  84  runs 401 and 402 carry on
 */

export const HOW_CYCLE = 500;

/** The beat each run card appears on, in the content's order. */
export const RUN_BEATS = [36, 40, 44, 49] as const;
export const AFTER_BEATS = [73, 86, 92] as const;
/** The beats on which the plan, the ask, and the fix messages appear. */
export const PLAN_BEAT = 17;
export const ASK_BEAT = 28;
export const FIX_BEAT = 58;
/** Plan step `i` appears on beat `19 + 1.5 i`. */
export const stepBeat = (i: number) => 19 + i * 1.5;

export type HowBadge = "setup" | "building" | "running" | "fixing" | "fixed";

export type HowFrame = {
  beat: number;
  /** The active stage, 0 to 3, and how far through it the story is, 0 to 1. */
  stage: number;
  progress: number;
  /** Whether the progress bar should glide (false right after a stage starts). */
  glide: boolean;
  /** True once the request has been sent; it appears whole. */
  asked: boolean;
  badge: HowBadge;
  /** Allow: ringed, pressed, then replaced by "Allowed by you". */
  allowRing: boolean;
  allowPressed: boolean;
  allowed: boolean;
  keepPressed: boolean;
  kept: boolean;
  /** The search step carries a "fixed" tag while the fix is fresh. */
  searchFixed: boolean;
};

const SPANS: readonly (readonly [number, number])[] = [
  [0, 17],
  [17, 34],
  [34, 56],
  [56, 84],
];

function badgeAt(beat: number): HowBadge {
  if (beat >= 17 && beat < 34) return "building";
  if ((beat >= 34 && beat < 58) || beat >= 84) return "running";
  if (beat >= 58 && beat < 70) return "fixing";
  if (beat >= 70 && beat < 84) return "fixed";
  return "setup";
}

/** The frame for clock tick `tick`. */
export function howFrame(tick: number): HowFrame {
  const fine = tick % HOW_CYCLE;
  const beat = Math.floor(fine / 5);
  // After the fix the story returns to running, so stage 03 lights again.
  const stage = beat < 17 ? 0 : beat < 34 ? 1 : beat < 56 ? 2 : beat < 84 ? 3 : 2;
  const [from, to] = beat >= 84 ? [84, 100] : (SPANS[stage] ?? [0, 17]);
  const progress = Math.max(0, Math.min(1, (beat - from + 1) / (to - from)));
  return {
    beat,
    stage,
    progress,
    glide: progress > 0.1,
    asked: fine >= 5,
    badge: badgeAt(beat),
    allowRing: beat >= 30,
    allowPressed: beat === 31,
    allowed: beat >= 32,
    keepPressed: beat === 69,
    kept: beat >= 70,
    searchFixed: beat >= 70 && beat < 84,
  };
}
