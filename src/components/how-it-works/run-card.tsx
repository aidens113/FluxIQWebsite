import type { HowRun } from "@/content/how-it-works";

export type RunCardProps = {
  run: HowRun;
};

const TAG_TONE: Record<HowRun["tone"], string> = {
  check: "bg-[#5e9eea]/12 text-[#5e9eea]",
  ok: "bg-ok/12 text-ok",
};

/** One run reporting in: its number, what it did, its tag, and its AI cost. */
export function RunCard({ run }: RunCardProps) {
  const free = run.cost === "$0.00";
  return (
    <div className="how-msg-in grid grid-cols-[20px_auto_minmax(0,1fr)_auto_auto] items-center gap-[7px] rounded-[10px] border border-[#1f2125] bg-[#141518] px-2.5 py-2 text-[11.5px] whitespace-nowrap md:ml-10 md:grid-cols-[22px_auto_minmax(0,1fr)_auto_auto] md:gap-2.5 md:px-3 md:py-[9px] md:text-[12.5px]">
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-ok/14 text-[11px] font-bold text-ok md:size-[22px]">
        ✓
      </span>
      <span className="font-semibold text-fg">{run.title}</span>
      <span className="overflow-hidden text-ellipsis text-muted">{run.detail}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] ${TAG_TONE[run.tone]}`}>{run.tag}</span>
      <span className={`font-mono text-[11.5px] ${free ? "text-ok" : "text-amber"}`}>{run.cost}</span>
    </div>
  );
}
