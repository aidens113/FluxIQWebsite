import type { HowItWorksContent, HowJob } from "@/content/how-it-works";
import type { Tone } from "@/content/types";
import { StatusPill } from "../status-pill";
import type { JobView } from "./frame";

export type JobCardProps = {
  job: HowJob;
  view: JobView;
  labels: HowItWorksContent["jobs"]["labels"];
  /** Placement and visibility, from the card's list. */
  className?: string;
};

const MARK: Record<Tone, string> = {
  ok: "bg-ok/12 text-ok",
  attention: "bg-amber/12 text-amber",
  neutral: "bg-dim/12 text-dim",
};

const FRESH_EDGE: Record<Tone, string> = {
  ok: "border-ok/35",
  attention: "border-amber/35",
  neutral: "border-dim/35",
};

const LABEL = "font-mono text-[10.5px] tracking-[0.06em] text-dim uppercase lg:text-[11px]";

/**
 * One sentence over the Flow it became: its run count, last run, latest
 * result, and schedule. While a run is under way the card's edge turns amber
 * and a thin bar fills along its foot. Sizes step up from `lg`, where the
 * three cards sit side by side.
 */
export function JobCard({ job, view, labels, className }: JobCardProps) {
  const { result, running } = view;
  const alerting = !running && result.tone === "attention";
  const status = running ? labels.running : (result.status ?? labels.done);
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[18px] border bg-panel transition-[opacity,translate,border-color] duration-500 ${running ? "border-amber-edge" : "border-rule"} ${className ?? ""}`}
    >
      <div className="px-[18px] pt-[18px] pb-4 lg:px-[22px] lg:pt-[22px] lg:pb-5">
        <p className={LABEL}>{labels.youSaid}</p>
        <p className="mt-2 text-balance text-[16.5px] leading-[1.4] font-medium tracking-[-0.01em] text-fg lg:text-lg">
          “{job.ask}”
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 border-t border-[#1d1f23] px-[18px] pt-4 pb-[18px] lg:gap-4 lg:px-[22px] lg:pt-[18px] lg:pb-5">
        <div className="flex min-w-0 items-center gap-2 lg:gap-2.5">
          <span className="font-mono text-[10.5px] text-dim uppercase lg:text-[11.5px]">{labels.flow}</span>
          <span className="truncate text-[13.5px] font-semibold text-fg lg:text-sm">{job.name}</span>
          <StatusPill tone={running || alerting ? "attention" : "ok"} dot pulsing={running}>
            {status}
          </StatusPill>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-3.5">
          <div>
            <p className={LABEL}>{labels.runs}</p>
            <p className="mt-[7px] text-[26px] leading-none font-semibold tracking-[-0.03em] text-fg tabular-nums lg:mt-2 lg:text-[30px]">
              {view.count}
            </p>
          </div>
          <div>
            <p className={LABEL}>{labels.lastRun}</p>
            <p className="mt-2 text-[13px] text-soft tabular-nums lg:mt-2.5 lg:text-sm">{view.last}</p>
          </div>
        </div>
        <div
          key={view.resultKey}
          className={`flex items-center gap-[9px] rounded-[10px] border bg-[#0e0f11] px-[11px] py-[9px] text-[12.5px] leading-[1.4] transition-[opacity,border-color,color] duration-500 starting:opacity-0 lg:gap-2.5 lg:px-3 lg:py-2.5 lg:text-[13px] ${running ? "text-dim opacity-55" : "text-soft opacity-100"} ${view.fresh ? FRESH_EDGE[result.tone] : "border-[#1d1f23]"}`}
        >
          <span
            className={`inline-flex size-5 flex-none items-center justify-center rounded-full text-xs font-bold ${MARK[result.tone]}`}
          >
            {result.mark}
          </span>
          <span>{result.text}</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-x-2.5 gap-y-1 text-[11.5px] text-dim lg:gap-x-2 lg:text-xs">
          <span className="font-mono">{job.schedule}</span>
          {job.allowed && <span className="text-ok">{job.allowed}</span>}
        </div>
      </div>
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-amber ${running ? "opacity-100 transition-[width] duration-50 ease-linear" : "opacity-0 transition-opacity duration-300"}`}
        style={{ width: running ? `${Math.min(1, view.progress) * 100}%` : "0%" }}
      />
    </div>
  );
}
