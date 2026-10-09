import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { WHY } from "@/content/why";
import { SavingsCard } from "./savings/card";
import { ValuePoints } from "./value-points";

/** What it saves you: the savings card, then the four reasons it costs less. */
export function WhyFluxIQ() {
  return (
    <PageSection id={WHY.id} labelledBy="why-title">
      <div className="grid gap-x-16 md:grid-cols-2 md:items-end">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.08em] text-amber uppercase">{WHY.eyebrow}</p>
          <SectionTitle id="why-title">
            {WHY.title} <span className="text-dim">{WHY.titleMuted}</span>
          </SectionTitle>
        </div>
        <p className="mt-3.5 text-[15.5px] leading-[1.55] text-muted md:hidden">{WHY.ledeShort}</p>
        <p className="mt-5 hidden max-w-[560px] text-lg leading-[1.55] text-muted md:mt-0 md:mb-1 md:block">
          {WHY.lede}
        </p>
      </div>
      <SavingsCard />
      <ValuePoints />
    </PageSection>
  );
}
