import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { CLOSING_CTA } from "@/content/closing-cta";

/**
 * The closing call to action: a full-width band between amber hairlines on a
 * soft amber gradient. The buttons sit beside the heading from `md` up and
 * stack full width on the phone.
 */
export function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className="border-y border-amber-edge bg-[linear-gradient(110deg,var(--color-amber-wash),var(--color-ink)_45%,var(--color-amber-row)_75%,var(--color-ink))]"
    >
      <Container className="py-14 md:flex md:items-center md:justify-between md:gap-8 md:py-24">
        <div className="min-w-0">
          <h2
            id="closing-cta-title"
            className="text-balance text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-fg"
          >
            {CLOSING_CTA.heading}
          </h2>
          <p className="mt-3 hidden max-w-[560px] text-lg leading-[1.55] text-muted md:block">{CLOSING_CTA.lede}</p>
        </div>
        <div className="mt-5.5 flex flex-col gap-2.5 md:mt-0 md:flex-none md:flex-row md:gap-3">
          {CLOSING_CTA.actions.map((action) => (
            <LinkButton key={action.label} action={action} />
          ))}
        </div>
      </Container>
    </section>
  );
}
