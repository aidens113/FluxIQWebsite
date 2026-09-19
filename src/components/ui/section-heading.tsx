import type { ReactNode } from "react";

export type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Set on the h2, so the section can name itself with `aria-labelledby`. */
  id?: string;
};

/** A section's centred opening: a small accent eyebrow, the h2, and an optional lede. */
export function SectionHeading({ eyebrow, title, lede, id }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-display text-sm font-semibold tracking-widest text-cyan-300 uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-base text-slate-400 sm:text-lg">{lede}</p> : null}
    </div>
  );
}
