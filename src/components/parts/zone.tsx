import type { ReactNode } from "react";
import type { PartCardCopy } from "@/content/parts";

export type ZoneProps = {
  copy: PartCardCopy;
  icon: "computer" | "browser";
  /** The zone's illustration: FluxIQ's Flows, or a page beside the extension's panel. */
  children: ReactNode;
};

/** Each icon's strokes, on a 24 × 24 grid. */
const ICONS = {
  computer: ["M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M8 20h8M12 16v4"],
  browser: ["M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M3 9h18M7 6.5h.01M10 6.5h.01"],
} as const;

/** One half of FluxIQ: where it runs, an illustration of it at work, and what it does in a few words. */
export function Zone({ copy, icon, children }: ZoneProps) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-sm font-semibold text-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[15px] flex-none text-amber"
          aria-hidden="true"
        >
          {ICONS[icon].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        {copy.zone}
        {copy.zoneTag && (
          <span className="font-mono text-[10.5px] font-medium tracking-[0.06em] text-amber uppercase">
            · {copy.zoneTag}
          </span>
        )}
      </p>
      <div
        role="img"
        aria-label={copy.illustration}
        className="mt-3.5 flex h-[226px] flex-col overflow-hidden rounded-[14px] border border-rule bg-[#0e0f11] lg:h-[250px]"
      >
        {children}
      </div>
      <h3 className="mt-3.5 text-lg font-semibold tracking-[-0.02em] lg:mt-[22px] lg:text-[22px]">{copy.title}</h3>
      <p className="mt-1 text-[13px] leading-normal text-dim lg:mt-1.5 lg:text-[14.5px]">{copy.body}</p>
    </div>
  );
}
