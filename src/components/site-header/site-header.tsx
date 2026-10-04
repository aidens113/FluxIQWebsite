import { Container } from "@/components/ui/container";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import { LINKS } from "@/content/links";
import type { NavItem } from "@/content/types";
import { HomeLink } from "./home-link";
import { PrimaryNav } from "./primary-nav";

export type SiteHeaderProps = {
  nav: readonly NavItem[];
  /** A page name shown after the wordmark. */
  section?: string;
};

/** The sticky top bar: home link, page links, and GitHub. */
export function SiteHeader({ nav, section }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 pt-3 md:min-h-18 md:pt-0">
        <HomeLink section={section} />
        <PrimaryNav items={nav} />
        <a
          href={LINKS.coreRepo.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-11 items-center rounded-sm text-sm text-fg transition-colors hover:text-amber ${FOCUS_RING}`}
        >
          {LINKS.coreRepo.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Container>
    </header>
  );
}
