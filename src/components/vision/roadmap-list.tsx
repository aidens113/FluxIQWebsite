import { TONE_TEXT } from "@/components/ui/tone-class";
import type { RoadmapStage } from "@/content/types";

export type RoadmapListProps = {
  stages: readonly RoadmapStage[];
};

/** Now, next, then, later: one line each. */
export function RoadmapList({ stages }: RoadmapListProps) {
  return (
    <ol className="mt-8 border-b border-line text-[15px]">
      {stages.map((item) => (
        <li key={item.stage} className="flex gap-4 border-t border-line py-3">
          <span
            className={`w-14 shrink-0 pt-0.5 font-mono text-xs ${item.tone === "neutral" ? "text-dim" : TONE_TEXT[item.tone]}`}
          >
            {item.stage}
          </span>
          <span>{item.label}</span>
        </li>
      ))}
    </ol>
  );
}
