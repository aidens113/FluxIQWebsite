import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { TimelineStep } from "./timeline-step";

/**
 * "How it works": the live site's vertical timeline. A gradient rail runs down
 * the left edge through each step's dot; the rail sits outside the `ol`, since a
 * list may only hold list items.
 */
export function HowItWorks() {
  const { id, eyebrow, title, lede, steps } = HOW_IT_WORKS;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <Reveal>
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
      </Reveal>
      <div className="relative mx-auto mt-16 max-w-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 bottom-0 left-3 w-px -translate-x-1/2 bg-linear-to-b from-cyan-400/60 via-purple-500/50 to-fuchsia-500/40"
        />
        <ol className="relative space-y-6 sm:space-y-8">
          {steps.map((step, index) => (
            <TimelineStep key={step.title} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
