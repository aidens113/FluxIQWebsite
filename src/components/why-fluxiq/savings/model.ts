/**
 * The savings chart's example model: one repeatable job run up to 1,000
 * times. An AI agent pays a flat price every run. FluxIQ pays to build the
 * job on its first run, then to judge runs (every run at first, tapering to a
 * spot check as the Flow earns trust), and for a fix whenever a site throws up
 * an edge case it has not seen: often early, rarely once they are handled.
 * The chart plots each run's cost, smoothed on a cube-root axis, so fixes show as
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

/**
 * The x axis: the cube root of the runs, 1 at the left and 1,000 at the right.
 * Like a log axis it spreads out the early runs, where the build and the first
 * fixes happen, but the savings grow in step with the dot rather than piling
 * up at the end, so the totals keep pace with the line.
 */
export const xForRuns = (runs: number) => Math.cbrt((runs - 1) / (MAX_RUNS - 1));
const runsForX = (x: number) => 1 + (MAX_RUNS - 1) * x ** 3;
const RUN_X = RUN_COST.map((_, r) => xForRuns(Math.max(1, r)));

/** The width of the smoothing, as a share of the axis: enough to round a fix into a bump. */
const SMOOTH = 0.018;
/** Each run's cost averaged with its neighbours on the axis, so later fixes, among many cheap runs, read as ripples. */
const smoothedCost = (x: number) => {
  let sum = 0;
  let weight = 0;
  for (let r = 1; r <= MAX_RUNS; r++) {
    const w = Math.exp(-(((RUN_X[r] ?? 0) - x) ** 2) / (2 * SMOOTH * SMOOTH));
    sum += w * (RUN_COST[r] ?? 0);
    weight += w;
  }
  return sum / weight;
};

/** The cost at the top of the plot. */
const YMAX = 0.12;

/** The SVG's viewBox: the plot is 200 units tall with 6 below for the stroke. */
export const VIEW_W = 740;
export const VIEW_H = 206;
const PLOT_H = 200;
/** Headroom above the highest value, in viewBox units. */
const TOP_PAD = 8;

/**
 * The motion, in ticks of the shared 50 ms clock. The opening sweep draws the
 * line once; after it the line stays and the dot glides back and forth over
 * the last three quarters of it, so the totals rise and fall with it.
 */
const SWEEP = 104;
const GLIDE = 260;
/** The glide's ends, as fractions of the line: from a quarter of the way in to the end. */
const GLIDE_LOW = 0.25;

const yFor = (cost: number) => PLOT_H - (cost / YMAX) * (PLOT_H - TOP_PAD);
const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** The agent's flat line, in viewBox units. */
export const AGENT_Y = yFor(AGENT_PER_RUN);

const SAMPLES = 300;
const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const x = (i / SAMPLES) * VIEW_W;
  return { x, y: yFor(smoothedCost(x / VIEW_W)) };
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
  /** How much of the line is drawn, as a percentage: it follows the dot only during the opening sweep. */
  lineXPct: number;
  /** True once the opening sweep is over: every note stays. */
  settled: boolean;
};

/** The chart's state at one tick of the shared clock; the tick may be fractional. */
export function savingsFrame(tick: number): SavingsFrame {
  const settled = tick >= SWEEP;
  const q = Math.min(1, tick / SWEEP);
  // The sweep eases in and out; the glide is a cosine that starts at the end
  // of the line, where the sweep stopped, so the two join without a jump.
  const f = settled
    ? GLIDE_LOW + ((1 - GLIDE_LOW) / 2) * (1 + Math.cos((2 * Math.PI * (tick - SWEEP)) / GLIDE))
    : q < 0.5
      ? 2 * q * q
      : 1 - (-2 * q + 2) ** 2 / 2;
  const exact = runsForX(f);
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
    lineXPct: settled ? 100 : f * 100,
    settled,
  };
}
