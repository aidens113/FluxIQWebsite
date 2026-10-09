"use client";

import type { ReactNode } from "react";
import { useLoopClock } from "@/components/ui/use-loop-clock";
import { PAPER } from "@/content/paper";
import { ContentsList } from "./contents-list";
import { PageStack } from "./page-stack";

export type PaperCardProps = {
  /** The eyebrow and heading, rendered on the server. */
  intro: ReactNode;
  /** The download button and format line. */
  actions: ReactNode;
};

// The cover, then one page per section: each stays up for 12 ticks of 250 ms.
const TICK_MS = 250;
const TICKS_PER_PAGE = 12;
const PAGES = PAPER.sections.length + 1;

/**
 * The paper's card. The cover and six real pages crossfade every 3 s while
 * the card is on screen; the contents item for the current page lights up
 * (on the phone, its section line shows under the page instead).
 */
export function PaperCard({ intro, actions }: PaperCardProps) {
  const { ref, tick } = useLoopClock<HTMLDivElement>(TICK_MS);
  const index = Math.floor(tick / TICKS_PER_PAGE) % PAGES;
  const section = index === 0 ? undefined : PAPER.sections[index - 1];
  const label = section ? `page ${section.page} of ${PAPER.pageCount}` : PAPER.coverLabel;

  return (
    <div
      ref={ref}
      className="grid gap-0 rounded-[18px] border border-rule bg-[linear-gradient(160deg,var(--color-amber-wash),var(--color-panel)_60%)] px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-center md:gap-10 md:bg-[linear-gradient(135deg,var(--color-amber-wash),var(--color-panel)_60%)] md:p-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-14 lg:px-14 lg:py-12"
    >
      <div>
        <PageStack index={index} />
        <p className="mt-2.5 min-h-[21px] text-center text-sm text-fg md:hidden">
          {section ? (
            <>
              <span className="mr-2 font-mono text-amber">{section.num}</span>
              {section.title}
            </>
          ) : (
            PAPER.title
          )}
        </p>
        <p className="mt-1 text-center font-mono text-[11.5px] text-dim md:mt-2.5">{label}</p>
      </div>
      <div className="mt-4.5 min-w-0 md:mt-0">
        {intro}
        <ContentsList current={index - 1} />
        {actions}
      </div>
    </div>
  );
}
