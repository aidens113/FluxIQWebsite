import { GitHubLogo } from "@/components/ui/github-logo";
import { LINKS } from "@/content/links";
import { HomeLink } from "./home-link";
import { PrimaryNav } from "./primary-nav";

/**
 * The sticky top bar: home link on the left, section anchors in the centre
 * from `md` up, and an icon-only GitHub link on the right. The three-column
 * grid keeps the nav centred however wide the two ends are.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <HomeLink />
        <PrimaryNav />
        <a
          href={LINKS.coreRepo.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${LINKS.coreRepo.label} (opens in a new tab)`}
          className="inline-flex size-10 items-center justify-center justify-self-end rounded-full text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          <GitHubLogo className="size-5" />
        </a>
      </div>
    </header>
  );
}
