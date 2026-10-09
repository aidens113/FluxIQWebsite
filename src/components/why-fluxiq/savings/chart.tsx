import { useId } from "react";
import { WHY } from "@/content/why";
import { AGENT_Y, CURVE_PATH, GAP_PATH, type SavingsFrame, VIEW_H, VIEW_W, xForRuns } from "./model";

export type SavingsChartProps = {
  frame: SavingsFrame;
};

const CARD = WHY.card;
const VIEW_BOX = `0 0 ${VIEW_W} ${VIEW_H}`;
/** Where 10 and 100 runs fall on the cube-root axis. */
const TEN = `${xForRuns(10) * 100}%`;
const HUNDRED = `${xForRuns(100) * 100}%`;
/** Gridlines at 0.10 and 0.025 a run, and the baseline, as on the board. */
const GRID_PATH = `M0 40.5H${VIEW_W}M0 160.5H${VIEW_W}`;
const BASE_PATH = `M0 200.5H${VIEW_W}`;

/** A small note on the chart, which fades in once its moment is reached. */
function noteClass(on: boolean, tone: string, place: string) {
  return `absolute rounded-full px-[9px] py-[3px] text-[10.5px] whitespace-nowrap transition-opacity duration-400 md:text-[11.5px] ${tone} ${place} ${on ? "opacity-100" : "opacity-0"}`;
}

/**
 * FluxIQ's average cost per run against an agent's flat price, drawn in one
 * viewBox stretched to the card's width. The opening sweep reveals the line
 * up to the dot; after it the whole line stays while the dot glides. The
 * shaded saving always ends at the dot, so it grows and shrinks with it. The dot
 * and notes are placed in percentages, so the dot stays on the
 * line at every width.
 */
export function SavingsChart({ frame }: SavingsChartProps) {
  const gradientId = useId();
  const { xPct, yPct, lineXPct, settled, runs } = frame;
  // The clock moves the line and dot every frame, so nothing transitions.
  const reveal = {
    // Clip at exactly the dot's x; the 10 px above and below keep the glow.
    clipPath: `inset(-10px ${100 - lineXPct}% -10px 0)`,
  };
  // The saving shaded so far always ends at the dot, forwards and back.
  const saving = { clipPath: `inset(0 ${100 - xPct}% 0 0)` };
  const dot = {
    transform: `translate(${xPct}cqw, ${yPct}cqh)`,
  };

  return (
    <div aria-hidden="true">
      <div className="flex items-baseline justify-between">
        <p className="text-[13.5px] font-semibold text-fg md:text-[15px]">{CARD.chartTitle}</p>
        <p className="flex gap-3 text-[11.5px] text-muted md:gap-5 md:text-[12.5px]">
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="h-0.5 w-3.5 rounded-[1px] bg-[#80848e] md:w-[18px]" />
            {CARD.agent}
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="h-[3px] w-3.5 rounded-sm bg-amber md:w-[18px]" />
            {CARD.flux}
          </span>
        </p>
      </div>

      <div className="relative mt-[18px] h-[146px] [container-type:size] md:mt-[26px] md:h-[206px]">
        <svg
          viewBox={VIEW_BOX}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="presentation"
        >
          <path d={GRID_PATH} stroke="#1d1f23" vectorEffect="non-scaling-stroke" />
          <path d={BASE_PATH} className="stroke-edge" vectorEffect="non-scaling-stroke" />
          <path
            d={`M0 ${AGENT_Y}H${VIEW_W}`}
            stroke="#80848e"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute top-[48.5%] right-0 hidden font-mono text-[11px] text-dim md:block">
          {CARD.agentLine}
        </span>

        <div className="absolute inset-0" style={saving}>
          <svg
            viewBox={VIEW_BOX}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="presentation"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#7fc99b" stopOpacity={0.22} />
                <stop offset="1" stopColor="#7fc99b" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <path d={GAP_PATH} fill={`url(#${gradientId})`} />
          </svg>
        </div>
        <div className="absolute inset-0" style={reveal}>
          {/* The glow sits on the outer SVG so it is not stretched with the viewBox. Phones skip it: a filter repainted every frame stutters there. */}
          <svg
            viewBox={VIEW_BOX}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible md:drop-shadow-[0_0_6px_rgba(245,184,61,0.45)]"
            role="presentation"
          >
            <path
              d={CURVE_PATH}
              fill="none"
              className="stroke-amber [stroke-width:2.6px] md:[stroke-width:3px]"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <span
          className="absolute top-0 left-0 -mt-[7px] -ml-[7px] box-border size-3.5 will-change-transform rounded-full border-2 border-panel bg-amber shadow-[0_0_0_4px_rgba(245,184,61,0.2),0_0_14px_rgba(245,184,61,0.6)]"
          style={dot}
        />
        <span
          className={noteClass(true, "bg-amber/12 text-amber", "top-[1.4%] left-[3.2%] md:top-[5.8%] md:left-[2.4%]")}
        >
          {CARD.notes.learn}
        </span>
        <span
          className={noteClass(
            settled || runs >= 3,
            "bg-[#1a1b1f] text-fg",
            "top-[38.4%] left-[48.2%] md:top-[42.7%] md:left-[11.6%]",
          )}
        >
          {CARD.notes.even}
        </span>
        <span
          className={noteClass(
            settled || runs >= 40,
            "bg-ok/12 text-ok",
            "top-[68.5%] left-[37.9%] md:top-[70.9%] md:left-[44.6%]",
          )}
        >
          {CARD.notes.saved}
        </span>
      </div>

      <div className="relative mt-2.5 h-3.5 font-mono text-[10.5px] text-dim md:mt-3 md:text-[11.5px]">
        <span className="absolute left-0">{CARD.axis.first}</span>
        <span className="absolute -translate-x-1/2" style={{ left: TEN }}>
          {CARD.axis.ten}
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: HUNDRED }}>
          {CARD.axis.hundred}
        </span>
        <span className="absolute right-0">
          <span className="md:hidden">{CARD.axis.lastShort}</span>
          <span className="hidden md:inline">{CARD.axis.last}</span>
        </span>
      </div>
    </div>
  );
}
