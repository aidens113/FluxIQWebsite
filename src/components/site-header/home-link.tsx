import { FOCUS_RING } from "@/components/ui/focus-ring";
import { LogoMark } from "@/components/ui/logo-mark";
import { LINKS } from "@/content/links";
import { SITE } from "@/content/site";

export type HomeLinkProps = {
  /** A page name shown after the wordmark, such as "Extension". */
  section?: string;
};

/** The mark and wordmark, linking home. */
export function HomeLink({ section }: HomeLinkProps) {
  return (
    <a
      href={LINKS.home.href}
      className={`flex items-center gap-2.5 rounded-sm whitespace-nowrap text-[17px] font-semibold tracking-[-0.01em] text-fg ${FOCUS_RING}`}
    >
      <LogoMark className="size-6.5" />
      {SITE.name}
      {section ? <span className="font-medium text-dim">/ {section}</span> : null}
    </a>
  );
}
