/**
 * The savings chart's example model: one job run up to 1,000 times. An AI
 * agent pays a flat price every run; FluxIQ pays once to learn the job, then a
 * small average for checks and the odd fix. The chart plots FluxIQ's average
 * cost per run so far, (learn + perRun·r) / r, on a log axis of runs. Every
 * price is an assumption, and the card says so.
 */
const AGENT_PER_RUN = 0.05;
const LEARN = 0.1;
const PER_RUN = 0.00016;
const MAX_RUNS = 1000;
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

const avgCost = (runs: number) => (LEARN + PER_RUN * runs) / runs;
const yFor = (cost: number) => PLOT_H - (cost / YMAX) * (PLOT_H - TOP_PAD);
const xForRuns = (runs: number) => (Math.log10(runs) / DECADES) * VIEW_W;
const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** The agent's flat line, in viewBox units. */
export const AGENT_Y = yFor(AGENT_PER_RUN);

const SAMPLES = 150;
const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const x = (i / SAMPLES) * VIEW_W;
  const runs = 10 ** ((x / VIEW_W) * DECADES);
  return { x, y: yFor(avgCost(runs)) };
});

/** FluxIQ's average cost per run, from 1 to 1,000 runs. */
export const CURVE_PATH = `M${curve.map((p) => point(p.x, p.y)).join(" L")}`;

/** Where the curve drops below the agent's line: LEARN / (agent − perRun), about 2.01 runs. */
const CROSS_X = xForRuns(LEARN / (AGENT_PER_RUN - PER_RUN));

/** The saving: the area between the agent's line and the curve, right of the crossing. */
export const GAP_PATH = `M${point(CROSS_X, AGENT_Y)} L${point(VIEW_W, AGENT_Y)} L${curve
  .filter((p) => p.x > CROSS_X)
  .reverse()
  .map((p) => point(p.x, p.y))
  .join(" L")} Z`;

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
  const fluxSpent = LEARN + PER_RUN * runs;
  return {
    runs,
    agentSpent,
    fluxSpent,
    saved: agentSpent - fluxSpent,
    xPct: f * 100,
    yPct: (yFor(avgCost(exact)) / VIEW_H) * 100,
    hidden: c >= HIDE_AT,
  };
}
