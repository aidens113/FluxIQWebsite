import type { CSSProperties } from "react";
import { PARTS } from "@/content/parts";
import type { PartsFrame } from "./timeline";

export type WireProps = {
  frame: PartsFrame;
  /** `row` joins the two zones side by side (from `lg`); `column` runs down between them (phone). */
  orientation: "row" | "column";
};

const DOT = "absolute size-[13px] rounded-full border-2 border-edge bg-panel";

/**
 * The wire between FluxIQ and the browser. It lights once the code is
 * approved; then the job travels out along it and the rows travel back. The
 * notes say what is happening; on a phone the moving chips say it alone.
 */
export function Wire({ frame, orientation }: WireProps) {
  const row = orientation === "row";
  const { wire, pairingCode, flowsMock, browserMock } = PARTS;
  const along = (at: number): CSSProperties =>
    row ? { left: `${at * 100}%`, top: "50%" } : { top: `${at * 100}%`, left: "50%" };
  const chip = (on: boolean): string =>
    `absolute z-10 -translate-1/2 rounded-full border px-[11px] py-[5px] text-xs font-medium whitespace-nowrap transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`;
  const notes = { code: wire.code, job: wire.job, rows: wire.rows, working: wire.working };
  const moving = frame.load === "job" || frame.load === "rows";
  return (
    <div className={`relative ${row ? "mx-[-6px] h-full" : "mx-auto my-1 h-[118px] w-full"}`} aria-hidden="true">
      <div
        className={`absolute ${row ? "inset-x-0 top-1/2 h-[3px] -translate-y-1/2" : "inset-y-2 left-1/2 w-[3px] -translate-x-1/2"}`}
      >
        <span className="absolute inset-0 rounded-full bg-[#1f2125]" />
        <span
          className={`absolute inset-0 rounded-full bg-ok shadow-[0_0_12px_#7fc99b66] ${row ? "origin-left" : "origin-top"}`}
          style={{ transform: row ? `scaleX(${frame.lit})` : `scaleY(${frame.lit})` }}
        />
        <span className={DOT} style={row ? { left: -6, top: -5 } : { top: -6, left: -5 }} />
        <span className={DOT} style={row ? { right: -6, top: -5 } : { bottom: -6, left: -5 }} />
        <span
          className={`${chip(frame.load === "code")} border-amber-edge bg-[#1a1810] font-mono tracking-widest text-amber ${frame.load === "code" ? "animate-pulse" : ""}`}
          style={along(0.5)}
        >
          {pairingCode}
        </span>
        <span
          className={`${chip(frame.load === "job")} border-amber/40 bg-[#1a1810] text-amber`}
          style={along(frame.at)}
        >
          {row ? "▶" : "▼"} {flowsMock.liveFlow}
        </span>
        <span className={`${chip(frame.load === "rows")} border-ok/40 bg-[#14211a] text-ok`} style={along(frame.at)}>
          {row ? "◀" : "▲"} {browserMock.stepsResult}
        </span>
      </div>
      <span
        className={`absolute text-[11.5px] font-medium whitespace-nowrap text-ok transition-opacity duration-300 ${row ? "top-[calc(50%-40px)] left-1/2 -translate-x-1/2" : "top-[calc(50%-16px)] right-[calc(50%+16px)]"} ${frame.phase === "live" && (row || !moving) ? "opacity-90" : "opacity-0"}`}
      >
        {wire.paired}
      </span>
      {row && (
        <span className="absolute top-[calc(50%+18px)] left-1/2 -translate-x-1/2 font-mono text-[11px] whitespace-nowrap text-dim">
          {frame.note ? notes[frame.note] : ""}
        </span>
      )}
    </div>
  );
}
