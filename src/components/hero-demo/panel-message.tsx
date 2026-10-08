import { PANEL } from "@/content/hero-demo/panel";
import { CARD } from "./palette";
import type { Message } from "./scenes/scene";

export type PanelMessageProps = { message: Message };

const rise = { animation: "demo-in 300ms ease both" };

/** One entry in the example chat: the person's message, FluxIQ's words, a live status, an action card, or the data. */
export function PanelMessage({ message: m }: PanelMessageProps) {
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
      <p className="text-[12.5px] leading-normal text-[#eef4fb]" style={rise}>
        {m.text}
      </p>
    );
  if (m.kind === "live")
    return (
      <div className="flex items-start gap-2" style={rise}>
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
        className="flex items-center justify-between rounded-[10px] bg-[#172231] px-[11px] py-[9px] text-[11.5px]"
        style={rise}
      >
        <span>{PANEL.data.label}</span>
        <span className="font-semibold text-[#5e9eea]">{PANEL.data.formats}</span>
      </div>
    );
  const { tone, mark } = CARD[m.state];
  const alarm = m.state === "fixing" || m.state === "failed";
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] bg-[#172231] px-2.5 py-[9px]"
      style={{ ...rise, border: `1px solid ${alarm ? `${tone}66` : "#26384a"}`, transition: "border-color 300ms ease" }}
    >
      <span
        className="inline-flex size-7 flex-none items-center justify-center rounded-full font-bold"
        style={{
          fontSize: m.state === "captured" ? 8 : 13,
          color: tone,
          background: `${tone}22`,
          transition: "all 300ms ease",
        }}
      >
        {mark}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold">
          {m.name} <span className="font-normal text-[#93a4b6]">· {m.target}</span>
        </span>
        <span className="mt-0.5 block text-[11.5px]" style={{ color: tone }}>
          {m.outcome}
        </span>
      </span>
    </div>
  );
}
