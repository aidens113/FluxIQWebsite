import { HOW_IT_WORKS } from "@/content/how-it-works";
import { DayPoint } from "./day-point";
import type { TracksFrame } from "./model";
import { SiteSketch } from "./site-sketch";

export type WideTracksProps = { frame: TracksFrame };

const LAST = 7;
/** Each morning's place along the track, which doubles as its key. */
const MORNINGS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const FUTURE = { state: "future", note: "none", fresh: false } as const;
const BREAK_AT = 1.5;
const LANE_Y = { flux: 150, script: 230 } as const;
/** A position along the track, in days, as a CSS length inside the 30 px end margins. */
const at = (p: number) => `calc(30px + ${p / LAST} * (100% - 60px))`;
const span = (days: number) => `calc(${Math.max(0, days) / LAST} * (100% - 60px))`;

/** From `xl` up: the eight mornings run left to right, FluxIQ above the recorded script. */
export function WideTracks({ frame }: WideTracksProps) {
  const { lanes, days, rows, site, marker, sheet } = HOW_IT_WORKS;
  const end = Math.min(LAST, Math.max(0, frame.pos));
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)_150px] gap-6 px-7 pt-5 pb-6">
      <div className="relative h-[290px]">
        <p className="absolute top-[142px] flex items-center gap-[9px] text-[15px] font-semibold text-fg">
          <span className="size-[9px] rounded-[3px] bg-amber" />
          {lanes.flux}
        </p>
        <p className="absolute top-[222px] flex items-center gap-[9px] text-[15px] font-semibold whitespace-nowrap text-muted">
          <span className="size-[9px] rounded-[3px] bg-[#55585f]" />
          {lanes.script.full}
        </p>
      </div>

      <div className="relative h-[290px]">
        <div className="absolute top-0" style={{ left: `calc(${at(BREAK_AT)} - 132px)` }}>
          <SiteSketch site={site} changed={frame.changed} scanning={frame.scanning} />
        </div>
        <span
          className={`absolute top-[26px] inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${frame.changed ? "border-amber-edge bg-[#1a1810] text-amber" : "border-edge bg-[#16171a] text-dim"}`}
          style={{ left: `calc(${at(BREAK_AT)} + 10px)` }}
        >
          {frame.ping && <span className="absolute -inset-px animate-ping rounded-full border border-amber/60" />}
          {frame.changed ? marker.after.full : marker.before.full}
        </span>
        {MORNINGS.map((i) => (
          <span
            key={i}
            className={`absolute top-[102px] -translate-x-1/2 font-mono text-[11px] tracking-[0.04em] transition-colors duration-300 ${frame.pos >= i - 0.001 ? "text-muted" : "text-[#55585f]"}`}
            style={{ left: at(i) }}
          >
            {days[i]}
          </span>
        ))}
        <span
          className={`absolute top-20 bottom-1.5 border-l-[1.5px] border-dashed transition-colors duration-400 ${frame.changed ? "border-amber/80" : "border-edge/60"}`}
          style={{ left: at(BREAK_AT) }}
        />
        <span
          className={`absolute top-[104px] bottom-1.5 w-px bg-linear-to-b from-transparent via-fg/30 to-transparent transition-opacity duration-400 ${frame.pos > LAST - 0.01 ? "opacity-0" : "opacity-100"}`}
          style={{ left: at(Math.max(-0.6, frame.pos)) }}
        />

        {(["flux", "script"] as const).map((lane) => (
          <span
            key={lane}
            className="absolute inset-x-[30px] h-0.5 rounded-full bg-[#1f2125]"
            style={{ top: LANE_Y[lane] - 1 }}
          />
        ))}
        <span
          className={`absolute left-[30px] h-0.5 rounded-full ${frame.fixing ? "bg-linear-to-r from-ok from-70% to-amber" : "bg-ok"}`}
          style={{ top: LANE_Y.flux - 1, width: span(end) }}
        />
        <span
          className="absolute left-[30px] h-0.5 rounded-full bg-ok"
          style={{ top: LANE_Y.script - 1, width: span(Math.min(end, BREAK_AT)) }}
        />
        <span
          className="absolute h-0 border-t-2 border-dashed border-[#fa6571]/55"
          style={{ top: LANE_Y.script - 1, left: at(BREAK_AT), width: span(end - BREAK_AT) }}
        />

        {(["flux", "script"] as const).map((lane) =>
          MORNINGS.map((i) => (
            <DayPoint
              key={`${lane}-${i}`}
              point={frame[lane][i] ?? FUTURE}
              added={rows[i] ?? 0}
              x={at(i)}
              y={`${LANE_Y[lane]}px`}
            />
          )),
        )}
      </div>

      <div className="relative h-[290px] border-l border-[#1d1f23] pl-[22px]">
        <p className="absolute top-[88px] font-mono text-[11px] tracking-[0.06em] text-dim uppercase">
          {sheet.label.full}
        </p>
        <p className="absolute top-[126px]">
          <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] text-ok tabular-nums">
            {frame.fluxRows}
          </span>
          <span className="ml-1.5 text-xs text-dim">{sheet.unit}</span>
        </p>
        <p className="absolute top-[206px]">
          <span
            className={`text-[34px] leading-none font-semibold tracking-[-0.03em] tabular-nums transition-colors duration-300 ${frame.pos >= 2 ? "text-[#fa6571]" : "text-fg"}`}
          >
            {frame.scriptRows}
          </span>
          <span className="ml-1.5 text-xs text-dim">{sheet.unit}</span>
        </p>
      </div>
    </div>
  );
}
