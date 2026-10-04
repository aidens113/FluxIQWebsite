import type { ActionLink } from "@/content/types";
import { FOCUS_RING } from "./focus-ring";

export type LinkButtonProps = {
  action: ActionLink;
};

const BASE = `inline-flex min-h-12 items-center justify-center rounded-md px-5.5 text-[15px] transition-colors ${FOCUS_RING}`;

const VARIANTS = {
  primary: "bg-amber font-semibold text-ink hover:bg-[#ffc95c]",
  ghost: "border border-edge font-medium text-fg hover:border-dim hover:text-white",
} as const;

/** A call-to-action link styled as a button. External links open a new tab and say so to screen readers. */
export function LinkButton({ action }: LinkButtonProps) {
  const classes = `${BASE} ${VARIANTS[action.variant]}`;
  if (!action.external) {
    return (
      <a href={action.href} className={classes}>
        {action.label}
      </a>
    );
  }
  return (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {action.label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
