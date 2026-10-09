import type { VisionRoadmapStage } from "@/content/vision";

export type RoadmapTimelineProps = {
  stages: readonly VisionRoadmapStage[];
  className?: string;
};

const DOT = "absolute top-[5px] -left-6 size-3.5 rounded-full shadow-[0_0_0_4px_var(--color-ink)] md:-left-[26px]";

/**
 * Now, next, then, later on one line: green where FluxIQ is today, amber for
 * what comes next, grey beyond. The "now" dot sends out a halo.
 */
export function RoadmapTimeline({ stages, className }: RoadmapTimelineProps) {
  return (
    <div className={`relative pl-6 md:pl-[26px] ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-1.5 w-0.5 bg-[linear-gradient(#2e3a33_0_22%,#5a4618_22%_46%,#2e3035_46%_100%)]"
      />
      <span aria-hidden="true" className="absolute top-2 left-1.5 h-[calc(22%_-_4px)] w-0.5 bg-ok" />
      <ol className="flex flex-col gap-3 md:gap-3.5">
        {stages.map((item) => (
          <li key={item.stage} className="relative">
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
