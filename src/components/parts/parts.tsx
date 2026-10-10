import { LinkButton } from "@/components/ui/link-button";
import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { PARTS } from "@/content/parts";
import { LoopStage } from "./loop-stage";

/** How the framework and the extension fit together: pair them once, then the jobs run. */
export function Parts() {
  return (
    <PageSection id={PARTS.id} labelledBy="parts-title">
      <div className="grid gap-3.5 md:grid-cols-2 md:items-end md:gap-16">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.08em] text-amber uppercase">{PARTS.eyebrow}</p>
          <SectionTitle id="parts-title">
            {PARTS.title.lead} <span className="text-dim">{PARTS.title.muted}</span>
          </SectionTitle>
        </div>
        <p className="max-w-[420px] text-[15.5px] leading-[1.55] text-muted md:mb-1 md:text-lg">{PARTS.lede}</p>
      </div>
      <LoopStage />
      <div className="mt-4 flex flex-col gap-2.5 *:justify-center md:mt-6 md:flex-row md:justify-between">
        <LinkButton action={{ ...PARTS.framework.link, variant: "ghost" }} />
        <LinkButton action={{ ...PARTS.extension.link, variant: "ghost" }} />
      </div>
    </PageSection>
  );
}
