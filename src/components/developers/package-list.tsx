import type { PackageInfo } from "@/content/types";

export type PackageListProps = {
  packages: readonly PackageInfo[];
};

/** The published packages, one row each: mono name, version badge, and summary. */
export function PackageList({ packages }: PackageListProps) {
  return (
    <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
      {packages.map(({ name, version, summary }) => (
        <li key={name} className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <code className="font-mono text-sm font-medium break-all text-white">{name}</code>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 font-mono text-xs text-cyan-300">
              v{version}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{summary}</p>
        </li>
      ))}
    </ul>
  );
}
