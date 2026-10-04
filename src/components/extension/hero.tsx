import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { EXTENSION } from "@/content/extension";
import { SidePanelSketch } from "./side-panel-sketch";

/** The extension page's opening: the pitch and a sketch of the side panel. */
export function ExtensionHero() {
  return (
    <section aria-labelledby="extension-title">
      <Container className="flex flex-wrap items-center gap-14 pt-16 pb-24 md:pt-22">
        <div className="min-w-0 flex-[1_1_480px]">
          <p className="mb-5 font-mono text-xs text-amber uppercase">{EXTENSION.kicker}</p>
          <h1
            id="extension-title"
            className="text-[clamp(2.5rem,5.4vw,4.25rem)] text-balance leading-[1.02] font-semibold tracking-[-0.04em]"
          >
            {EXTENSION.title.lead}
            <br />
            <span className="text-dim">{EXTENSION.title.muted}</span>
          </h1>
          <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-muted">{EXTENSION.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {EXTENSION.actions.map((action) => (
              <LinkButton key={action.href} action={action} />
            ))}
          </div>
        </div>
        <SidePanelSketch />
      </Container>
    </section>
  );
}
