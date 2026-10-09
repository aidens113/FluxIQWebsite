import { Container } from "@/components/ui/container";
import type { LegalDocument } from "@/content/types";
import { LegalProse } from "./legal-prose";

/** A legal document, the privacy notice or the terms of use, as a readable page. */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <Container className="py-16 md:py-24">
      <article aria-labelledby="legal-title" className="max-w-[720px]">
        <h1 id="legal-title" className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          {doc.title}
        </h1>
        <p className="mt-3 font-mono text-[13px] text-dim">Last updated {doc.updated}</p>
        <p className="mt-8 text-[17px] leading-relaxed text-soft">{doc.intro}</p>
        {doc.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-semibold tracking-[-0.01em]">{section.heading}</h2>
            {section.blocks.map((block, i) =>
              "items" in block ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: blocks are static and never reorder
                <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 text-[15.5px] leading-relaxed text-muted">
                  {block.items.map((item, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: items are static and never reorder
                    <li key={j}>
                      <LegalProse runs={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: blocks are static and never reorder
                <p key={i} className="mt-3 text-[15.5px] leading-relaxed text-muted">
                  <LegalProse runs={block.paragraph} />
                </p>
              ),
            )}
          </section>
        ))}
      </article>
    </Container>
  );
}
