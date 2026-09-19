import { Mail } from "lucide-react";
import { GitHubLogo } from "@/components/ui/github-logo";
import { Reveal } from "@/components/ui/reveal";
import { XLogo } from "@/components/ui/x-logo";
import { LINKS } from "@/content/links";
import { SITE } from "@/content/site";
import { FooterLink } from "./footer-link";

/** The closing bar: the copyright, then small GitHub, X, and license-email links. */
export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-slate-400">{SITE.copyright}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <li>
            <FooterLink link={LINKS.coreRepo} icon={<GitHubLogo className="size-4" />} />
          </li>
          <li>
            <FooterLink link={LINKS.x} icon={<XLogo className="size-4" />} />
          </li>
          <li>
            <FooterLink
              link={LINKS.licenseEmail}
              icon={<Mail className="size-4" strokeWidth={2} aria-hidden="true" />}
            />
          </li>
        </ul>
      </Reveal>
    </footer>
  );
}
