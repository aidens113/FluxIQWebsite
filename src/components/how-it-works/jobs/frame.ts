import type { HowJob, HowResult } from "@/content/how-it-works";

/** The job card at one tick: its counts, its latest result, and whether a run is under way. */
export type JobView = {
  /** Runs finished so far, formatted. */
  count: string;
  last: string;
  running: boolean;
  /** How far the current run is, 0 to 1. */
  progress: number;
  result: HowResult;
  /** The result just landed, so its box is outlined in its tone. */
  fresh: boolean;
};

/** Ticks between runs, ticks a run takes on screen, and ticks a new result stays outlined. */
const PERIOD = 90;
const RUN = 22;
const FRESH = 30;
/** How far into its cycle the card starts, so a run begins soon after it comes into view. */
const OFFSET = 30;

const DAY_ZERO = Date.UTC(2026, 9, 6);
const dayName = (offset: number) =>
  new Date(DAY_ZERO + offset * 86_400_000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/**
 * The card at `tick`: a run every PERIOD ticks, each a new day. Counts come
 * from the total tick, so they only climb; the result shown is the latest
 * finished run's.
 */
export function jobView(tick: number, job: HowJob): JobView {
  const local = tick + OFFSET;
  const phase = local % PERIOD;
  const running = phase < RUN;
  const done = Math.floor(local / PERIOD) + (running ? 0 : 1);
  const m = Math.max(0, done - 1);
  return {
    count: (job.base + done).toLocaleString("en-US"),
    last: `${dayName(m)}, ${job.time}`,
    running,
    progress: (phase + 1) / RUN,
    result: job.results[m % job.results.length] as HowResult,
    fresh: !running && phase < RUN + FRESH,
  };
}
