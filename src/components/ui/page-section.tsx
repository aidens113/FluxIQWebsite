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

/** A full-width band under a hairline rule, with the content column inside it. */
export function PageSection({ id, labelledBy, className, children }: PageSectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="border-t border-line">
      <Container className="py-20 md:py-26">
        <Reveal className={className}>{children}</Reveal>
      </Container>
    </section>
  );
}
