import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { LINKS } from "@/content/links";
import { SITE } from "@/content/site";

const FOOTER_LINKS = [
  LINKS.home,
  LINKS.extensionPage,
  { ...LINKS.paper, label: "Vision paper" },
  LINKS.coreRepo,
  LINKS.x,
  LINKS.licenseEmail,
] as const;

/** The closing bar: the copyright, then small text links. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-wrap justify-between gap-4 py-12 text-sm text-dim">
        <p>{SITE.copyright}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <TextLink link={link} className="text-muted" />
            </li>
          ))}
          <li>
            <CookieSettingsButton />
          </li>
        </ul>
      </Container>
    </footer>
  );
}
