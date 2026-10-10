"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { tracksFrame } from "./model";
import "./motion.css";
import { TallTracks } from "./tall-tracks";
import { WideTracks } from "./wide-tracks";

/**
 * How it works in one graphic: the sentence becomes a Flow, then eight
 * mornings run along two tracks, FluxIQ and a recorded script, through an
 * overnight redesign. The story starts over each time it scrolls into view.
 */
export function RedesignTracks() {
  const { ref, tick } = useLoopClock<HTMLDivElement>();
  const { ask, flow, rows, description } = HOW_IT_WORKS;
  const frame = tracksFrame(tick, rows);
  return (
    <div
      ref={ref}
      className="mt-8 overflow-hidden rounded-[18px] border border-rule bg-panel md:mt-14 lg:rounded-[20px]"
    >
      <p className="sr-only">{description}</p>
      <div aria-hidden="true">
        <div className="border-b border-[#1d1f23] px-4 pt-4 pb-3.5 lg:flex lg:items-center lg:gap-[18px] lg:px-7 lg:py-[22px]">
          <span className="font-mono text-[11px] tracking-[0.06em] text-dim uppercase">{ask.label}</span>
          <p className="mt-1.5 text-[15.5px] leading-[1.4] font-medium text-fg lg:mt-0 lg:text-lg lg:tracking-[-0.01em]">
            “{ask.text}”
          </p>
          <svg
            width="34"
            height="12"
            viewBox="0 0 34 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden flex-none text-amber-edge lg:block"
            aria-hidden="true"
          >
            <path d="M1 6h30M26 1l5 5-5 5" />
          </svg>
          <span className="mt-2.5 inline-flex items-center gap-[7px] rounded-full border border-amber-edge bg-[#1a1810] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-fg lg:mt-0 lg:gap-2 lg:px-3 lg:py-1.5 lg:text-[13px]">
            <span className="font-mono text-[10px] text-amber lg:text-[10.5px]">{flow.label.toUpperCase()}</span>
            {flow.name}
            <span className="text-dim lg:hidden">{flow.schedule.short}</span>
            <span className="hidden text-dim lg:inline">{flow.schedule.full}</span>
          </span>
        </div>
        <div className="mx-auto max-w-[460px] xl:hidden">
          <TallTracks frame={frame} />
        </div>
        <div className="hidden xl:block">
          <WideTracks frame={frame} />
        </div>
      </div>
    </div>
  );
}
