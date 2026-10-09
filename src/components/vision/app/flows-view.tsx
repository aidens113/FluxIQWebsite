import type { ConceptAppContent } from "@/content/vision";
import { dollars, fill, type StoryFrame } from "../outcome-story";

export type FlowsViewProps = {
  app: ConceptAppContent;
  frame: StoryFrame;
  /** The phone's version: name, purpose, and state only. */
  compact?: boolean;
};

/** The concept app's four Flows: their runs, their cost, and the refresh Flow fixing a changed site. */
export function FlowsView({ app, frame, compact = false }: FlowsViewProps) {
  const copy = app.flows;
  return (
    <>
      {compact ? null : (
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">{copy.title}</span>
          <span className="truncate text-dim">{copy.lede}</span>
        </div>
      )}
      <div className={`flex flex-col ${compact ? "gap-1.5" : "mt-3.5 gap-2"}`}>
        {frame.flows.map((flow, i) => {
          const words = app.flowList[i];
          if (!words) return null;
          const fixing = flow.state === "fixing";
          const amber = flow.state === "running" || fixing;
          const paid = flow.cost > 0;
          return (
            <div
              key={words.name}
              data-aim={i === 2 ? "flow-2" : i === 3 ? "flow-3" : undefined}
              className={`grid items-center gap-2 rounded-[10px] border px-3 py-[11px] transition-colors duration-300 ${compact ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)_62px_70px_132px]"} ${fixing ? "border-amber-edge bg-amber-row" : "border-transparent bg-[#16171a]"}`}
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-fg">{words.name}</p>
                <p className={`truncate text-[10.5px] text-dim ${compact ? "mt-0.5" : "mt-[3px]"}`}>{words.what}</p>
              </div>
              {compact ? null : (
                <>
                  <span className="text-muted tabular-nums">{fill(copy.runs, flow.runs)}</span>
                  <span className={`tabular-nums ${paid ? "text-amber" : "text-ok"}`}>
                    {flow.once ? `${dollars(flow.cost)} ${copy.once}` : dollars(flow.cost)}
                  </span>
                </>
              )}
              <span className={`transition-colors duration-300 ${amber ? "text-amber" : "text-ok"}`}>
                ● {copy.states[flow.state]}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
