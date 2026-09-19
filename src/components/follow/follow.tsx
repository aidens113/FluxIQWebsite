import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FOLLOW } from "@/content/follow";

/** The closing call to follow the build: a bordered card over a soft gradient glow. */
export function Follow() {
  const { id, eyebrow, title, lede, actions } = FOLLOW;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <Reveal className="relative">
        {/* The glow is painted first, so the card that follows it sits on top without a negative z-index. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl"
        />
        <div className="relative rounded-3xl border border-white/10 bg-ink/75 px-6 py-16 sm:px-12 sm:py-20">
          <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {actions.map((action) => (
              <ActionButton key={action.href} action={action} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
