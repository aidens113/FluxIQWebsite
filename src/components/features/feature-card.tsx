import { Reveal } from "@/components/ui/reveal";
import type { Card } from "@/content/types";

export type FeatureCardProps = {
  card: Card;
};

/**
 * One feature: icon tile, title, and body. The title is an h4 because each
 * card sits under its group's h3 label, which sits under the section's h2.
 */
export function FeatureCard({ card }: FeatureCardProps) {
  const { icon: Icon, title, body } = card;
  return (
    <Reveal className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
        <Icon className="size-5 text-white" strokeWidth={2} aria-hidden="true" />
      </span>
      <h4 className="mt-5 font-display text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </Reveal>
  );
}
