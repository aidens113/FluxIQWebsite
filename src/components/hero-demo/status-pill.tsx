import { PANEL } from "@/content/hero-demo/panel";
import { PILL } from "./palette";
import type { PillScene } from "./scenes/scene";

export type StatusPillProps = { pill: NonNullable<PillScene> };

/** The floating status of a running Flow, over the example site's corner. */
export function StatusPill({ pill }: StatusPillProps) {
  const color = PILL[pill.kind];
  return (
    <div
      className="absolute right-3 bottom-3 z-[7] w-[204px] rounded-xl border border-white/16 bg-[rgba(17,19,26,0.96)] px-[11px] py-[9px] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
      style={{ animation: "demo-in 300ms ease both" }}
    >
      <div className="flex items-center gap-2">
        <span className="relative inline-flex size-3 items-center justify-center">
          {pill.kind !== "done" && (
            <span
              className="absolute inset-0.5 rounded-full"
              style={{ background: color, animation: "demo-pulse 1.6s ease-out infinite" }}
            />
          )}
          <span className="relative size-2 rounded-full" style={{ background: color }} />
        </span>
        <span className="text-[12.5px] font-semibold">{PANEL.pill[pill.kind]}</span>
      </div>
      <p className="mt-1 ml-5 text-[11px] text-[#d8dde6]">
        {pill.step ? `${pill.detail} · ${pill.step}` : pill.detail}
      </p>
    </div>
  );
}
