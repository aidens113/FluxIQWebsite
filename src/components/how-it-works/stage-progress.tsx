import type { HowStage } from "@/content/how-it-works";

export type StageProgressProps = {
  stages: readonly HowStage[];
  active: number;
  progress: number;
  glide: boolean;
};

/**
 * The phone's stage list: four progress segments, then the active stage's
 * number, title, and words. Decorative; the stage list carries the text for
 * assistive tech.
 */
export function StageProgress({ stages, active, progress, glide }: StageProgressProps) {
  const stage = stages[active];
  return (
    <div aria-hidden="true" className="md:hidden">
      <div className="grid grid-cols-4 gap-1.5">
        {stages.map((s, i) => (
          <span
            key={s.num}
            className={`block h-1 overflow-hidden rounded-sm ${i < active ? "bg-amber-edge" : "bg-rule"}`}
          >
            <span
              className="block h-full bg-amber"
              style={{
                width: `${i === active ? progress * 100 : i < active ? 100 : 0}%`,
                transition: i === active && glide ? "width .25s linear" : "none",
              }}
            />
          </span>
        ))}
      </div>
      <div className="mt-3.5 min-h-[84px]">
        <p className="font-mono text-xs text-amber">{stage?.num}</p>
        <p className="mt-1 text-lg font-semibold text-fg">{stage?.title}</p>
        <p className="mt-1 text-sm leading-normal text-muted">{stage?.body}</p>
      </div>
    </div>
  );
}
