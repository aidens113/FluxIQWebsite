import type { CodeSample } from "@/content/types";

export type CodeWindowProps = {
  sample: CodeSample;
  /** A smaller window with tighter type, for short snippets such as shell commands. */
  compact?: boolean;
};

/** A run of consecutive lines that are all comments, or all code. `start` is its first line number. */
type LineRun = { start: number; comment: boolean; text: string };

const COMMENT_PREFIX: Record<CodeSample["language"], string> = { ts: "//", sh: "#" };

/**
 * Splits a sample into runs so whole-line comments can be dimmed: the only
 * highlighting, with no dependency. Trailing comments stay as code.
 */
function toLineRuns({ code, language }: CodeSample): LineRun[] {
  const prefix = COMMENT_PREFIX[language];
  const lines = code.split("\n");
  const runs: LineRun[] = [];
  for (const [number, line] of lines.entries()) {
    const comment = line.trimStart().startsWith(prefix);
    const text = number < lines.length - 1 ? `${line}\n` : line;
    const last = runs.at(-1);
    if (last && last.comment === comment) last.text += text;
    else runs.push({ start: number, comment, text });
  }
  return runs;
}

/**
 * A code sample in an editor-style window: a title bar with the filename, a
 * keyboard-scrollable region holding the `<pre>`, and the sample's title and
 * caption below.
 */
export function CodeWindow({ sample, compact = false }: CodeWindowProps) {
  const { title, filename, caption } = sample;
  const type = compact ? "p-4 text-xs leading-5" : "p-5 text-[13px] leading-6";
  return (
    // `min-w-0 max-w-full` at each level keeps the window at its container's
    // width, so the region scrolls instead of the <pre> sizing the layout.
    <figure className="flex h-full min-w-0 max-w-full flex-col">
      <div className="flex min-w-0 max-w-full flex-1 flex-col rounded-2xl border border-white/10 bg-black/40 shadow-xl shadow-black/30">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
          </span>
          <span className="font-mono text-xs text-slate-400">{filename}</span>
        </div>
        {/* A named <section> is the region role, the semantic form Biome asks for. */}
        <section
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a horizontally scrollable region must take focus so keyboard users can scroll it (WCAG 2.1.1; axe scrollable-region-focusable).
          tabIndex={0}
          aria-label={`${title} (${filename})`}
          className="min-w-0 max-w-full flex-1 overflow-x-auto rounded-b-2xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-300"
        >
          <pre className={`w-max min-w-full font-mono text-slate-200 ${type}`}>
            <code>
              {toLineRuns(sample).map((run) =>
                run.comment ? (
                  <span key={run.start} className="text-slate-400 italic">
                    {run.text}
                  </span>
                ) : (
                  <span key={run.start}>{run.text}</span>
                ),
              )}
            </code>
          </pre>
        </section>
      </div>
      <figcaption className="mt-4">
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{caption}</p>
      </figcaption>
    </figure>
  );
}
