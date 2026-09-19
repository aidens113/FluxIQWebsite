import type { Card } from "@/content/types";

export type WhyCardProps = {
  card: Card;
};

/** One reason to choose FluxIQ: an icon tile, an h3 title, and a short body. */
export function WhyCard({ card }: WhyCardProps) {
  const { icon: Icon, title, body } = card;
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
        <Icon className="size-5 text-white" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
