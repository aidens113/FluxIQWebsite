export type StatusPillProps = {
  label: string;
  /** Layout additions only, such as margin. */
  className?: string;
};

/**
 * The project-status pill. The dot's halo pulses through `animate-status-pulse`;
 * under reduced motion the halo rests exactly on the dot and nothing moves.
 */
export function StatusPill({ label, className }: StatusPillProps) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-cyan-300 uppercase ${className ?? ""}`}
    >
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-status-pulse rounded-full bg-cyan-400" />
        <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
      </span>
      {label}
    </p>
  );
}
