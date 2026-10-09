"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { PartTitle } from "../part-title";
import { jobView } from "./frame";
import { JobCard } from "./job-card";

/**
 * Part 1: one sentence, now a Flow that keeps running, on the shared 50 ms
 * clock. The clock does not restart when the card scrolls back into view, so
 * its run count only ever climbs. Part 2 follows the same job.
 */
export function RunningJobs() {
  const { ref, tick } = useLoopClock<HTMLDivElement>(50, false, false);
  const { num, title, description, labels, job } = HOW_IT_WORKS.jobs;
  return (
    <div ref={ref} className="mt-7 md:mt-[72px]">
      <PartTitle num={num} title={title} />
      <p className="sr-only">{description}</p>
      <div aria-hidden="true">
        <JobCard job={job} view={jobView(tick, job)} labels={labels} />
      </div>
    </div>
  );
}
