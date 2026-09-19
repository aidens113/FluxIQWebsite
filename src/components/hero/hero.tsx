import Image from "next/image";
import { ActionButton } from "@/components/ui/action-button";
import { HERO } from "@/content/hero";
import { SITE } from "@/content/site";
import { CornerLabels } from "./corner-labels";
import { Glows } from "./glows";
import { ScrollCue } from "./scroll-cue";
import { StatusPill } from "./status-pill";
import { Waves } from "./waves";

const TITLE_ID = "hero-title";

/**
 * The first screen: logo, the h1 wordmark, tagline, status pill, lede, and
 * calls to action, over a decoration layer of glows, waves, and corner labels.
 * The section clips only horizontally, so the glows fade into the next section
 * instead of ending on a hard edge.
 */
export function Hero() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className="relative isolate flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-x-clip px-6 py-24 text-center md:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Glows />
        <Waves />
        <CornerLabels labels={HERO.cornerLabels} />
      </div>

      <Image
        src="/brand/fluxiq-logo.webp"
        alt=""
        width={144}
        height={144}
        preload
        className="size-36 rounded-full shadow-[0_0_80px_rgba(59,130,246,0.45)] ring-1 ring-white/10"
      />
      <h1
        id={TITLE_ID}
        className="mt-8 font-display text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
      >
        {SITE.wordmark.lead}
        <span className="bg-linear-to-r from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {SITE.wordmark.accent}
        </span>
      </h1>
      {/* The left padding balances the trailing letter-spacing, so the tagline sits centred. */}
      <p className="mt-4 pl-[0.5em] text-xs font-medium tracking-[0.5em] text-slate-400 uppercase sm:text-sm">
        {SITE.tagline}
      </p>
      <StatusPill label={SITE.status} className="mt-8" />
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{HERO.lede}</p>
      <ul className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        {HERO.actions.map((action) => (
          <li key={action.href}>
            <ActionButton action={action} className="w-full sm:w-auto" />
          </li>
        ))}
      </ul>
      <ScrollCue />
    </section>
  );
}
