import type { LicenseList } from "@/content/types";

export type LicenseListCardProps = {
  list: LicenseList;
  /** Cyan for what is free, purple for what needs an agreement. */
  accent: "cyan" | "purple";
};

const ACCENTS = {
  cyan: {
    icon: "text-cyan-300",
    tile: "bg-cyan-400/10 ring-cyan-300/25",
    dot: "bg-cyan-300",
  },
  purple: {
    icon: "text-purple-300",
    tile: "bg-purple-400/10 ring-purple-300/25",
    dot: "bg-purple-300",
  },
} as const satisfies Record<LicenseListCardProps["accent"], Record<"icon" | "tile" | "dot", string>>;

/** One side of the license summary: an icon, the list title, and its uses. */
export function LicenseListCard({ list, accent }: LicenseListCardProps) {
  const { title, icon: Icon, items } = list;
  const colours = ACCENTS[accent];
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30">
      <div className="flex items-center gap-4">
        <span
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${colours.tile}`}
        >
          <Icon className={`size-5 ${colours.icon}`} strokeWidth={2} aria-hidden="true" />
        </span>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300">
            <span aria-hidden="true" className={`mt-2 size-1.5 shrink-0 rounded-full ${colours.dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
