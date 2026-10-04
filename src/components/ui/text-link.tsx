import type { ReactNode } from "react";
import type { SiteLink } from "@/content/types";
import { FOCUS_RING } from "./focus-ring";

export type TextLinkProps = {
  link: SiteLink;
  /** Colour and weight; the hover colour and focus ring are shared. */
  className?: string;
  /** Drawn after the label, such as an arrow. Hidden from screen readers. */
  trailing?: ReactNode;
};

/** An inline text link. External links open a new tab and say so to screen readers. */
export function TextLink({ link, className = "text-fg", trailing }: TextLinkProps) {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className={`rounded-sm underline-offset-4 transition-colors hover:text-amber hover:underline ${FOCUS_RING} ${className}`}
    >
      {link.label}
      {trailing ? <span aria-hidden="true">{trailing}</span> : null}
      {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
