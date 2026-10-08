import { PANEL } from "@/content/hero-demo/panel";
import { ActionIcon } from "./action-icon";
import { CARD } from "./palette";
import type { Message } from "./scenes/scene";

export type PanelMessageProps = {
  message: Message;
  /** True for FluxIQ's newest message on a quiet step: it pulses to draw the eye. */
  spotlight?: boolean;
};

const rise = { animation: "demo-in 300ms ease both" };

/** One entry in the example chat: the person's message, FluxIQ's words, a live status, an action card, or the data. */
export function PanelMessage({ message: m, spotlight }: PanelMessageProps) {
  const glow = spotlight ? (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[5px] rounded-[13px] bg-amber/[0.04]"
      style={{ animation: "demo-spot 1.6s ease-in-out infinite" }}
    />
  ) : null;
  if (m.kind === "user")
    return (
      <div
        className="max-w-[86%] self-end rounded-[18px] bg-[#1f2c3b] px-[13px] py-[9px] text-[12.5px] leading-[1.45]"
        style={rise}
      >
        {m.text}
      </div>
    );
  if (m.kind === "text")
    return (
      <p className="relative text-[12.5px] leading-[1.55] text-[#d9e3ee]" style={rise}>
        {glow}
        {m.text}
      </p>
    );
  if (m.kind === "live")
    return (
      <div className="relative flex items-start gap-2" style={rise}>
        {glow}
        <span className="mt-1 size-[9px] flex-none rounded-full bg-[#f5b94a] shadow-[0_0_0_4px_#f5b94a33]" />
        <span className="flex-1">
          <span className="flex gap-1.5 text-[12.5px]">
            <span className="font-semibold">{m.headline}</span>
            <span className="ml-auto text-[11px] text-[#93a4b6]">{m.step}</span>
          </span>
          <span className="mt-0.5 block text-[11.5px] text-[#93a4b6]">{m.detail}</span>
        </span>
      </div>
    );
  if (m.kind === "data")
    return (
      <div
        className="relative flex items-center justify-between rounded-[10px] border border-[#1f2e3f] bg-[#142030] px-2.5 py-2 text-[11.5px]"
        style={rise}
      >
        {glow}
        <span>{PANEL.data.label}</span>
        <span className="font-semibold text-[#5e9eea]">{PANEL.data.formats}</span>
      </div>
    );
  const { tone } = CARD[m.state];
  const alarm = m.state === "fixing" || m.state === "failed";
  return (
    <div
      className="relative flex items-center gap-2.5 rounded-[10px] bg-[#142030] px-2.5 py-[7px]"
      style={{ ...rise, border: `1px solid ${alarm ? `${tone}66` : "#1f2e3f"}`, transition: "border-color 300ms ease" }}
    >
      {glow}
      <ActionIcon name={m.name} state={m.state} tone={tone} />
      <span className="min-w-0 flex-1">
        <span className="block text-xs leading-4 font-semibold">
          {m.name} <span className="font-normal text-[#93a4b6]">· {m.target}</span>
        </span>
        <span className="block text-[11px] leading-4" style={{ color: tone }}>
          {m.outcome}
        </span>
      </span>
    </div>
  );
}
