"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { PartTitle } from "../part-title";
import { carouselJobs } from "./frame";
import { JobCard } from "./job-card";

/**
 * Part 1: three sentences, each now a Flow that keeps running, shown one at a
 * time in a single card that crossfades to the next, with pips beneath. On the
 * shared 50 ms clock, which does not restart when the card scrolls back into
 * view, so run counts only ever climb.
 */
export function RunningJobs() {
  const { ref, tick } = useLoopClock<HTMLDivElement>(50, false, false);
  const { num, title, description, labels, list } = HOW_IT_WORKS.jobs;
  const { views, active } = carouselJobs(tick, list);
  return (
    <div ref={ref} className="mt-7 md:mt-[72px]">
      <PartTitle num={num} title={title} />
      <p className="sr-only">{description}</p>
      <div aria-hidden="true">
        <div className="grid">
          {list.map((job, i) => (
            <JobCard
              key={job.name}
              job={job}
              view={views[i] as (typeof views)[number]}
              labels={labels}
              className={`[grid-area:1/1] ${i === active ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`}
            />
          ))}
        </div>
        <div className="mt-3.5 flex justify-center gap-2">
          {list.map((job, i) => (
            <span
              key={job.name}
              className={`block h-1.5 rounded-[3px] transition-[width,background-color] duration-400 ${i === active ? "w-[22px] bg-amber" : "w-1.5 bg-[#33363c]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
