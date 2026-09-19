import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROADMAP } from "@/content/roadmap";
import { RoadmapColumnCard } from "./roadmap-column-card";

/** Where each piece of FluxIQ stands today: Shipped, In progress, and Planned columns. */
export function Roadmap() {
  const { id, eyebrow, title, lede, columns } = ROADMAP;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {columns.map((column) => (
          <Reveal key={column.status}>
            <RoadmapColumnCard column={column} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
