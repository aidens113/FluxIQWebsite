import type { HowStage } from "@/content/how-it-works";

export type StageListProps = {
  stages: readonly HowStage[];
  active: number;
  progress: number;
  glide: boolean;
};

/**
 * The four stages beside the chat (from `md` up); the active card lights and
 * its bar fills as the story plays. Below `md` it stays for assistive tech
 * only, and the stage progress bar shows instead.
 */
export function StageList({ stages, active, progress, glide }: StageListProps) {
  return (
    <ol className="sr-only md:not-sr-only md:flex md:flex-col md:gap-2.5">
      {stages.map((stage, i) => {
        const on = i === active;
        return (
          <li
            key={stage.num}
            className={`relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border px-5 py-[18px] transition-[background-color,border-color,opacity] duration-300 ${on ? "border-amber-edge bg-amber-wash opacity-100" : "border-rule bg-panel opacity-60"}`}
          >
            <span className={`font-mono text-xs ${on ? "text-amber" : "text-dim"}`}>{stage.num}</span>
            <h3 className="text-[16.5px] font-semibold text-fg">{stage.title}</h3>
            <p className={`text-sm leading-normal ${on ? "text-soft" : "text-dim"}`}>{stage.body}</p>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-0.5 bg-amber"
              style={{
                width: `${on ? progress * 100 : 0}%`,
                transition: on && glide ? "width .25s linear" : "none",
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}
