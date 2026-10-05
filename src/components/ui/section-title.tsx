import type { ReactNode } from "react";

export type SectionTitleProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

/** A section's h2, in the site's one heading style. */
export function SectionTitle({ id, className, children }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={`text-balance text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-fg ${className ?? ""}`}
    >
      {children}
    </h2>
  );
}
