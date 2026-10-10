// The two-track story on the shared 50 ms clock. A playhead walks eight
// mornings of one Flow. Overnight before Wednesday (day 2) the site moves its
// search box: the recorded script fails every morning after, while FluxIQ
// looks, tests the fix on a full run, and keeps adding rows.

export const CYCLE = 216;
export const BREAK = 2;
const LOOK = 42;
const TEST = 52;
const FIXED = 62;
const LAST = 7;

/** When the playhead reaches each position (in days); it waits on Wednesday while FluxIQ fixes. */
const KEYS: readonly (readonly [number, number])[] = [
  [0, -0.6],
  [10, 0],
  [26, 1],
  [LOOK, 2],
  [FIXED, 2],
  [78, 3],
  [94, 4],
  [110, 5],
  [126, 6],
  [142, LAST],
  [CYCLE, LAST],
];

export type Lane = "flux" | "script";
export type PointState = "future" | "ok" | "work" | "bad";
export type PointNote = "rows" | "fixed" | "looking" | "testing" | "notFound" | "zero" | "none";

export type TrackPoint = { state: PointState; note: PointNote; fresh: boolean };

export type TracksFrame = {
  /** The playhead, in days: -0.6 before Monday, 7 on the last Monday. */
  pos: number;
  /** The redesign has happened. */
  changed: boolean;
  /** FluxIQ is looking for the moved search box. */
  scanning: boolean;
  /** The redesign chip pulses until just after the fix. */
  ping: boolean;
  /** FluxIQ is between noticing the change and keeping the fix. */
  fixing: boolean;
  flux: readonly TrackPoint[];
  script: readonly TrackPoint[];
  fluxRows: number;
  scriptRows: number;
};

function playhead(t: number): number {
  for (let k = 1; k < KEYS.length; k++) {
    const [t0, p0] = KEYS[k - 1] ?? [0, 0];
    const [t1, p1] = KEYS[k] ?? [0, 0];
    if (t <= t1) return p0 + ((t - t0) / (t1 - t0)) * (p1 - p0);
  }
  return LAST;
}

function trackPoint(lane: Lane, i: number, pos: number, t: number): TrackPoint {
  if (pos < i - 0.001) return { state: "future", note: "none", fresh: false };
  const fresh = pos - i < 0.35;
  if (lane === "script" && i >= BREAK) return { state: "bad", note: i === BREAK ? "notFound" : "zero", fresh };
  if (lane === "flux" && i === BREAK && t < FIXED)
    return { state: "work", note: t < TEST ? "looking" : "testing", fresh };
  return { state: "ok", note: lane === "flux" && i === BREAK ? "fixed" : "rows", fresh };
}

/** Everything the tracks show at tick `tick`, given each morning's new rows. */
export function tracksFrame(tick: number, rows: readonly number[]): TracksFrame {
  const t = tick % CYCLE;
  const pos = playhead(t);
  const flux = rows.map((_, i) => trackPoint("flux", i, pos, t));
  const script = rows.map((_, i) => trackPoint("script", i, pos, t));
  const total = (points: readonly TrackPoint[]) =>
    points.reduce((n, p, i) => (p.state === "ok" ? n + (rows[i] ?? 0) : n), 0);
  return {
    pos,
    changed: pos >= 1.5,
    scanning: t >= LOOK && t < TEST,
    ping: pos >= 1.5 && t < FIXED + 10,
    fixing: t >= LOOK && t < FIXED,
    flux,
    script,
    fluxRows: total(flux),
    scriptRows: total(script),
  };
}
