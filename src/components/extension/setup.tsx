import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { EXTENSION } from "@/content/extension";

/** How the extension pairs with FluxIQ, in four steps. */
export function ExtensionSetup() {
  const { setup } = EXTENSION;
  return (
    <PageSection
      id={setup.id}
      labelledBy="setup-title"
      className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
    >
      <div>
        <SectionTitle id="setup-title">{setup.title}</SectionTitle>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{setup.lede}</p>
      </div>
      <ol className="border-b border-line">
        {setup.steps.map((step, index) => (
          <li key={step} className="flex gap-5 border-t border-line py-4.5 leading-relaxed">
            <span className="w-7 shrink-0 font-mono text-amber">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
