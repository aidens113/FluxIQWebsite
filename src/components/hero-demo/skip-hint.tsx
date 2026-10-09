export type SkipHintProps = { text: string };

/** A quiet note, with a fast-forward mark, that clicking or tapping the stage skips to the next step. */
export function SkipHint({ text }: SkipHintProps) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1 text-[11.5px] whitespace-nowrap text-dim">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3" fill="currentColor">
        <path d="M2 3.5v9l6-4.5zM8.5 3.5v9l6-4.5z" />
      </svg>
      {text}
    </span>
  );
}
