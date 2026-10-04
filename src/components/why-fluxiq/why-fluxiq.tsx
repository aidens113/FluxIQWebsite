import { PageSection } from "@/components/ui/page-section";
import { PointGrid } from "@/components/ui/point-grid";
import { SectionTitle } from "@/components/ui/section-title";
import { WHY } from "@/content/why";

/** Scripts versus agents versus FluxIQ, then the four reasons it costs less. */
export function WhyFluxIQ() {
  const lines = WHY.titleLines;
  return (
    <PageSection id={WHY.id} labelledBy="why-title">
      <SectionTitle id="why-title" className="max-w-[900px]">
        {lines.map((line, index) =>
          index === lines.length - 1 ? (
            <span key={line} className="block text-dim">
              {line}
            </span>
          ) : (
            <span key={line} className="block">
              {line}
            </span>
          ),
        )}
      </SectionTitle>
      <PointGrid points={WHY.points} className="mt-16" />
    </PageSection>
  );
}
