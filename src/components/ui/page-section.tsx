import type { ReactNode } from "react";
import { Container } from "./container";
import { Reveal } from "./reveal";

export type PageSectionProps = {
  /** The in-page anchor, if the section has one. */
  id?: string;
  /** The id of the section's heading, which names the section for assistive tech. */
  labelledBy: string;
  /** Layout for the inner column, such as flex or grid. */
  className?: string;
  children: ReactNode;
};

/**
 * A full-width band under a hairline rule, with the content column inside it.
 * It is a snap point whose negative margin skips the top padding, so a snap or
 * an anchor lands on the heading rather than on empty space.
 */
export function PageSection({ id, labelledBy, className, children }: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className="snap-start border-t border-line -scroll-mt-20 md:-scroll-mt-26"
    >
      <Container className="py-20 md:py-26">
        <Reveal className={className}>{children}</Reveal>
      </Container>
    </section>
  );
}
