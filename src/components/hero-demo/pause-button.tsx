import { FOCUS_RING } from "@/components/ui/focus-ring";
import { DEMO_LABELS } from "@/content/hero-demo/examples";

export type PauseButtonProps = { paused: boolean; onToggle: () => void };

/** Pauses and resumes the demo; required for motion that runs longer than five seconds. */
export function PauseButton({ paused, onToggle }: PauseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? DEMO_LABELS.play : DEMO_LABELS.pause}
      aria-pressed={paused}
      className={`inline-flex size-9 flex-none items-center justify-center rounded-full border border-edge text-soft transition-colors hover:border-dim hover:text-fg ${FOCUS_RING}`}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
        {paused ? (
          <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
        ) : (
          <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
        )}
      </svg>
    </button>
  );
}
