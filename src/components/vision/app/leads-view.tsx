import type { ConceptAppContent, ConceptLeadStatus } from "@/content/vision";
import { fill, type StoryFrame } from "../outcome-story";

export type LeadsViewProps = {
  app: ConceptAppContent;
  frame: StoryFrame;
  /** The phone's version: six rows of company, score, and status, with no header or city. */
  compact?: boolean;
};

/** Each status's colour; its pill is the same colour at one-eighth strength. */
const STATUS_COLOR: Record<ConceptLeadStatus, string> = {
  new: "#8c8a85",
  enriched: "#93a4b6",
  qualified: "#5e9eea",
  contacted: "#f5b83d",
  replied: "#7fc99b",
};

/** The concept app's lead table, where the newest lead arrives and moves from New to Qualified. */
export function LeadsView({ app, frame, compact = false }: LeadsViewProps) {
  const copy = app.leads;
  const rows = compact ? frame.leads.slice(0, 6) : frame.leads;
  const columns = compact ? "grid-cols-[minmax(0,1fr)_30px_74px]" : "grid-cols-[1.7fr_1fr_44px_80px]";
  return (
    <>
      {compact ? null : (
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">{copy.title}</span>
          <span className="text-dim tabular-nums">{fill(copy.total, frame.total)}</span>
          <span className="ml-auto flex gap-1.5">
            {copy.regions.map((region, i) => (
              <span
                key={region}
                className={`rounded-full border px-2 py-0.5 text-[10.5px] ${i === 0 ? "border-amber-edge text-amber" : "border-edge text-soft"}`}
              >
                {region}
              </span>
            ))}
          </span>
        </div>
      )}
      <div className={`overflow-hidden bg-[#16171a] ${compact ? "rounded-[9px]" : "mt-3.5 rounded-[10px]"}`}>
        {compact ? null : (
          <div className={`grid ${columns} gap-1.5 border-b border-rule px-3 py-2 text-[10.5px] text-dim`}>
            {copy.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
        )}
        {rows.map((lead, i) => {
          const color = STATUS_COLOR[lead.status];
          return (
            <div
              key={lead.name}
              data-aim={i === 0 ? "lead-0" : i === 3 ? "lead-3" : undefined}
              className={`grid ${columns} items-center gap-1.5 px-3 py-2 transition-[background-color,opacity] duration-500 ${i === 0 && compact ? "" : "border-t border-[#1d1f23]"} ${lead.flash ? "bg-ok/12" : "bg-transparent"}`}
              style={{ opacity: lead.hidden ? 0 : 1 }}
            >
              <span className="truncate">{lead.name}</span>
              {compact ? null : <span className="truncate text-muted">{lead.city}</span>}
              <span className={!lead.scored ? "text-dim" : lead.score >= 85 ? "text-ok" : "text-soft"}>
                {lead.scored ? lead.score : copy.pendingScore}
              </span>
              <span
                className="justify-self-start rounded-full px-[7px] py-px text-[10.5px] transition-colors duration-300"
                style={{ color, backgroundColor: `${color}1f` }}
              >
                {copy.statuses[lead.status]}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
