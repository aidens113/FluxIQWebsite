import { FOCUS_RING } from "@/components/ui/focus-ring";
import { LogoMark } from "@/components/ui/logo-mark";
import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { ProgressRing } from "./progress-ring";
import type { View } from "./use-demo-player";

export type ViewSwitchProps = {
  view: View;
  onPick: (view: View) => void;
  /** True when the chat has messages the site view is not showing. */
  chatNews: boolean;
  ms: number;
  runKey: string;
  running: boolean;
};

/** Phone: switches the stage between the example website and the FluxIQ panel. */
export function ViewSwitch({ view, onPick, chatNews, ms, runKey, running }: ViewSwitchProps) {
  const tab = (v: View) =>
    `inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors ${FOCUS_RING} ${
      view === v ? "bg-[#2a2d33] text-fg" : "text-dim"
    }`;
  return (
    <div className="mb-2.5 flex items-center gap-2.5">
      <div
        role="tablist"
        aria-label={DEMO_LABELS.viewSwitch}
        className="flex gap-0.5 rounded-[10px] border border-[#26282d] bg-[#15171b] p-[3px]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "site"}
          onClick={() => onPick("site")}
          className={tab("site")}
        >
          {DEMO_LABELS.viewSite}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "panel"}
          onClick={() => onPick("panel")}
          className={tab("panel")}
        >
          <LogoMark className="size-3.5" />
          {DEMO_LABELS.viewPanel}
          {chatNews && <span className="size-1.5 rounded-full bg-amber" />}
        </button>
      </div>
      <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted">
        <ProgressRing ms={ms} runKey={runKey} running={running} size={14} />
        {DEMO_LABELS.tapToSkip}
      </span>
    </div>
  );
}
