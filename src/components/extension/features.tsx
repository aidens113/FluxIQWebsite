import { PageSection } from "@/components/ui/page-section";
import { PointGrid } from "@/components/ui/point-grid";
import { SectionTitle } from "@/components/ui/section-title";
import { EXTENSION } from "@/content/extension";

/** The four things the extension does. */
export function ExtensionFeatures() {
  const { features } = EXTENSION;
  return (
    <PageSection id={features.id} labelledBy="features-title">
      <SectionTitle id="features-title">{features.title}</SectionTitle>
      <PointGrid points={features.points} className="mt-12" />
    </PageSection>
  );
}
