import { Reveal } from "@/components/ui/reveal";
import type { FeatureGroup as FeatureGroupContent } from "@/content/types";
import { FeatureCard } from "./feature-card";

export type FeatureGroupProps = {
  group: FeatureGroupContent;
};

// Each group's label pill gets its own accent. The pill's text names the
// group, so the colour is never the only signal.
const PILL_ACCENTS: Record<FeatureGroupContent["id"], string> = {
  core: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  "web-extension": "border-purple-400/30 bg-purple-400/10 text-purple-300",
};

/**
 * Large-screen columns follow the card count, so the last row is never ragged
 * for the counts in use: 3 when the count divides by 3, otherwise 2.
 */
function largeColumns(count: number): string {
  return count % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";
}

/** A feature group: a label row, the summary, a card grid, and an optional footnote. */
export function FeatureGroup({ group }: FeatureGroupProps) {
  const { id, title, summary, note, items } = group;
  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <h3
            className={`shrink-0 rounded-full border px-3.5 py-1 font-display text-sm font-semibold ${PILL_ACCENTS[id]}`}
          >
            {title}
          </h3>
          <div aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-white/15 to-transparent" />
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">{summary}</p>
      </Reveal>
      <ul className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${largeColumns(items.length)}`}>
        {items.map((card) => (
          <li key={card.title}>
            <FeatureCard card={card} />
          </li>
        ))}
      </ul>
      {note ? (
        <Reveal className="mt-6">
          <p className="text-xs text-slate-400">{note}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
