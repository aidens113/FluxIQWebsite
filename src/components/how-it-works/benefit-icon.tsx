import type { HowBenefitIcon } from "@/content/how-it-works";

export type BenefitIconProps = {
  name: HowBenefitIcon;
};

/** Each icon's strokes, on a 24 × 24 grid. */
const SHAPES: Record<HowBenefitIcon, readonly string[]> = {
  clock: ["M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z", "M12 7.5V12l3 2"],
  shield: ["M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5z", "m9 12 2.2 2.2L15.5 10"],
  wrench: ["M14.5 6.5a4 4 0 0 0 5 5l-8.5 8.5a2.1 2.1 0 0 1-3-3z", "M14.5 6.5 17 4l3 3-2.5 2.5"],
  trend: ["M4 6l6 6 4-4 6 6", "M20 9.5V14h-4.5"],
};

/** A benefit's static icon in its amber square: 34 px on a phone, 40 px from `md` up. */
export function BenefitIcon({ name }: BenefitIconProps) {
  return (
    <span className="inline-flex size-[34px] flex-none items-center justify-center rounded-[9px] border border-amber-edge bg-amber-wash text-amber md:size-10 md:rounded-[11px]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[17px] overflow-visible md:size-5"
        aria-hidden="true"
      >
        {SHAPES[name].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}
