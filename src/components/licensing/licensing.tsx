import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { LICENSING } from "@/content/licensing";
import { LicenseListCard } from "./license-list-card";

/** The license summary: what is free, what needs a signed agreement, and links to the governing text. */
export function Licensing() {
  const { id, eyebrow, title, lede, freeFor, needsAgreement, disclaimer, actions } = LICENSING;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-24"
    >
      <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lede={lede} />
      <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
        <Reveal>
          <LicenseListCard list={freeFor} accent="cyan" />
        </Reveal>
        <Reveal>
          <LicenseListCard list={needsAgreement} accent="purple" />
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-10 max-w-4xl text-center">
        <p className="text-sm text-slate-400">{disclaimer}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {actions.map((action) => (
            <ActionButton key={action.href} action={action} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
