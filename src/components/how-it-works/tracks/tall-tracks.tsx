import { HOW_IT_WORKS } from "@/content/how-it-works";
import { DayPoint } from "./day-point";
import type { TracksFrame } from "./model";

export type TallTracksProps = { frame: TracksFrame };

const LAST = 7;
/** Each morning's place along the track, which doubles as its key. */
const MORNINGS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const FUTURE = { state: "future", note: "none", fresh: false } as const;
const BREAK_AT = 1.5;
const TOP = 56;
const STEP = 44;
/** The extra room the redesign band opens before Wednesday. */
const GAP = 34;
const HEIGHT = TOP + LAST * STEP + GAP + 30;
const LANE_X = { flux: "20%", script: "70%" } as const;
/** A morning's height on the track, in px. */
const at = (p: number) => TOP + p * STEP + (p > 1 ? Math.min(1, p - 1) * GAP : 0);

/** Below `xl`: the mornings run down the page, FluxIQ on the left track and the script on the right. */
export function TallTracks({ frame }: TallTracksProps) {
  const { lanes, days, rows, marker, sheet } = HOW_IT_WORKS;
  const end = at(Math.min(LAST, Math.max(0, frame.pos)));
  const breakY = at(BREAK_AT);
  return (
    <>
      <div className="relative mx-4" style={{ height: HEIGHT }}>
        <p
          className="absolute top-3 flex items-center gap-[7px] text-[13px] font-semibold text-fg"
          style={{ left: `calc(${LANE_X.flux} - 4px)` }}
        >
          <span className="size-2 rounded-[3px] bg-amber" />
          {lanes.flux}
        </p>
        <p
          className="absolute top-3 flex items-center gap-[7px] text-[13px] font-semibold text-muted"
          style={{ left: `calc(${LANE_X.script} - 4px)` }}
        >
          <span className="size-2 rounded-[3px] bg-[#55585f]" />
          {lanes.script.short}
        </p>
        {MORNINGS.map((i) => (
          <span
            key={i}
            className={`absolute left-0 font-mono text-[10.5px] leading-4 tracking-[0.04em] transition-colors duration-300 ${frame.pos >= i - 0.001 ? "text-muted" : "text-[#55585f]"}`}
            style={{ top: at(i) - 8 }}
          >
            {days[i]}
          </span>
        ))}
        <span
          className={`absolute right-0 left-9 h-px bg-linear-to-r from-transparent via-fg/30 to-transparent transition-opacity duration-400 ${frame.pos > LAST - 0.01 ? "opacity-0" : "opacity-100"}`}
          style={{ top: at(Math.max(-0.6, frame.pos)) }}
        />

        {(["flux", "script"] as const).map((lane) => (
          <span
            key={lane}
            className="absolute w-0.5 rounded-full bg-[#1f2125]"
            style={{ left: `calc(${LANE_X[lane]} - 1px)`, top: TOP, height: at(LAST) - TOP }}
          />
        ))}
        <span
          className={`absolute w-0.5 rounded-full ${frame.fixing ? "bg-linear-to-b from-ok from-70% to-amber" : "bg-ok"}`}
          style={{ left: `calc(${LANE_X.flux} - 1px)`, top: TOP, height: end - TOP }}
        />
        <span
          className="absolute w-0.5 rounded-full bg-ok"
          style={{ left: `calc(${LANE_X.script} - 1px)`, top: TOP, height: Math.min(end, breakY) - TOP }}
        />
        <span
          className="absolute w-0 border-l-2 border-dashed border-[#fa6571]/55"
          style={{ left: `calc(${LANE_X.script} - 1px)`, top: breakY, height: Math.max(0, end - breakY) }}
        />

        {(["flux", "script"] as const).map((lane) =>
          MORNINGS.map((i) => (
            <DayPoint
              key={`${lane}-${i}`}
              point={frame[lane][i] ?? FUTURE}
              added={rows[i] ?? 0}
              x={LANE_X[lane]}
              y={`${at(i)}px`}
              tall
            />
          )),
        )}

        {/* The redesign band sits above the tracks, so no line runs over its label. */}
        <span
          className={`absolute inset-x-0 z-10 border-t-[1.5px] border-dashed transition-colors duration-400 ${frame.changed ? "border-amber/80" : "border-edge/60"}`}
          style={{ top: breakY }}
        />
        <span
          className={`absolute left-1/2 z-10 inline-flex -translate-x-1/2 items-center rounded-full border px-2.5 py-[3px] text-[11.5px] font-medium whitespace-nowrap transition-colors duration-300 ${frame.changed ? "border-amber-edge bg-[#1a1810] text-amber" : "border-edge bg-[#16171a] text-dim"}`}
          style={{ top: breakY - 12 }}
        >
          {frame.ping && <span className="absolute -inset-px animate-ping rounded-full border border-amber/60" />}
          {frame.changed ? marker.after.short : marker.before.short}
        </span>
      </div>

      <div className="relative mx-4 h-[50px] border-t border-[#1d1f23]">
        <span className="absolute top-[22px] left-0 font-mono text-[9.5px] tracking-[0.06em] text-dim uppercase">
          {sheet.label.short}
        </span>
        <p className="absolute top-3" style={{ left: `calc(${LANE_X.flux} - 6px)` }}>
          <span className="text-[26px] leading-none font-semibold tracking-[-0.03em] text-ok tabular-nums">
            {frame.fluxRows}
          </span>
          <span className="ml-[5px] text-[11px] text-dim">{sheet.unit}</span>
        </p>
        <p className="absolute top-3" style={{ left: `calc(${LANE_X.script} - 6px)` }}>
          <span
            className={`text-[26px] leading-none font-semibold tracking-[-0.03em] tabular-nums transition-colors duration-300 ${frame.pos >= 2 ? "text-[#fa6571]" : "text-fg"}`}
          >
            {frame.scriptRows}
          </span>
          <span className="ml-[5px] text-[11px] text-dim">{sheet.unit}</span>
        </p>
      </div>
    </>
  );
}
