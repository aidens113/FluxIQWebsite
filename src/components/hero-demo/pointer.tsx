import { paced } from "./timeline";

export type PointerProps = { x: number; y: number; visible: boolean };

/** The person's cursor while recording. It glides to each target; FluxIQ's own actions get no cursor. */
export function Pointer({ x, y, visible }: PointerProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[6]"
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
        // Arrives a little before the press (TRAVEL_MS).
        transition: `left ${paced(600)}ms cubic-bezier(.45,0,.2,1), top ${paced(600)}ms cubic-bezier(.45,0,.2,1), opacity 250ms ease`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M2 1.5 L15 9 L9 10.2 L6.2 16 Z"
          fill="#111214"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
