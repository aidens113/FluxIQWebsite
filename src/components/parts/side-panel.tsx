import { LogoMark } from "@/components/ui/logo-mark";
import type { BrowserMockCopy } from "@/content/parts";
import { fadeStyle, pressStyle } from "./motion";
import { PARTS_PALETTE as C } from "./palette";
import type { PartsFrame } from "./timeline";

export type SidePanelProps = {
  frame: PartsFrame;
  copy: BrowserMockCopy;
  code: string;
};

const VIEW = "absolute inset-x-3 top-10 flex flex-col gap-[7px]";

/** The extension's side panel: Connect, then the code to approve, then the steps it takes on the page. */
export function SidePanel({ frame, copy, code }: SidePanelProps) {
  const { phase } = frame;
  const pillColor = phase === "live" ? C.panelGreen : phase === "pairing" ? C.amber : C.panelMuted;
  const pill =
    phase === "live"
      ? `● ${copy.pill.connected}`
      : phase === "pairing"
        ? `● ${copy.pill.pairing}`
        : `○ ${copy.pill.off}`;
  const lastStep = copy.steps.length - 1;
  return (
    <div className="relative w-[52%] flex-none rounded-tr-[10px] border border-b-0 border-edge bg-[#111923] p-2.5 text-[10px] text-[#eef4fb] md:w-[48%] md:rounded-tr-xl md:p-3 md:text-[10.5px]">
      <span className="flex items-center gap-[5px] text-[11px] font-bold md:gap-1.5 md:text-[11.5px]">
        <LogoMark className="hidden size-[13px] md:block" />
        {copy.brand}
        <span className="ml-auto text-[10px] font-medium whitespace-nowrap" style={{ color: pillColor }}>
          {pill}
        </span>
      </span>
      <div className={VIEW} style={fadeStyle(phase === "idle", 6)}>
        <p className="font-semibold md:text-[11.5px]">{copy.connect.title}</p>
        <p className="mt-1 hidden leading-[1.45] md:block" style={{ color: C.panelMuted }}>
          {copy.connect.note}
        </p>
        <span
          className="mt-2.5 self-start rounded-[7px] px-3.5 py-1.5 font-semibold text-[#0b1220]"
          style={{ background: C.blue, ...pressStyle(frame.connect.pressed, frame.connect.glow, C.blue) }}
        >
          {copy.connect.button}
        </span>
      </div>
      <div className={VIEW} style={fadeStyle(phase === "pairing", 6)}>
        <p className="font-semibold md:text-[11.5px]">{copy.code.title}</p>
        <p className="mt-2 font-mono text-[15px] tracking-[.1em] md:mt-3 md:text-lg md:tracking-[.12em]">{code}</p>
        <p className="mt-2.5 hidden md:block" style={{ color: C.panelMuted }}>
          {copy.code.waiting}
        </p>
      </div>
      <div className={VIEW} style={fadeStyle(phase === "live", 6)}>
        {copy.steps.map((step, i) => {
          const state = frame.steps[i];
          const done = state?.done ?? false;
          return (
            <span
              key={step.verb}
              className="flex items-center gap-[7px] rounded-lg border border-[#1f2e3f] bg-[#142030] px-2 py-1.5"
              style={fadeStyle(state?.shown ?? false, 4)}
            >
              <span
                className="inline-flex size-4 flex-none items-center justify-center rounded-[5px]"
                style={{ background: done ? `${C.panelGreen}22` : `${C.blue}22`, color: done ? C.panelGreen : C.blue }}
              >
                {done ? "✓" : "•"}
              </span>
              <span className="min-w-0">
                {`${step.verb} · ${step.target}${done && i === lastStep ? ` · ${copy.stepsResult}` : ""}`}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
