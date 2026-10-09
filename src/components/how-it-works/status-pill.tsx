import type { ReactNode } from "react";

/** How a pill reads: done, working or alerting, or failed. */
export type PillTone = "ok" | "attention" | "bad";

export type StatusPillProps = {
  tone: PillTone;
  /** A leading dot, which breathes while `pulsing`. */
  dot?: boolean;
  pulsing?: boolean;
  children: ReactNode;
};

const TONE: Record<PillTone, string> = {
  ok: "bg-ok/12 text-ok",
  attention: "bg-amber/12 text-amber",
  bad: "bg-[#fa6571]/12 text-[#fa6571]",
};

/** A small rounded status at the end of a card's title row. */
export function StatusPill({ tone, dot, pulsing, children }: StatusPillProps) {
  return (
    <span
      className={`ml-auto inline-flex flex-none items-center gap-1.5 rounded-full px-[9px] py-[3px] text-[11px] font-medium whitespace-nowrap transition-colors duration-300 md:px-2.5 md:text-[11.5px] ${TONE[tone]}`}
    >
      {dot && <span className={`size-1.5 rounded-full bg-current ${pulsing ? "animate-pulse" : ""}`} />}
      {children}
    </span>
  );
}
