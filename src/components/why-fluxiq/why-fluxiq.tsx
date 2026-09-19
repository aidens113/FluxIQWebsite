import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { WHY } from "@/content/why";
import { WhyCard } from "./why-card";

/** "Why FluxIQ": the section heading, then the reasons as three cards from `md` up. */
export function WhyFluxIQ() {
  const { id, eyebrow, title, lede, cards } = WHY;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <Reveal>
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
      </Reveal>
      <ul className="mt-16 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.title}>
            <Reveal className="h-full">
              <WhyCard card={card} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
