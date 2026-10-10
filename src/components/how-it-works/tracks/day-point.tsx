import { HOW_IT_WORKS } from "@/content/how-it-works";
import type { TrackPoint } from "./model";

export type DayPointProps = {
  point: TrackPoint;
  /** The rows this morning adds when it runs well. */
  added: number;
  /** Where the point sits in its track, as CSS lengths. */
  x: string;
  y: string;
  /** The phone's tracks run down the page, so its notes sit to the right. */
  tall?: boolean;
};

const DOT = {
  future: "size-2 bg-[#1f2125]",
  ok: "bg-ok",
  bad: "bg-[#fa6571]",
  work: "border-[1.5px] border-amber bg-[#1a1810]",
} as const;

const TONE = { future: "text-transparent", ok: "text-ok", bad: "text-[#fa6571]", work: "text-amber" } as const;

/** One morning on a track: a dot that fills when it runs, and a note on what it did. */
export function DayPoint({ point, added, x, y, tall }: DayPointProps) {
  const { notes } = HOW_IT_WORKS;
  const pick = (phrase: { full: string; short: string }) => (tall ? phrase.short : phrase.full);
  const text = {
    none: "",
    rows: `+${added}`,
    fixed: `+${added} · ${pick(notes.fixed)}`,
    looking: pick(notes.looking),
    testing: pick(notes.testing),
    notFound: pick(notes.notFound),
    zero: "0",
  }[point.note];
  const big = point.state === "future" ? "" : tall ? "size-4 text-[9px]" : "size-[18px] text-[10px]";
  const mark = point.state === "ok" ? "✓" : point.state === "bad" ? "✕" : "";
  return (
    <span className="absolute" style={{ left: x, top: y }}>
      <span
        className={`absolute inline-flex -translate-1/2 items-center justify-center rounded-full font-bold text-ink transition-[scale,background-color] duration-300 ${DOT[point.state]} ${big} ${point.fresh && point.state !== "work" ? "scale-125" : ""}`}
      >
        {point.state === "work" && (
          <span className="absolute -inset-[5px] animate-spin rounded-full border-[1.5px] border-amber border-t-transparent" />
        )}
        {mark}
      </span>
      <span
        className={`absolute font-mono font-medium whitespace-nowrap transition-[color,opacity] duration-300 ${TONE[point.state]} ${text ? "opacity-100" : "opacity-0"} ${tall ? "top-[-8px] left-3.5 text-[11px] leading-4" : `top-4 -translate-x-1/2 rounded-[5px] bg-panel px-[5px] py-px ${text.length > 4 ? "text-[11px]" : "text-xs"}`}`}
      >
        {text}
      </span>
    </span>
  );
}
