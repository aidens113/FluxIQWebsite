import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FEATURES } from "@/content/features";
import { FeatureGroup } from "./feature-group";

/** What ships today, grouped by repository: FluxIQ Core, then the Web Extension. */
export function Features() {
  const { id, eyebrow, title, lede, groups } = FEATURES;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <Reveal>
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
      </Reveal>
      <div className="mt-16 space-y-20">
        {groups.map((group) => (
          <FeatureGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
