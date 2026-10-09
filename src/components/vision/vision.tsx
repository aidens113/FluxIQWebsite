import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { VISION } from "@/content/vision";
import { RoadmapTimeline } from "./roadmap-timeline";
import { VisionDemo } from "./vision-demo";

/**
 * Where FluxIQ is going: ask for an outcome and get the whole app. The chat
 * and the concept app in use sit beside the roadmap from `lg` up; below it
 * they stack, with the roadmap under the app.
 */
export function Vision() {
  return (
    <PageSection
      id={VISION.id}
      labelledBy="vision-title"
      className="grid gap-y-7 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-x-14 lg:gap-y-10"
    >
      <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
        <p className="mb-4 font-mono text-xs text-amber uppercase">{VISION.eyebrow}</p>
        <SectionTitle id="vision-title">
          {VISION.title.lead} <span className="text-dim">{VISION.title.muted}</span>
        </SectionTitle>
        <p className="mt-5 text-[15.5px] leading-relaxed text-muted md:hidden">{VISION.ledeShort}</p>
        <p className="mt-5 max-w-[560px] text-[18px] leading-[1.55] text-muted max-md:hidden">{VISION.lede}</p>
      </div>
      <VisionDemo className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />
      <RoadmapTimeline stages={VISION.roadmap} className="lg:col-start-1 lg:row-start-2 lg:self-start" />
    </PageSection>
  );
}
