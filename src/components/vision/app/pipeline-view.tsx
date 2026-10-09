import type { ConceptAppContent } from "@/content/vision";
import { BAR_MAX, fill, type StoryFrame } from "../outcome-story";

export type PipelineViewProps = {
  app: ConceptAppContent;
  frame: StoryFrame;
  /** The phone's version: two-by-two counters without notes, a shorter chart, no top leads. */
  compact?: boolean;
};

/** The concept app's pipeline: live counters, thirty days of new leads, and the best new leads. */
export function PipelineView({ app, frame, compact = false }: PipelineViewProps) {
  const copy = app.pipeline;
  const labelSize = compact ? "text-[10.5px]" : "text-[11.5px]";
  return (
    <>
      {compact ? null : (
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold">{copy.title}</span>
          <span className="truncate text-dim">{copy.scope}</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] text-ok">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative size-1.5 rounded-full bg-ok" />
            </span>
            {copy.live}
          </span>
        </div>
      )}
      <div className={compact ? "grid grid-cols-2 gap-1.5" : "mt-3.5 grid grid-cols-4 gap-2"}>
        {frame.counters.map((counter, i) => {
          const words = copy.counters[i];
          if (!words) return null;
          return (
            <div
              key={words.label}
              className={`min-w-0 bg-[#16171a] ${compact ? "rounded-[9px] px-2.5 py-[9px]" : "rounded-[10px] p-2.5"}`}
            >
              <p className={`${labelSize} text-dim`}>{words.label}</p>
              <p
                className={`mt-1 font-semibold tabular-nums transition-colors duration-[400ms] text-[18px] ${counter.hot ? "text-amber" : "text-fg"}`}
              >
                {counter.value.toLocaleString("en-US")}
              </p>
              {compact ? null : (
                <p className="mt-0.5 truncate text-[10.5px] text-ok">{fill(words.note, counter.note)}</p>
              )}
            </div>
          );
        })}
      </div>
      <div
        data-aim="chart"
        className={`bg-[#16171a] ${compact ? "mt-2 rounded-[9px] p-2.5" : "mt-2.5 rounded-[10px] p-3"}`}
      >
        <div className={`flex justify-between ${labelSize} text-dim`}>
          <span>{copy.chartLabel}</span>
          <span>{fill(copy.todayLabel, frame.today)}</span>
        </div>
        <div
          className={`grid grid-cols-[repeat(30,minmax(0,1fr))] items-end ${compact ? "mt-2 h-[70px] gap-0.5" : "mt-2.5 h-24 gap-[3px]"}`}
        >
          {frame.bars.map((height, i) => (
            <span
              // The bars are a fixed thirty days; the index is the day.
              // biome-ignore lint/suspicious/noArrayIndexKey: a day's position is its identity
              key={i}
              className={`rounded-t-[3px] transition-[height] duration-300 ${i === frame.bars.length - 1 ? "bg-amber" : "bg-amber/35"}`}
              style={{ height: `${(Math.min(height, BAR_MAX) / BAR_MAX) * 100}%` }}
            />
          ))}
        </div>
      </div>
      {compact ? null : (
        <div className="mt-2.5 overflow-hidden rounded-[10px] bg-[#16171a]">
          {frame.top.map((lead) => (
            <div
              key={lead.name}
              className="grid grid-cols-[1.6fr_1fr_40px] items-center gap-1.5 border-t border-[#1d1f23] px-3 py-2 first:border-t-0"
            >
              <span className="truncate">{lead.name}</span>
              <span className="truncate text-muted">{lead.city}</span>
              <span className="text-ok">{lead.score}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
