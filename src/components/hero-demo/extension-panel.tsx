import { LogoMark } from "@/components/ui/logo-mark";
import { PANEL, RECORD_IT } from "@/content/hero-demo/panel";
import { ClickRipple } from "./click-ripple";
import { pressStyle } from "./motion";
import { RECORD_RED } from "./palette";
import { PanelMessage } from "./panel-message";
import type { PanelScene, StripTone } from "./scenes/scene";
import { TRAVEL_MS } from "./timeline";

export type ExtensionPanelProps = {
  panel: PanelScene;
  tick: number;
  /** True on a quiet step; FluxIQ's newest message then pulses. */
  spotlight: boolean;
};

const STRIP_TONE: Record<StripTone, string> = { muted: "#93a4b6", amber: "#f5b94a", green: "#3bc982" };

/**
 * The example extension side panel: a chat-first panel with a record button,
 * a recording banner, a saved automation's run strip, the chat, and the
 * composer. The person's clicks on it wait for their cursor to arrive.
 */
export function ExtensionPanel({ panel, tick, spotlight }: ExtensionPanelProps) {
  return (
    <div className="flex h-full flex-col bg-[#111923] text-[#eef4fb]">
      <div className="flex h-11 flex-none items-center gap-2 border-b border-[#26384a] px-2.5">
        <LogoMark className="size-5" />
        <span className="text-[13px] font-bold">{PANEL.brand}</span>
        <span className="ml-1.5 flex gap-0.5 rounded-lg bg-[#0b1016] p-0.5 text-[11.5px] font-semibold">
          <span className="rounded-md bg-[#172231] px-[9px] py-1">{PANEL.tabs[0]}</span>
          <span className="px-[9px] py-1 text-[#93a4b6]">{PANEL.tabs[1]}</span>
        </span>
        <span
          className="relative ml-auto inline-flex size-4 items-center justify-center rounded-full border-[1.5px] border-[#fa6571]"
          style={panel.recordClick ? pressStyle(TRAVEL_MS) : undefined}
        >
          <span className="size-1.5 rounded-full bg-[#fa6571]" />
          {panel.recordClick && <ClickRipple key={tick} color={RECORD_RED} delay={TRAVEL_MS} />}
        </span>
        <span className="size-[7px] rounded-full bg-[#3bc982]" />
      </div>

      {panel.recording !== null && (
        <div className="flex flex-none items-center gap-2 border-b border-[#5c2430] bg-[#3a161c] px-2.5 py-2">
          <span className="relative size-[9px]">
            <span
              className="absolute inset-0 rounded-full bg-[#fa6571]"
              style={{ animation: "demo-pulse 1.6s ease-out infinite" }}
            />
            <span className="absolute inset-0 rounded-full bg-[#fa6571]" />
          </span>
          <span className="text-xs font-semibold text-[#ffd5d9]">{RECORD_IT.recording(panel.recording)}</span>
          <span
            className="relative ml-auto rounded-[7px] bg-[#d23b4a] px-2.5 py-[5px] text-[11px] font-semibold text-white"
            style={panel.stopClick ? pressStyle(TRAVEL_MS) : undefined}
          >
            {PANEL.stop}
            {panel.stopClick && <ClickRipple key={tick} color={RECORD_RED} delay={TRAVEL_MS} />}
          </span>
        </div>
      )}

      {panel.strip && (
        <div className="flex-none border-b border-[#26384a] bg-[#0f1620] px-3 py-[9px]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">{PANEL.flowName}</span>
            <span className="ml-auto rounded-md bg-[#172231] px-2.5 py-[3px] text-[11px] font-semibold">
              {panel.strip.runLabel}
            </span>
          </div>
          <p className="mt-[3px] text-[11px]" style={{ color: STRIP_TONE[panel.strip.tone] }}>
            {panel.strip.text}
          </p>
        </div>
      )}

      {/* The chat fades out at the top instead of cutting messages off. */}
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden px-3.5 pt-3.5 pb-2 [mask-image:linear-gradient(to_bottom,transparent,#000_28px)]">
        {panel.empty && (
          <div className="mt-10 mb-auto text-center" style={{ animation: "demo-in 300ms ease both" }}>
            <p className="text-base font-bold">{PANEL.emptyTitle}</p>
            <p className="mx-3 mt-2 text-[11.5px] leading-normal text-[#93a4b6]">{PANEL.emptyBody}</p>
          </div>
        )}
        {panel.messages.map((message, i) => (
          <PanelMessage
            key={message.id}
            message={message}
            spotlight={spotlight && i === panel.messages.length - 1 && message.kind !== "user"}
          />
        ))}
      </div>

      <div className="flex-none px-3 pt-2.5 pb-3">
        <div className="flex min-h-[38px] items-center gap-2 rounded-[20px] border border-[#26384a] bg-[#172231] py-1 pr-1 pl-3.5">
          <span
            className={`flex-1 ${panel.composer === null ? "text-[12.5px] text-[#6b7c8f]" : "text-xs leading-[1.35]"}`}
          >
            {panel.composer ?? PANEL.composer}
            {panel.composer !== null && (
              <span
                className="ml-px inline-block h-[13px] w-px bg-[#eef4fb] align-[-2px]"
                style={{ animation: "demo-caret 1s steps(1) infinite" }}
              />
            )}
          </span>
          <span
            className="inline-flex size-7 flex-none items-center justify-center rounded-full"
            style={{ background: panel.composer === null ? "#3a4a5c" : "#eef4fb" }}
          >
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3">
              <path
                d="M6 10V2M2.5 5.5 6 2l3.5 3.5"
                stroke="#0b1016"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
