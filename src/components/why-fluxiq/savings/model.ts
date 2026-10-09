/**
 * The savings chart's example model: one repeatable job run up to 1,000
 * times. An AI agent pays a flat price every run. FluxIQ pays to build the
 * job on its first run, then to judge runs (every run at first, tapering to a
 * spot check as the Flow earns trust), and for a fix whenever a site throws up
 * an edge case it has not seen: often early, rarely once they are handled.
 * The chart plots each run's cost, smoothed on the log axis, so fixes show as
 * bumps that shrink and spread out. It assumes a job deterministic enough for
 * its edge cases to be learned; every price is an assumption, and the card
 * says so.
 */
const AGENT_PER_RUN = 0.05;
/** Building the Flow, paid on the first run. */
const BUILD = 0.1;
/** One full judgement of a run. */
const JUDGE = 0.01;
/** One fix. */
const FIX = 0.05;
/** The runs that hit a new edge case and need a fix: close together early, far apart later. */
const FIX_RUNS = new Set([4, 9, 21, 55, 160, 480]);
/** The share of runs judged: every run at first, then fewer, down to 1 in 50. */
const judged = (r: number) => Math.max(0.02, 8 / (r + 7));
const MAX_RUNS = 1000;

/** Each run's cost, and the running total after each whole run (index 0 is before any run). */
const RUN_COST: number[] = [0];
const TOTAL: number[] = [0];
for (let r = 1; r <= MAX_RUNS; r++) {
  const cost = (r === 1 ? BUILD : 0) + JUDGE * judged(r) + (FIX_RUNS.has(r) ? FIX : 0);
  RUN_COST.push(cost);
  TOTAL.push((TOTAL[r - 1] ?? 0) + cost);
}

/** The width of the smoothing, in decades of runs: wide enough to round a fix into a bump. */
const SMOOTH = 0.07;
/** A run's cost averaged with its neighbours on the log axis, so later fixes, among many cheap runs, read as ripples. */
const smoothedCost = (runs: number) => {
  const at = Math.log10(runs);
  let sum = 0;
  let weight = 0;
  for (let r = 1; r <= MAX_RUNS; r++) {
    const w = Math.exp(-((Math.log10(r) - at) ** 2) / (2 * SMOOTH * SMOOTH));
    sum += w * (RUN_COST[r] ?? 0);
    weight += w;
  }
  return sum / weight;
};

/** Decades on the log axis: 1 to 1,000 runs. */
const DECADES = Math.log10(MAX_RUNS);
/** The cost at the top of the plot. */
const YMAX = 0.12;

/** The SVG's viewBox: the plot is 200 units tall with 6 below for the stroke. */
export const VIEW_W = 740;
export const VIEW_H = 206;
const PLOT_H = 200;
/** Headroom above the highest value, in viewBox units. */
const TOP_PAD = 8;

/** The loop, in ticks of the shared 50 ms clock. */
const CYCLE = 150;
const SWEEP = 104;
const HIDE_AT = 138;

const yFor = (cost: number) => PLOT_H - (cost / YMAX) * (PLOT_H - TOP_PAD);
const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** The agent's flat line, in viewBox units. */
export const AGENT_Y = yFor(AGENT_PER_RUN);

const SAMPLES = 300;
const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const x = (i / SAMPLES) * VIEW_W;
  const runs = 10 ** ((x / VIEW_W) * DECADES);
  return { x, y: yFor(smoothedCost(runs)) };
});

/** FluxIQ's cost per run, from 1 to 1,000 runs. */
export const CURVE_PATH = `M${curve.map((p) => point(p.x, p.y)).join(" L")}`;

/** Where the curve first drops below the agent's line, found on the samples. */
const CROSS_X = curve.find((p) => p.y > AGENT_Y)?.x ?? 0;

/** The saving: the area between the agent's line and the curve, right of the crossing. */
export const GAP_PATH = `M${point(CROSS_X, AGENT_Y)} L${point(VIEW_W, AGENT_Y)} L${curve
  .filter((p) => p.x > CROSS_X)
  .reverse()
  .map((p) => point(p.x, p.y))
  .join(" L")} Z`;

/** The curve's height at `x` (viewBox units), read between the samples so the dot stays on the line. */
const curveY = (x: number) => {
  const at = Math.max(0, Math.min(SAMPLES, (x / VIEW_W) * SAMPLES));
  const i = Math.min(SAMPLES - 1, Math.floor(at));
  const a = curve[i];
  const b = curve[i + 1];
  if (!a || !b) return 0;
  return a.y + (b.y - a.y) * (at - i);
};

export type SavingsFrame = {
  /** The whole number of runs so far. */
  runs: number;
  agentSpent: number;
  fluxSpent: number;
  /** Negative while FluxIQ is still paying off its first run. */
  saved: number;
  /** The dot's position, as percentages of the plot box. */
  xPct: number;
  yPct: number;
  /** The last ticks of a loop, when the line and the notes fade out. */
  hidden: boolean;
};

/** The chart's state at one tick of the shared clock; the tick may be fractional. */
export function savingsFrame(tick: number): SavingsFrame {
  const c = tick % CYCLE;
  const q = Math.min(1, c / SWEEP);
  // Ease in and out so the dot starts and settles gently on the curve.
  const f = q < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2;
  const exact = 10 ** (DECADES * f);
  const runs = Math.max(1, Math.floor(exact + 1e-9));
  const agentSpent = AGENT_PER_RUN * runs;
  const fluxSpent = TOTAL[runs] ?? 0;
  return {
    runs,
    agentSpent,
    fluxSpent,
    saved: agentSpent - fluxSpent,
    xPct: f * 100,
    yPct: (curveY(f * VIEW_W) / VIEW_H) * 100,
    hidden: c >= HIDE_AT,
  };
}
