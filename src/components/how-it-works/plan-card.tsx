import type { HowItWorksContent } from "@/content/how-it-works";
import { FluxiqMessage } from "./fluxiq-message";
import { stepBeat } from "./timeline";

export type PlanCardProps = {
  chat: HowItWorksContent["chat"];
  beat: number;
  /** Whether the search step shows its "fixed" tag. */
  searchFixed: boolean;
};

/** FluxIQ's plan: six steps arriving one by one; the email step asks first. */
export function PlanCard({ chat, beat, searchFixed }: PlanCardProps) {
  const last = chat.steps.length - 1;
  return (
    <FluxiqMessage>
      <p>{chat.planIntro}</p>
      <ol className="mt-2.5 flex flex-col gap-[5px]">
        {chat.steps.map((step, i) =>
          beat >= stepBeat(i) ? (
            <li
              key={step.verb}
              className="how-step-in grid grid-cols-[18px_auto_minmax(0,1fr)_auto] items-center gap-1.5 rounded-[7px] bg-[#1a1b1f] px-2 py-[5px] text-[11.5px] whitespace-nowrap md:grid-cols-[20px_auto_minmax(0,1fr)_auto] md:gap-2 md:rounded-lg md:px-2.5 md:py-1.5 md:text-[12.5px] md:whitespace-normal"
            >
              <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-[#26282d] text-[10.5px] text-muted md:size-5">
                {i + 1}
              </span>
              <span className="font-semibold text-fg">{step.verb}</span>
              <span className="overflow-hidden text-ellipsis text-muted">{step.target}</span>
              {i === last ? (
                <span className="text-[11px] text-amber">
                  <span className="md:hidden">{chat.askTagShort}</span>
                  <span className="hidden md:inline">{chat.askTag}</span>
                </span>
              ) : i === 1 && searchFixed ? (
                <span className="text-[11px] text-ok">{chat.fixedTag}</span>
              ) : (
                <span />
              )}
            </li>
          ) : null,
        )}
      </ol>
    </FluxiqMessage>
  );
}
