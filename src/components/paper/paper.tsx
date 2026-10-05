import { FOCUS_RING } from "@/components/ui/focus-ring";
import { LinkButton } from "@/components/ui/link-button";
import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { PAPER } from "@/content/paper";

/** The Technical Vision & Architecture paper: its cover, what it covers, and the download. */
export function Paper() {
  return (
    <PageSection
      id={PAPER.id}
      labelledBy="paper-title"
      className="grid items-center gap-12 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-16"
    >
      <a
        href={PAPER.link.href}
        className={`group mx-auto block w-full max-w-[220px] rounded-lg md:max-w-[280px] ${FOCUS_RING}`}
        aria-label={`${PAPER.title}, ${PAPER.format}`}
      >
        {/* biome-ignore lint/performance/noImgElement: a static export with unoptimized images gains nothing from next/image but its client JavaScript. */}
        <img
          src={PAPER.cover.src}
          width={PAPER.cover.width}
          height={PAPER.cover.height}
          alt={PAPER.cover.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-lg border border-edge shadow-[0_24px_60px_-20px_rgba(245,184,61,0.25)] transition-transform group-hover:-translate-y-1 motion-reduce:transition-none"
        />
      </a>
      <div className="min-w-0">
        <p className="mb-4 font-mono text-xs text-amber uppercase">{PAPER.eyebrow}</p>
        <SectionTitle id="paper-title">{PAPER.heading}</SectionTitle>
        <p className="mt-3 font-mono text-[13px] text-dim">
          {PAPER.title} · {PAPER.edition}
        </p>
        <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-muted">{PAPER.summary}</p>
        <ul className="mt-7 grid max-w-[720px] border-b border-line text-[15px] sm:grid-cols-2 sm:gap-x-8">
          {PAPER.contents.map((item) => (
            <li key={item} className="border-t border-line py-2.5 text-soft">
              {item}
            </li>
          ))}
        </ul>
        <blockquote className="mt-7 border-l-2 border-amber pl-4 text-lg font-medium">{PAPER.quote}</blockquote>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <LinkButton action={{ ...PAPER.link, variant: "primary" }} />
          <span className="font-mono text-xs text-dim">{PAPER.format}</span>
        </div>
      </div>
    </PageSection>
  );
}
