import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { FlowStory } from "./flow-story";

/** How it works: one real job, from asking for it to the fix that keeps it running. */
export function HowItWorks() {
  const { lead, muted } = HOW_IT_WORKS.title;
  return (
    <PageSection id={HOW_IT_WORKS.id} labelledBy="how-title">
      <div className="grid gap-x-16 md:grid-cols-2 md:items-end">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.08em] text-amber uppercase">{HOW_IT_WORKS.eyebrow}</p>
          <SectionTitle id="how-title">
            {lead} <span className="text-dim">{muted}</span>
          </SectionTitle>
        </div>
        <p className="mt-3.5 text-[15.5px] leading-[1.55] text-muted md:mt-0 md:mb-1 md:text-lg">
          <span className="md:hidden">{HOW_IT_WORKS.ledeShort}</span>
          <span className="hidden md:inline">{HOW_IT_WORKS.lede}</span>
        </p>
      </div>
      <FlowStory />
    </PageSection>
  );
}
