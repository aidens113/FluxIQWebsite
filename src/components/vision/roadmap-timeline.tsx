import type { VisionRoadmapStage } from "@/content/vision";

export type RoadmapTimelineProps = {
  stages: readonly VisionRoadmapStage[];
  className?: string;
};

const DOT = "absolute top-[5px] -left-6 size-3.5 rounded-full shadow-[0_0_0_4px_var(--color-ink)] md:-left-[26px]";
// The line from one dot's centre (12 px down) to the next one's, past the
// list gap, so each colour starts and ends exactly at a dot.
const SEGMENT = "absolute top-3 -bottom-6 -left-[18px] w-0.5 md:-bottom-[26px] md:-left-5";
const SEGMENT_TONE = { ok: "bg-ok", attention: "bg-[#5a4618]", neutral: "bg-[#2e3035]" } as const;

/**
 * Now, next, then, later on one line: green where FluxIQ is today, amber for
 * what comes next, grey beyond, each colour running from its own dot to the
 * next. The "now" dot sends out a halo.
 */
export function RoadmapTimeline({ stages, className }: RoadmapTimelineProps) {
  return (
    <div className={`relative pl-6 max-md:snap-start md:pl-[26px] ${className ?? ""}`}>
      <ol className="flex flex-col gap-3 md:gap-3.5">
        {stages.map((item, i) => (
          <li key={item.stage} className="relative">
            {i < stages.length - 1 && <span aria-hidden="true" className={`${SEGMENT} ${SEGMENT_TONE[item.tone]}`} />}
            {item.tone === "ok" ? (
              <span aria-hidden="true" className={`${DOT} bg-ok`}>
                <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-50" />
              </span>
            ) : (
              <span aria-hidden="true" className={`${DOT} ${item.tone === "attention" ? "bg-amber" : "bg-edge"}`} />
            )}
            <span
              className={`font-mono text-[11.5px] uppercase md:text-xs ${item.tone === "ok" ? "text-ok" : item.tone === "attention" ? "text-amber" : "text-dim"}`}
            >
              {item.stage}
            </span>
            <p className={`mt-0.5 text-[14.5px] md:text-[15px] ${item.tone === "neutral" ? "text-muted" : "text-fg"}`}>
              {item.label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
