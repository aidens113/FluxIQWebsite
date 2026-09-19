import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEVELOPERS } from "@/content/developers";
import { CodeWindow } from "./code-window";
import { PackageList } from "./package-list";
import { ReleaseChips } from "./release-chips";

/** The developer view: release status, the two TypeScript samples, the packages, and the build from source. */
export function Developers() {
  const { id, eyebrow, title, lede, release, requirements, samples, packages, build, action } = DEVELOPERS;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <Reveal>
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
        <ReleaseChips release={release} requirements={requirements} />
      </Reveal>
      {/* A grid item's default min-width is its min-content, which for a code
          window is its longest line. `grid-cols-1` (minmax(0, 1fr)) and
          `min-w-0` on each item keep the column at the container's width, so
          the <pre> scrolls inside its window instead of widening the column. */}
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
        {samples.map((sample) => (
          <Reveal key={sample.id} className="min-w-0">
            <CodeWindow sample={sample} />
          </Reveal>
        ))}
      </div>
      <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-6">
        <Reveal className="min-w-0">
          <PackageList packages={packages} />
        </Reveal>
        <Reveal className="min-w-0">
          <CodeWindow sample={build} compact />
        </Reveal>
      </div>
      <Reveal className="mt-14 flex justify-center">
        <ActionButton action={action} />
      </Reveal>
    </section>
  );
}
