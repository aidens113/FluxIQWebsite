// The pairing story, one 64-step loop of 250 ms steps (16 s), as pure state.
// Press Connect, approve the matching code, and the two ends join; then the
// job goes out to the browser and the rows come back. Ported from the
// approved board's `parts(t, fine)` (docs/working/home-redesign.md).
import { typedAt } from "@/components/ui/typed-at";

/** Steps in one loop. */
export const PARTS_CYCLE = 64;
/** Clock ticks (50 ms) per story step (250 ms). */
export const TICKS_PER_STEP = 5;

export type PairingPhase = "idle" | "pairing" | "live";
export type WireLoad = "code" | "job" | "rows";
export type FlowStatus = "ready" | "running" | "receiving" | "saved";

/** What travels along the wire: which way, and whether it is the code (amber) or work (green). */
export type WireFlow = { load: WireLoad; toBrowser: boolean; tone: "amber" | "ok" };

/** A control's press: `glow` rings it a step before and during `pressed`. */
export type Press = { pressed: boolean; glow: boolean };

export type StepState = { shown: boolean; done: boolean };

export type PartsFrame = {
  phase: PairingPhase;
  flow: WireFlow | null;
  /** False for the last steps of the loop, so the reset happens unseen. */
  connectorShown: boolean;
  dialogShown: boolean;
  connect: Press;
  approve: Press;
  search: Press;
  status: FlowStatus;
  /** The running Flow's progress bar, 0 to 100. */
  progress: number;
  /** Characters of the query typed so far. */
  typed: number;
  /** For each search result: shown, and lit as it is read. */
  results: readonly { shown: boolean; reading: boolean }[];
  steps: readonly StepState[];
};

// When each of the side panel's steps appears and finishes.
const STEP_TIMES: readonly (readonly [number, number])[] = [
  [17, 24],
  [24, 26],
  [26, 30],
];

const press = (at: number, p: number, when = true): Press => ({
  pressed: when && p === at,
  glow: when && (p === at || p === at - 1),
});

/** The story's state at `tick` (50 ms ticks from the shared loop clock). */
export function partsFrame(tick: number, query: string, resultCount: number): PartsFrame {
  const p = Math.floor(tick / TICKS_PER_STEP) % PARTS_CYCLE;
  const live = p >= 11 && p < 60;
  const pairing = p >= 4 && p < 11;
  const phase: PairingPhase = live ? "live" : pairing ? "pairing" : "idle";

  let flow: WireFlow | null = null;
  if (pairing && p >= 5) flow = { load: "code", toBrowser: false, tone: "amber" };
  else if (live && p >= 13 && p < 31) flow = { load: "job", toBrowser: true, tone: "ok" };
  else if (live && p >= 31) flow = { load: "rows", toBrowser: false, tone: "ok" };

  let status: FlowStatus = "ready";
  let progress = 0;
  if (live && p >= 14 && p < 31) {
    status = "running";
    progress = ((p - 13) / 18) * 100;
  } else if (live && p >= 31 && p < 34) {
    status = "receiving";
    progress = 100;
  } else if (live && p >= 34) status = "saved";

  // Typing starts at step 17, timed in milliseconds on the fine clock.
  const fineMs = ((tick % (PARTS_CYCLE * TICKS_PER_STEP)) - 17 * TICKS_PER_STEP) * 50;
  const typed = live && p >= 17 ? typedAt(query, fineMs, 3) : 0;

  return {
    phase,
    flow,
    connectorShown: p < 57,
    dialogShown: p >= 6 && p < 11,
    connect: press(3, p),
    approve: press(10, p),
    search: press(24, p, live),
    status,
    progress,
    typed,
    results: Array.from({ length: resultCount }, (_, i) => ({
      shown: live && p >= 26 + i,
      reading: live && p === 26 + i,
    })),
    steps: STEP_TIMES.map(([shown, done]) => ({ shown: p >= shown, done: p >= done })),
  };
}
