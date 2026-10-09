import type { HowJob, HowResult } from "@/content/how-it-works";

/** One job card at one tick: its counts, its latest result, and whether a run is under way. */
export type JobView = {
  /** Runs finished so far, formatted. */
  count: string;
  last: string;
  running: boolean;
  /** How far the current run is, 0 to 1. */
  progress: number;
  result: HowResult;
  /** Changes when a new item is watched, so its result fades in fresh. */
  resultKey: number;
  /** The result just landed, so its box is outlined in its tone. */
  fresh: boolean;
};

/** Ticks a run takes on screen. */
const RUN = 22;
/** Ticks a new result stays outlined. */
const FRESH = 30;
/** Ticks each card is shown, and when its run starts. */
export const CARD_TICKS = 110;
const RUN_AT = 26;

const DAY_ZERO = Date.UTC(2026, 9, 6);
const dayName = (offset: number) =>
  new Date(DAY_ZERO + offset * 86_400_000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** When run `m` (counted from the page opening) happened, by the Flow's cadence. */
function lastRun(job: HowJob, m: number): string {
  if (job.cadence === "hourly") return `${String((8 + m) % 24).padStart(2, "0")}:00`;
  if (job.cadence === "weekly") return `${dayName(7 * m - 4)}, ${job.time}`;
  return `${dayName(m)}, ${job.time}`;
}

/** A card after `done` finished runs; the result shown is the latest finished one. */
function view(job: HowJob, done: number, running: boolean, progress: number, fresh: boolean): JobView {
  const m = Math.max(0, done - 1);
  const index = m % job.results.length;
  return {
    count: (job.base + done).toLocaleString("en-US"),
    last: lastRun(job, m),
    running,
    progress,
    result: job.results[index] as HowResult,
    resultKey: Math.floor(index / (job.group ?? job.results.length)),
    fresh,
  };
}

/**
 * One card at a time, in turn, at every width; each runs once while it is shown.
 * Returns the cards and which one is showing.
 */
export function carouselJobs(tick: number, jobs: readonly HowJob[]): { views: JobView[]; active: number } {
  const lap = Math.floor(tick / (jobs.length * CARD_TICKS));
  const active = Math.floor(tick / CARD_TICKS) % jobs.length;
  const phase = tick % CARD_TICKS;
  const views = jobs.map((job, i) => {
    const on = i === active;
    const running = on && phase >= RUN_AT && phase < RUN_AT + RUN;
    const finished = on && phase >= RUN_AT + RUN;
    const done = lap + (i < active || finished ? 1 : 0);
    return view(job, done, running, (phase - RUN_AT + 1) / RUN, finished && phase < RUN_AT + RUN + FRESH);
  });
  return { views, active };
}
