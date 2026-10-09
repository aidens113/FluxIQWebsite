import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { PARTS } from "@/content/parts";
import { PairingStage } from "./pairing-stage";

/** How the framework and the extension fit together: pair them once, then the jobs run. */
export function Parts() {
  return (
    <PageSection id={PARTS.id} labelledBy="parts-title">
      <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-16">
        <div>
          <p className="mb-4.5 font-mono text-[12.5px] tracking-[0.08em] text-amber uppercase">{PARTS.eyebrow}</p>
          <SectionTitle id="parts-title">
            {PARTS.title.lead} <span className="text-dim">{PARTS.title.muted}</span>
          </SectionTitle>
        </div>
        <p className="max-w-[560px] text-lg leading-[1.55] text-muted md:mb-1">
          <span className="md:hidden">{PARTS.ledeShort}</span>
          <span className="hidden md:inline">{PARTS.lede}</span>
        </p>
      </div>
      <PairingStage />
    </PageSection>
  );
}
