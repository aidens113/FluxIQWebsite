// The one-loop story on the shared 50 ms clock, as pure state. The first time
// through, the two halves pair: press Connect, the panel shows a code,
// FluxIQ asks you to approve the same code, and the wire lights. Pairing
// happens once, so after that only the job loop repeats: the job travels to
// the browser, the extension types, searches, and reads the list, and the
// rows travel back and are saved. Ported from the approved FitsLoop board
// (docs/working/home-redesign.md).

/** Ticks before the job loop starts, spent pairing. */
const PAIR_END = 44;
/** Ticks in one job loop, after pairing. */
const LOOP = 140;

export type PairingPhase = "idle" | "pairing" | "live";
export type WireLoad = "code" | "job" | "rows";
export type FlowStatus = "ready" | "running" | "receiving" | "saved";

/** A control's press: `glow` rings it a step before and during `pressed`. */
export type Press = { pressed: boolean; glow: boolean };

export type StepState = { shown: boolean; done: boolean };

export type PartsFrame = {
  phase: PairingPhase;
  /** How far the wire has lit, 0 to 1, as the two halves join. */
  lit: number;
  /** What travels along the wire, and how far along it is (0 at FluxIQ, 1 at the browser). */
  load: WireLoad | null;
  at: number;
  /** The wire's note: what is happening along it now. */
  note: WireLoad | "working" | null;
  dialogShown: boolean;
  connect: Press;
  approve: Press;
  search: Press;
  status: FlowStatus;
  /** The running Flow's progress bar, 0 to 100. */
  progress: number;
  /** How much of the query the extension has typed. */
  typed: number;
  /** For each search result: shown, and lit as it is read. */
  results: readonly { shown: boolean; reading: boolean }[];
  steps: readonly StepState[];
};

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const press = (t: number, from: number, to: number): Press => ({
  pressed: t >= from + 1 && t < to,
  glow: t >= from && t < to,
});

/** The story's state at `tick` (50 ms ticks, fractional on the smooth clock). */
export function partsFrame(tick: number, resultCount: number, queryLength: number): PartsFrame {
  const t = tick < PAIR_END ? tick : PAIR_END + ((tick - PAIR_END) % LOOP);
  const paired = tick >= 30;
  const phase: PairingPhase = paired ? "live" : tick >= 10 ? "pairing" : "idle";

  const jobOut = t >= 48 && t < 68;
  const working = t >= 48 && t < 112;
  const rowsBack = t >= 112 && t < 132;
  // The page and the panel keep what the run did until the next run starts.
  const active = t >= 48;
  let load: WireLoad | null = null;
  let at = 0;
  if (phase === "pairing") load = "code";
  else if (jobOut) {
    load = "job";
    at = ease((t - 48) / 20);
  } else if (rowsBack) {
    load = "rows";
    at = 1 - ease((t - 112) / 20);
  }

  let status: FlowStatus = "ready";
  if (working) status = "running";
  else if (rowsBack) status = "receiving";
  else if (t >= 132) status = "saved";

  const reading = t >= 92 && t < 108 ? Math.floor((t - 92) / 4) : -1;
  return {
    phase,
    lit: ease((tick - 30) / 10),
    load,
    at,
    note: load ?? (working ? "working" : null),
    dialogShown: tick >= 14 && tick < 32,
    connect: press(tick, 4, 10),
    approve: press(tick, 25, 31),
    search: press(t, 83, 88),
    status,
    progress: working ? ((t - 48) / 64) * 100 : rowsBack ? 100 : 0,
    typed: active ? Math.max(0, Math.min(queryLength, Math.floor((t - 70) / 1.6))) : 0,
    results: Array.from({ length: resultCount }, (_, i) => ({
      shown: active && t >= 88 + i * 4,
      reading: reading === i,
    })),
    steps: [
      { shown: active && t >= 70, done: active && t >= 82 },
      { shown: active && t >= 84, done: active && t >= 88 },
      { shown: active && t >= 88, done: active && t >= 108 },
    ],
  };
}
