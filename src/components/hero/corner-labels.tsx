import type { HeroContent } from "@/content/types";

export type CornerLabelsProps = {
  labels: HeroContent["cornerLabels"];
};

const LABEL = "absolute hidden text-[11px] font-medium tracking-[0.35em] text-slate-400 uppercase";

/**
 * The live site's corner labels, from `md` up: `start` stacked word by word in
 * the top-right corner over a short cyan rule, and `end` in the bottom-left
 * with its arrow in cyan. Decorative: rendered inside the hero's `aria-hidden`
 * decoration layer.
 */
export function CornerLabels({ labels }: CornerLabelsProps) {
  const words = labels.start.split("/").map((word) => word.trim());
  const [from, ...rest] = labels.end.split("→").map((part) => part.trim());
  return (
    <>
      <div className={`${LABEL} top-10 right-10 text-right md:block`}>
        {words.map((word) => (
          <p key={word} className="not-first:mt-2">
            {word}
          </p>
        ))}
        <div className="mt-4 ml-auto h-px w-10 bg-linear-to-r from-transparent to-cyan-400" />
      </div>
      <p className={`${LABEL} bottom-10 left-10 items-center gap-3 md:flex`}>
        <span>{from}</span>
        {rest.length > 0 ? (
          <>
            <span className="text-cyan-400">→</span>
            <span>{rest.join(" → ")}</span>
          </>
        ) : null}
      </p>
    </>
  );
}
