import type { ReactNode } from "react";
import type { SiteLink } from "@/content/types";

export type FooterLinkProps = {
  link: SiteLink;
  /** A decorative icon drawn before the label. */
  icon: ReactNode;
};

/** A small text link with an icon. External links open a new tab and say so to screen readers. */
export function FooterLink({ link, icon }: FooterLinkProps) {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-full text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
    >
      {icon}
      {link.label}
      {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
