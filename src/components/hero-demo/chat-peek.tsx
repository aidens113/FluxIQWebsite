import { FOCUS_RING } from "@/components/ui/focus-ring";
import { LogoMark } from "@/components/ui/logo-mark";
import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { PANEL } from "@/content/hero-demo/panel";
import { CARD } from "./palette";
import type { Message } from "./scenes/scene";

export type ChatPeekProps = { message: Message; onOpen: () => void };

function summary(m: Message): { lead: string; text: string; color: string } {
  if (m.kind === "card") return { lead: `${m.name} · ${m.target}`, text: m.outcome, color: CARD[m.state].tone };
  if (m.kind === "live") return { lead: m.headline, text: m.detail, color: "#f5b94a" };
  if (m.kind === "data") return { lead: PANEL.data.label, text: PANEL.data.peek, color: "#5e9eea" };
  return { lead: "", text: m.text, color: "#c9d3de" };
}

/** Phone: FluxIQ's latest message over the bottom of the example site. Tapping it opens the chat. */
export function ChatPeek({ message, onOpen }: ChatPeekProps) {
  const { lead, text, color } = summary(message);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={DEMO_LABELS.openChat}
      className={`absolute right-2.5 bottom-2.5 left-2.5 z-[31] flex min-h-11 items-center gap-2 rounded-xl border border-white/14 bg-[rgba(17,25,35,0.96)] px-3 text-left text-xs text-[#eef4fb] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] ${FOCUS_RING}`}
      style={{ animation: "demo-in 300ms ease both" }}
    >
      <LogoMark className="size-4 flex-none" />
      <span className="min-w-0 flex-1 truncate">
        {lead && <span className="font-semibold">{lead} </span>}
        <span style={{ color }}>{text}</span>
      </span>
      <span className="flex-none text-[11px] text-[#93a4b6]">{DEMO_LABELS.chatLink}</span>
    </button>
  );
}
