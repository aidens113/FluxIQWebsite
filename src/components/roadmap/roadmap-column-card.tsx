import type { RoadmapColumn } from "@/content/types";

export type RoadmapColumnCardProps = {
  column: RoadmapColumn;
};

// The accent reinforces the status; the column title always names it, so the
// status never rests on colour alone.
const ACCENTS = {
  shipped: {
    icon: "text-cyan-300",
    tile: "bg-cyan-400/10 ring-cyan-300/25",
    dot: "bg-cyan-300",
    rule: "via-cyan-300/50",
  },
  "in-progress": {
    icon: "text-purple-300",
    tile: "bg-purple-400/10 ring-purple-300/25",
    dot: "bg-purple-300",
    rule: "via-purple-300/50",
  },
  planned: {
    icon: "text-slate-300",
    tile: "bg-slate-400/10 ring-slate-300/25",
    dot: "bg-slate-300",
    rule: "via-slate-300/40",
  },
} as const satisfies Record<RoadmapColumn["status"], Record<"icon" | "tile" | "dot" | "rule", string>>;

/** One roadmap status: an icon, the status title, an item count, and the list of items. */
export function RoadmapColumnCard({ column }: RoadmapColumnCardProps) {
  const { status, title, icon: Icon, items } = column;
  const accent = ACCENTS[status];
  return (
    <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent to-transparent ${accent.rule}`}
      />
      <div className="flex items-center gap-4">
        <span
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${accent.tile}`}
        >
          <Icon className={`size-5 ${accent.icon}`} strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        {/* The list below announces its own length, so the visual count is hidden from screen readers. */}
        <span
          aria-hidden="true"
          className={`ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-display text-xs font-semibold tabular-nums ${accent.icon}`}
        >
          {items.length}
        </span>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span aria-hidden="true" className={`mt-2 size-1.5 shrink-0 rounded-full ${accent.dot}`} />
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
