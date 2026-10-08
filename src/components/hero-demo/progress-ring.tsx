export type ProgressRingProps = {
  /** How long the current step lasts. */
  ms: number;
  /** Restarts the ring: a new step, or playback resuming. */
  runKey: string;
  running: boolean;
  size?: number;
};

/** A small ring that fills over the current step, so the time left is visible. */
export function ProgressRing({ ms, runKey, running, size = 16 }: ProgressRingProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className="-rotate-90">
      <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.2" />
      <circle
        key={runKey}
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="#f5b83d"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="37.7"
        style={running ? { animation: `demo-ring ${ms}ms linear forwards` } : { strokeDashoffset: 37.7 }}
      />
    </svg>
  );
}
