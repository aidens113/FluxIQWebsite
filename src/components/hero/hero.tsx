import { HeroDemo } from "@/components/hero-demo/hero-demo";
import { LinkButton } from "@/components/ui/link-button";
import { HERO } from "@/content/hero";
import { PaperBanner } from "./paper-banner";

/**
 * The opening: the paper announcement, the headline, the lede, and two
 * actions, beside the animated example widgets on wide screens and above
 * them otherwise. Stacked, the copy is centred over the widget (a phone keeps
 * it left-aligned). The hero is wider than the content column so the widget
 * fits beside the copy.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="mx-auto grid w-full max-w-[1288px] grid-cols-[minmax(0,1fr)] items-center gap-12 px-6 pt-12 pb-20 md:pt-16 xl:grid-cols-[minmax(0,1fr)_760px] xl:gap-14 xl:pt-20 xl:pb-28">
        <div className="min-w-0 sm:text-center xl:text-left">
          <PaperBanner />
          <h1
            id="hero-title"
            className="text-[clamp(2.5rem,6vw,4.25rem)] text-balance leading-[1.02] font-semibold tracking-[-0.04em] xl:text-[clamp(2.75rem,4.4vw,4rem)]"
          >
            {HERO.title.lead} <span className="text-dim">{HERO.title.muted}</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-muted sm:mx-auto md:text-[19px] xl:mx-0 xl:text-lg">
            {HERO.lede}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center xl:justify-start">
            {HERO.actions.map((action) => (
              <LinkButton key={action.href} action={action} />
            ))}
          </div>
        </div>
        <HeroDemo />
      </div>
    </section>
  );
}
