"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { WHY } from "@/content/why";
import { SavingsChart } from "./chart";
import { savingsFrame } from "./model";

const CARD = WHY.card;
const money = (value: number) => `$${value.toFixed(2)}`;

/**
 * The bottom line: what one job saves as its runs add up, with the chart
 * sweeping from 1 to 1,000 runs on the shared clock, read every animation
 * frame so the dot glides. Below `md` the card
 * stacks and the two totals share one line; from `md` up they sit as bars
 * in a column beside the chart.
 */
export function SavingsCard() {
  const { ref, tick } = useLoopClock<HTMLDivElement>(50, true, false);
  const frame = savingsFrame(tick);
  const learning = frame.saved < 0;
  const runs = `${frame.runs.toLocaleString("en-US")} ${frame.runs > 1 ? CARD.runs : CARD.run}`;
  const fluxShare = Math.max(2, Math.min(100, (frame.fluxSpent / frame.agentSpent) * 100));

  return (
    <div
      ref={ref}
      className="mt-7 grid rounded-[18px] max-md:snap-start border border-rule bg-linear-to-b from-[#131416] to-panel px-4 pt-5 pb-[18px] md:mt-12 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 md:p-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:p-9"
    >
      <p className="sr-only">{CARD.summary}</p>

      <div className="flex flex-col" aria-hidden="true">
        <span className="self-start rounded-full bg-[#1a1b1f] px-2.5 py-[3px] text-[11px] text-dim">
          {CARD.example}
        </span>
        <p className="mt-4 text-[13px] text-muted md:mt-7 md:text-sm">
          {learning ? CARD.learningLabel : CARD.savedLabel}
        </p>
        <p
          className={`mt-1 text-5xl leading-none font-semibold tracking-[-0.045em] tabular-nums transition-colors duration-300 md:text-6xl ${learning ? "text-dim" : "text-ok"}`}
        >
          {money(Math.max(0, frame.saved))}
        </p>
        <p className="mt-1.5 text-[12.5px] text-dim md:mt-2 md:text-[13px]">
          {CARD.runsBefore} <span className="text-fg tabular-nums">{runs}</span> {CARD.runsAfter}
        </p>

        <div className="mt-auto hidden flex-col gap-3.5 pt-8 md:flex">
          <div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted">{CARD.agent}</span>
              <span className="text-fg tabular-nums">{money(frame.agentSpent)}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-[3px] bg-[#1a1b1f]">
              <span className="block h-full w-full rounded-[3px] bg-[#4a4d55]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted">{CARD.flux}</span>
              <span className="text-amber tabular-nums">{money(frame.fluxSpent)}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-[3px] bg-[#1a1b1f]">
              <span className="block h-full rounded-[3px] bg-amber" style={{ width: `${fluxShare}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-0">
        <SavingsChart frame={frame} />
        <div
          className="mt-3.5 flex justify-between border-t border-[#1d1f23] pt-3 text-[12.5px] text-dim md:hidden"
          aria-hidden="true"
        >
          <span>
            {CARD.agent} <span className="text-fg tabular-nums">{money(frame.agentSpent)}</span>
          </span>
          <span>
            {CARD.flux} <span className="text-amber tabular-nums">{money(frame.fluxSpent)}</span>
          </span>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-dim md:mt-4 md:text-xs">{CARD.assumptions}</p>
      </div>
    </div>
  );
}
