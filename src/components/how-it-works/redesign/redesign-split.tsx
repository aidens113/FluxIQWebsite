"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { FitText } from "../fit-text";
import { PartTitle } from "../part-title";
import { redesignFrame } from "./frame";
import "./motion.css";
import { OutcomeCard } from "./outcome-card";
import { SiteSketch } from "./site-sketch";

/**
 * Part 2: the same overnight redesign hits an ordinary recorded script and
 * FluxIQ, on the shared 50 ms clock. The story starts over on Tuesday each
 * time it scrolls into view. The two sides stack on a phone and sit side by
 * side from `md` up.
 */
export function RedesignSplit() {
  const { ref, tick } = useLoopClock<HTMLDivElement>();
  const { split } = HOW_IT_WORKS;
  const frame = redesignFrame(tick);
  const day = frame.after ? split.days.after : split.days.before;
  return (
    <div ref={ref} className="mt-14 md:mt-24">
      <PartTitle num={split.num} title={split.title} />
      <p className="sr-only">{split.description}</p>
      <div aria-hidden="true">
        <div className="flex items-center gap-3.5 rounded-[18px] border border-rule bg-panel p-3.5 md:gap-7 md:px-6 md:py-5">
          <SiteSketch site={split.site} search={split.search} changed={frame.changed} scanning={frame.scanning} />
          <div className="min-w-0">
            <span
              className={`relative inline-flex items-center rounded-full border px-[9px] py-[3px] text-[11px] font-medium whitespace-nowrap transition-colors duration-300 md:px-[11px] md:py-1 md:text-xs ${frame.changed ? "border-amber-edge bg-[#1a1810] text-amber" : "border-edge bg-[#16171a] text-dim"}`}
            >
              {frame.ping && <span className="absolute -inset-px animate-ping rounded-full border border-amber/60" />}
              <FitText phrase={frame.changed ? split.chip.after : split.chip.before} />
            </span>
            <p className="mt-2 text-[13px] leading-[1.45] text-muted md:hidden">
              {split.storyShort} <span className="font-medium text-fg">{day}</span>
            </p>
            <p className="mt-3 hidden max-w-[560px] text-base leading-normal text-soft md:block">{split.story}</p>
          </div>
          <div className="ml-auto hidden flex-none text-right md:block">
            <p className="font-mono text-[11px] tracking-[0.06em] text-dim uppercase">{split.morningRun}</p>
            <p className="mt-2 text-2xl leading-none font-semibold tracking-[-0.03em] text-fg">{day}</p>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:mt-[18px] md:grid-cols-2 md:gap-[18px]">
          <OutcomeCard
            name={split.script.name}
            quiet
            steps={split.script.steps}
            frame={frame.script}
            split={split}
            day={day}
          />
          <OutcomeCard name={split.flux.name} steps={split.flux.steps} frame={frame.flux} split={split} day={day} />
        </div>
      </div>
    </div>
  );
}
