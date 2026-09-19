import { Reveal } from "@/components/ui/reveal";
import type { Card } from "@/content/types";

export type TimelineStepProps = {
  step: Card;
  /** Zero-based position: picks the accent and the two-digit number. */
  index: number;
};

// Full class strings, so Tailwind sees every one. Each step's dot and icon tile
// share a gradient; the number uses the bright 300 shade of its first stop.
const ACCENTS = [
  { gradient: "from-cyan-400 to-blue-600", shadow: "shadow-cyan-500/20", number: "text-cyan-300" },
  { gradient: "from-blue-500 to-purple-600", shadow: "shadow-blue-500/20", number: "text-blue-300" },
  { gradient: "from-purple-500 to-fuchsia-600", shadow: "shadow-purple-500/20", number: "text-purple-300" },
  { gradient: "from-fuchsia-500 to-cyan-400", shadow: "shadow-fuchsia-500/20", number: "text-fuchsia-300" },
] as const;

const [FIRST_ACCENT] = ACCENTS;

/**
 * One step of the How it works timeline: a gradient dot on the rail, then a card
 * with the icon tile, the step number, the h3 title, and the body. The number is
 * hidden from assistive technology because the ordered list already announces it.
 * The dot's `pt-10` centres it on the icon tile (card padding 24 px + half the
 * 44 px tile), which stays top-aligned so a wrapped title cannot move it.
 */
export function TimelineStep({ step, index }: TimelineStepProps) {
  const { icon: Icon, title, body } = step;
  const accent = ACCENTS[index % ACCENTS.length] ?? FIRST_ACCENT;
  const number = String(index + 1).padStart(2, "0");
  return (
    <li className="flex gap-5 sm:gap-8">
      <div className="flex w-6 shrink-0 justify-center pt-10" aria-hidden="true">
        <span className={`size-3 rounded-full bg-linear-to-br ring-4 ring-ink ${accent.gradient}`} />
      </div>
      <Reveal className="min-w-0 flex-1">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30">
          <div className="flex items-start gap-4">
            <span
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-lg ${accent.gradient} ${accent.shadow}`}
            >
              <Icon className="size-5 text-white" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className={`font-display text-sm font-semibold tracking-widest ${accent.number}`} aria-hidden="true">
                {number}
              </p>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{body}</p>
        </div>
      </Reveal>
    </li>
  );
}
