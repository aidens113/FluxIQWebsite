import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { VISION } from "@/content/vision";
import { PipelineConcept } from "./pipeline-concept";
import { RoadmapList } from "./roadmap-list";

/** Where FluxIQ is going: from Flows to generated applications, with the roadmap and a labelled concept. */
export function Vision() {
  return (
    <PageSection
      id={VISION.id}
      labelledBy="vision-title"
      className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
    >
      <div className="min-w-0">
        <p className="mb-4 font-mono text-xs text-amber uppercase">{VISION.eyebrow}</p>
        <SectionTitle id="vision-title">{VISION.title}</SectionTitle>
        {VISION.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-[17px] leading-relaxed text-muted first-of-type:mt-5">
            {paragraph}
          </p>
        ))}
        <RoadmapList stages={VISION.roadmap} />
      </div>
      <PipelineConcept concept={VISION.concept} />
    </PageSection>
  );
}
