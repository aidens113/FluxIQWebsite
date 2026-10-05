import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { HERO } from "@/content/hero";
import { PaperBanner } from "./paper-banner";
import { RunHistory } from "./run-history";

/** The opening: the paper announcement, the headline, the lede, two actions, then the example run history. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container className="pt-12 pb-14 md:pt-20 md:pb-16">
        <PaperBanner />
        <h1
          id="hero-title"
          className="max-w-[1060px] text-[clamp(2.5rem,6vw,4.875rem)] text-balance leading-[1.02] font-semibold tracking-[-0.04em]"
        >
          {HERO.title.lead}
          <br />
          <span className="text-dim">{HERO.title.muted}</span>
        </h1>
        <p className="mt-7 max-w-[620px] text-lg leading-relaxed text-muted md:text-[19px]">{HERO.lede}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          {HERO.actions.map((action) => (
            <LinkButton key={action.href} action={action} />
          ))}
        </div>
      </Container>
      <Container className="pb-24 md:pb-28">
        <RunHistory />
      </Container>
    </section>
  );
}
