import { RIPPLE_GAP_MS } from "./motion";
import { animated } from "./timeline";

export type ClickRippleProps = {
  color: string;
  /** When the press happens within the step. */
  delay: number;
  /** FluxIQ's clicks add a crosshair that settles on the target while it aims. */
  crosshair?: boolean;
};

/** One click effect for every click: two rings ripple from the target's centre. */
export function ClickRipple({ color, delay, crosshair }: ClickRippleProps) {
  const ring = (offset: number) => (
    <span
      className="pointer-events-none absolute top-1/2 left-1/2 size-[26px] rounded-full"
      style={{
        border: `2px solid ${color}`,
        animation: `demo-ripple ${animated(700)}ms ${delay + offset}ms cubic-bezier(.2,.7,.3,1) both`,
      }}
    />
  );
  return (
    <>
      {ring(0)}
      {ring(RIPPLE_GAP_MS)}
      {crosshair && (
        <svg
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[22px]"
          style={{
            color,
            filter: `drop-shadow(0 0 4px ${color}99)`,
            animation: `demo-aim ${animated(600)}ms cubic-bezier(.3,.7,.2,1) both`,
          }}
        >
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M11 1.5v4.5M11 16v4.5M1.5 11h4.5M16 11h4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="11" cy="11" r="1.6" fill="currentColor" />
        </svg>
      )}
    </>
  );
}
