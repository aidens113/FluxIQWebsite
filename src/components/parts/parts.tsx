import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { PARTS } from "@/content/parts";
import { PartCard } from "./part-card";

/** The framework and the extension, side by side. */
export function Parts() {
  return (
    <PageSection id={PARTS.id} labelledBy="parts-title">
      <SectionTitle id="parts-title">{PARTS.title}</SectionTitle>
      <p className="mt-3.5 max-w-[600px] text-[17px] leading-relaxed text-muted">{PARTS.lede}</p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {PARTS.parts.map((part) => (
          <PartCard key={part.title} part={part} />
        ))}
      </div>
    </PageSection>
  );
}
