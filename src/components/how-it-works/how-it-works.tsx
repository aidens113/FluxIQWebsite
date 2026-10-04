import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { StepCard } from "./step-card";

/** The four steps from instruction to a Flow that repairs itself. */
export function HowItWorks() {
  return (
    <PageSection id={HOW_IT_WORKS.id} labelledBy="how-title">
      <SectionTitle id="how-title">{HOW_IT_WORKS.title}</SectionTitle>
      <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.steps.map((step) => (
          <StepCard key={step.label} step={step} />
        ))}
      </ol>
    </PageSection>
  );
}
