import { LinkButton } from "@/components/ui/link-button";
import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { PAPER } from "@/content/paper";
import { PaperCard } from "./paper-card";

/** The Technical Vision & Architecture paper: its pages turning with its contents, and the download. */
export function Paper() {
  return (
    <PageSection id={PAPER.id} labelledBy="paper-title">
      <PaperCard
        intro={
          <>
            <p className="mb-3.5 font-mono text-xs tracking-[0.08em] text-amber uppercase md:mb-4.5">{PAPER.eyebrow}</p>
            <SectionTitle id="paper-title">
              {PAPER.heading.lead} <span className="text-dim">{PAPER.heading.muted}</span>
            </SectionTitle>
          </>
        }
        actions={
          <div className="mt-5.5 flex flex-col gap-2.5 md:mt-8 md:flex-row md:items-center md:gap-4.5">
            <LinkButton action={{ ...PAPER.link, variant: "primary" }} />
            <span className="text-center font-mono text-[11.5px] text-dim">{PAPER.format}</span>
          </div>
        }
      />
    </PageSection>
  );
}
