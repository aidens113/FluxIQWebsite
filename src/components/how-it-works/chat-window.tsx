import { LogoMark } from "@/components/ui/logo-mark";
import type { HowItWorksContent } from "@/content/how-it-works";
import { AskCard } from "./ask-card";
import { FixCard } from "./fix-card";
import { PlanCard } from "./plan-card";
import { RunCard } from "./run-card";
import { AFTER_BEATS, ASK_BEAT, FIX_BEAT, type HowBadge, type HowFrame, PLAN_BEAT, RUN_BEATS } from "./timeline";
import { UserBubble } from "./user-bubble";

export type ChatWindowProps = {
  chat: HowItWorksContent["chat"];
  frame: HowFrame;
};

const BADGE_TONE: Record<HowBadge, string> = {
  setup: "bg-dim/12 text-dim",
  building: "bg-amber/12 text-amber",
  running: "bg-ok/12 text-ok",
  fixing: "bg-amber/12 text-amber",
  fixed: "bg-ok/12 text-ok",
};

/**
 * The job as a conversation with FluxIQ. Messages mount as the story reaches
 * them and stack from the bottom; older ones scroll up under a top fade.
 */
export function ChatWindow({ chat, frame }: ChatWindowProps) {
  const { beat } = frame;
  return (
    <div className="flex h-[470px] flex-col overflow-hidden rounded-[18px] border border-rule bg-[#0f1012] md:h-[560px]">
      <div className="flex items-center gap-2.5 border-b border-[#1d1f23] bg-[#121315] px-[18px] py-3.5">
        <span className="inline-flex size-[30px] items-center justify-center rounded-[9px] border border-amber-edge bg-amber-wash">
          <LogoMark className="size-[15px]" />
        </span>
        <div>
          <p className="text-sm font-semibold text-fg">{chat.name}</p>
          <p className="mt-px text-[11.5px] text-dim">{chat.job}</p>
        </div>
        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap transition-colors duration-300 ${BADGE_TONE[frame.badge]}`}
        >
          {chat.badges[frame.badge]}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden p-3.5 [mask-image:linear-gradient(transparent,#000_56px)] md:p-[18px]">
        {frame.asked ? <UserBubble text={chat.ask} /> : null}
        {beat >= PLAN_BEAT ? <PlanCard chat={chat} beat={beat} searchFixed={frame.searchFixed} /> : null}
        {beat >= ASK_BEAT ? (
          <AskCard chat={chat} ring={frame.allowRing} pressed={frame.allowPressed} allowed={frame.allowed} />
        ) : null}
        {chat.runs.map((run, i) =>
          beat >= (RUN_BEATS[i] ?? Number.POSITIVE_INFINITY) ? <RunCard key={run.title} run={run} /> : null,
        )}
        {beat >= FIX_BEAT ? <FixCard chat={chat} pressed={frame.keepPressed} kept={frame.kept} /> : null}
        {chat.after.map((run, i) =>
          beat >= (AFTER_BEATS[i] ?? Number.POSITIVE_INFINITY) ? <RunCard key={run.title} run={run} /> : null,
        )}
      </div>
    </div>
  );
}
