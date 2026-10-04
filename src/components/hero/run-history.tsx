import { TONE_TEXT } from "@/components/ui/tone-class";
import { RUN_HISTORY } from "@/content/run-history";

// Four columns from md up. On a phone each row stacks: the run beside the
// event, with the AI and result cells labelled underneath, so nothing scrolls.
const GRID =
  "grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-1 px-5 py-3 md:grid-cols-[110px_minmax(0,1fr)_110px_140px] md:gap-y-0";
const STACKED = "max-md:col-start-2 max-md:before:text-dim";

/**
 * An illustrative run history: one model call to build the Flow, replays with
 * no AI, a repair when the page changes. A real table, so screen readers get
 * the columns; on a phone the header row is visually hidden and cells stack.
 */
export function RunHistory() {
  return (
    <figure className="overflow-hidden rounded-[10px] border border-rule bg-panel font-mono text-[13px]">
      <figcaption className="flex flex-wrap justify-between gap-2 border-b border-rule px-5 py-3.5 text-dim">
        <span>{RUN_HISTORY.label}</span>
        <span>{RUN_HISTORY.note}</span>
      </figcaption>
      <table className="w-full border-collapse text-left">
        <thead className="max-md:sr-only">
          <tr className={`${GRID} border-b border-line text-dim`}>
            {RUN_HISTORY.columns.map((column) => (
              <th key={column} scope="col" className="font-normal">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RUN_HISTORY.rows.map((row) => {
            const flagged = row.tone === "attention";
            return (
              <tr
                key={row.run}
                className={`${GRID} border-b border-line last:border-b-0 ${flagged ? "bg-amber-row" : ""}`}
              >
                <th scope="row" className={`font-normal ${flagged ? "text-amber" : "text-dim"}`}>
                  {row.run}
                </th>
                <td>{row.event}</td>
                <td
                  className={`${STACKED} max-md:before:content-['AI_used:_'] ${row.usedAi ? "text-amber" : "text-soft"}`}
                >
                  {row.ai}
                </td>
                <td className={`${STACKED} ${TONE_TEXT[row.tone]}`}>{row.result}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}
