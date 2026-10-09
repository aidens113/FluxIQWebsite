import type { WhyIcon } from "@/content/why";

export type ValueIconProps = {
  name: WhyIcon;
};

/** Each icon's strokes, on a 24 × 24 grid. */
const SHAPES: Record<WhyIcon, readonly string[]> = {
  coin: [
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    "M14.8 9.4c-.5-.9-1.5-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2 0 2.7 5.6 1.5 5.6 4.1 0 1.2-1.2 2.1-2.8 2.1-1.3 0-2.4-.5-2.9-1.5M12 6.6V8M12 16.2v1.2",
  ],
  gauge: ["M4 16a8 8 0 1 1 16 0", "M12 16l3.5-4.5", "M12 14.7a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"],
  shield: ["M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z", "M8.5 12l2.5 2.5 4.5-5"],
  sliders: ["M4 7h9M17 7h3M4 17h3M11 17h9", "M15 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z", "M9 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
};

/** A value point's static icon in its amber square: 34 px on a phone, 40 px from `md` up. */
export function ValueIcon({ name }: ValueIconProps) {
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
