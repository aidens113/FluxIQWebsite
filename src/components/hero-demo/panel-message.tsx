import { PANEL } from "@/content/hero-demo/panel";
import { ActionIcon } from "./action-icon";
import { CARD } from "./palette";
import type { Message } from "./scenes/scene";
import { StatusMark } from "./status-mark";

export type PanelMessageProps = {
  message: Message;
  /** True for an action that follows another: the two sit close, as one list. */
  joined?: boolean;
};

const rise = { animation: "demo-in 420ms ease both" };

/** One entry in the example chat: the person's message, FluxIQ's words, a live status, an action, or the data. */
export function PanelMessage({ message: m, joined }: PanelMessageProps) {
  if (m.kind === "user")
    return (
      <div
        className="max-w-[86%] self-end rounded-2xl rounded-br-md bg-[#1f2c3b] px-3 py-2 text-[12.5px] leading-[1.45]"
        style={rise}
      >
        {m.text}
      </div>
    );
  if (m.kind === "text")
    return (
      <p className="max-w-[94%] text-[12.5px] leading-[1.55] text-[#d9e3ee]" style={rise}>
        {m.text}
      </p>
    );
  if (m.kind === "live")
    return (
      <div className="flex items-start gap-2.5 text-[12px] leading-[1.45]" style={rise}>
        <span className="relative mt-[5px] size-2 flex-none">
          <span
            className="absolute inset-0 rounded-full bg-[#f5b94a]"
            style={{ animation: "demo-pulse 1.6s ease-out infinite" }}
          />
          <span className="absolute inset-0 rounded-full bg-[#f5b94a]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="font-semibold">{m.headline}</span>
            <span className="ml-auto text-[10.5px] text-[#6b7c8f] tabular-nums">{m.step}</span>
          </span>
          <span className="block text-[11.5px] text-[#93a4b6]">{m.detail}</span>
        </span>
      </div>
    );
  if (m.kind === "data")
    return (
      <div className="flex items-center justify-between rounded-lg bg-[#162332] px-2.5 py-2 text-[11.5px]" style={rise}>
        <span>{PANEL.data.label}</span>
        <span className="font-semibold text-[#5e9eea]">{PANEL.data.formats}</span>
      </div>
    );
  const { tone } = CARD[m.state];
  const alarm = m.state === "fixing" || m.state === "failed";
  // A short outcome ("Done") sits at the row's end; a sentence gets its own line.
  const short = m.outcome.length <= 16;
  const outcome = (
    <span className={`flex items-center gap-1.5 text-[11px] ${short ? "flex-none" : "mt-0.5"}`} style={{ color: tone }}>
      <StatusMark state={m.state} tone={tone} />
      {m.outcome}
    </span>
  );
  return (
    <div
      className={`flex gap-2 rounded-lg px-2 py-1.5 text-[11.5px] leading-4 ${short ? "items-center" : "items-start"} ${joined ? "-mt-2" : ""}`}
      style={{
        ...rise,
        background: alarm ? `${tone}14` : "#162332",
        boxShadow: alarm ? `inset 0 0 0 1px ${tone}55` : "none",
        transition: "background 300ms ease, box-shadow 300ms ease",
      }}
    >
      <ActionIcon name={m.name} state={m.state} tone={tone} />
      <span className={`min-w-0 flex-1 ${short ? "truncate" : "self-center"}`}>
        <span className="font-semibold">{m.name}</span> <span className="text-[#93a4b6]">{m.target}</span>
        {!short && outcome}
      </span>
      {short && outcome}
    </div>
  );
}
