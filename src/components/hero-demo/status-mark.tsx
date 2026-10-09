import type { CardState } from "./scenes/scene";

export type StatusMarkProps = { state: CardState; tone: string };

/** How an action went, as a small mark before its outcome: a spinner while it works, a tick when done. */
export function StatusMark({ state, tone }: StatusMarkProps) {
  if (state === "working" || state === "fixing")
    return (
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 flex-none">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke={tone} strokeOpacity="0.25" strokeWidth="1.6" />
        <path
          d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5"
          fill="none"
          stroke={tone}
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ transformOrigin: "6px 6px", animation: "demo-spin 0.8s linear infinite" }}
        />
      </svg>
    );
  if (state === "done")
    return (
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 flex-none">
        <path
          d="M2.5 6.3l2.3 2.3 4.7-4.9"
          fill="none"
          stroke={tone}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <span className="size-1.5 flex-none rounded-full" style={{ background: state === "captured" ? "#fa6571" : tone }} />
  );
}
