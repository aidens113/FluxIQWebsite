export type ReleaseChipsProps = {
  /** The release status, shown as the attention pill. */
  release: string;
  requirements: readonly string[];
};

/** The release status as an attention pill, then one chip per requirement. */
export function ReleaseChips({ release, requirements }: ReleaseChipsProps) {
  return (
    <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <li className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-300" />
        {release}
      </li>
      {requirements.map((requirement) => (
        <li
          key={requirement}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
        >
          {requirement}
        </li>
      ))}
    </ul>
  );
}
