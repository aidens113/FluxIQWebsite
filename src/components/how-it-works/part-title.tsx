import type { SplitTitle } from "@/content/types";

export type PartTitleProps = {
  num: string;
  title: SplitTitle;
};

/** A numbered part heading: the number above it on a phone, beside it from `md` up. */
export function PartTitle({ num, title }: PartTitleProps) {
  return (
    <div className="mb-3.5 md:mb-[22px] md:flex md:items-baseline md:gap-3.5">
      <span className="block font-mono text-xs text-amber">{num}</span>
      <h3 className="mt-1.5 text-[19px] leading-[1.25] font-semibold tracking-[-0.02em] text-fg md:mt-0 md:text-[22px]">
        {title.lead} <span className="font-medium text-dim">{title.muted}</span>
      </h3>
    </div>
  );
}
