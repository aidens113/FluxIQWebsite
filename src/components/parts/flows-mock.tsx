import { LogoMark } from "@/components/ui/logo-mark";
import type { FlowsMockCopy } from "@/content/parts";
import { fadeStyle, pressStyle } from "./motion";
import { PARTS_PALETTE as C } from "./palette";
import type { FlowStatus, PartsFrame } from "./timeline";

export type FlowsMockProps = {
  frame: PartsFrame;
  copy: FlowsMockCopy;
  code: string;
};

const STATUS_LOOK: Record<FlowStatus, { glyph: string; color: string }> = {
  ready: { glyph: "●", color: C.dim },
  running: { glyph: "●", color: C.amber },
  receiving: { glyph: "●", color: C.amber },
  saved: { glyph: "✓", color: C.ok },
};

const ROW = "grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-lg bg-[#1a1b1f] px-2.5 py-[9px]";

/** FluxIQ's Flows screen: a browser asks to connect, you approve its code once, and its Flow runs. */
export function FlowsMock({ frame, copy, code }: FlowsMockProps) {
  const live = frame.phase === "live";
  const look = STATUS_LOOK[frame.status];
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#0e0f11] text-[11.5px]">
      <div className="relative min-w-0 flex-1 p-3 md:px-4 md:py-3.5">
        <div className="mb-2.5 flex items-center justify-between gap-2 md:mb-3">
          <span className="flex items-center gap-1.5 text-[12.5px] font-semibold">
            <LogoMark className="size-[13px]" />
            {copy.brand}
          </span>
          <span
            className="text-[10.5px] whitespace-nowrap"
            style={{ color: live ? C.ok : C.dim, transition: "color .3s" }}
          >
            {live ? `● ${copy.connected}` : `○ ${copy.notConnected}`}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 md:gap-[7px]">
          <div className={`relative overflow-hidden ${ROW}`}>
            <span className="truncate">{copy.liveFlow}</span>
            <span className="whitespace-nowrap" style={{ color: look.color, transition: "color .3s" }}>
              {`${look.glyph} ${copy.status[frame.status]}`}
            </span>
            <span
              className="absolute bottom-0 left-0 h-0.5 bg-amber"
              style={{
                width: `${frame.progress}%`,
                opacity: frame.progress ? 0.8 : 0,
                transition: "opacity .3s",
              }}
            />
          </div>
          {copy.otherFlows.map((flow) => (
            <div key={flow.name} className={ROW}>
              <span className="truncate">{flow.name}</span>
              <span className="text-dim">{flow.lastRan}</span>
            </div>
          ))}
        </div>
        <div
          className="absolute inset-x-2.5 bottom-2.5 rounded-[10px] border border-amber-edge bg-[#1c1d21] p-3.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,.7)] md:inset-x-3 md:bottom-3"
          style={fadeStyle(frame.dialogShown, 14)}
        >
          <p className="text-xs font-semibold">{copy.dialog.title}</p>
          <p className="mt-1 hidden text-dim md:block">{copy.dialog.note}</p>
          <div className="mt-2 flex items-center gap-2.5 md:mt-2.5 md:block">
            <span className="font-mono text-base tracking-[.12em] text-fg md:block md:text-lg">{code}</span>
            <span className="ml-auto flex gap-2 md:mt-3 md:ml-0">
              <span
                className="rounded-[7px] bg-amber px-3 py-1.5 font-semibold text-ink"
                style={pressStyle(frame.approve.pressed, frame.approve.glow, C.amber)}
              >
                {copy.dialog.approve}
              </span>
              <span className="hidden rounded-[7px] border border-edge px-3 py-1.5 text-muted md:inline">
                {copy.dialog.deny}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
