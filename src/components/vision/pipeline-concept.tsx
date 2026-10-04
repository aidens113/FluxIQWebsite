import { TONE_TEXT } from "@/components/ui/tone-class";
import type { ConceptContent } from "@/content/types";

export type PipelineConceptProps = {
  concept: ConceptContent;
};

const FLOW_GRID = "grid grid-cols-[minmax(0,1fr)_90px_80px] gap-3 border-t border-line py-2.5";

/** A labelled concept of a generated application: pipeline counts and the Flows behind them. */
export function PipelineConcept({ concept }: PipelineConceptProps) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border border-rule bg-panel">
      <p className="border-b border-rule px-5 py-4 font-mono text-xs leading-relaxed text-dim">{concept.prompt}</p>
      <div className="px-5 py-6">
        <p className="mb-4 text-[15px] font-semibold">{concept.heading}</p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {concept.stages.map((stage) => (
            <div
              key={stage.label}
              className={`rounded-lg border p-3.5 ${stage.highlight ? "border-amber-edge bg-amber-wash" : "border-rule"}`}
            >
              <dt className={`font-mono text-[11px] ${stage.highlight ? "text-amber" : "text-dim"}`}>{stage.label}</dt>
              <dd className="mt-2 text-[26px] font-semibold">{stage.value}</dd>
            </div>
          ))}
        </dl>
        <table className="mt-5 w-full border-b border-line font-mono text-xs">
          <thead>
            <tr className={`${FLOW_GRID} text-left text-dim`}>
              {concept.columns.map((column) => (
                <th key={column} scope="col" className="font-normal">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {concept.flows.map((flow) => (
              <tr key={flow.name} className={FLOW_GRID}>
                <th scope="row" className="text-left font-normal">
                  {flow.name}
                </th>
                <td className={flow.tone === "attention" ? "text-amber" : "text-dim"}>{flow.lastRun}</td>
                <td className={TONE_TEXT[flow.tone]}>{flow.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="border-t border-rule px-5 py-3.5 text-[13px] text-dim">{concept.caption}</figcaption>
    </figure>
  );
}
