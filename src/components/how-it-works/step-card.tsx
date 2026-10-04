import type { Step } from "@/content/types";

export type StepCardProps = {
  step: Step;
};

/** One step of a Flow's life. The highlighted step is drawn in the accent. */
export function StepCard({ step }: StepCardProps) {
  const frame = step.highlight ? "border-amber-edge bg-amber-wash" : "border-rule";
  return (
    <li className={`rounded-[10px] border p-6 ${frame}`}>
      <p className={`mb-8 font-mono text-xs ${step.highlight ? "text-amber" : "text-dim"}`}>{step.label}</p>
      <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
      <p className="text-[15px] leading-relaxed text-muted">{step.body}</p>
    </li>
  );
}
