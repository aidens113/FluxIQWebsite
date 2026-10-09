import { HOW_IT_WORKS } from "@/content/how-it-works";
import { BenefitIcon } from "./benefit-icon";

/** What a Flow gives you: an icon list on a phone, four tiles from `md` up. */
export function BenefitPoints() {
  const { benefits } = HOW_IT_WORKS;
  return (
    <>
      <ul className="mt-12 flex flex-col md:hidden">
        {benefits.map((point) => (
          <li key={point.icon} className="flex items-start gap-3.5 border-t border-line py-3.5 first:border-t-0">
            <BenefitIcon name={point.icon} />
            <div>
              <h3 className="text-[15px] font-semibold text-fg">{point.title}</h3>
              <p className="mt-[3px] text-[13.5px] leading-[1.45] text-muted">{point.shortBody}</p>
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-24 hidden gap-[18px] md:grid md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((point) => (
          <li key={point.icon} className="rounded-[18px] border border-rule bg-panel p-6">
            <BenefitIcon name={point.icon} />
            <h3 className="mt-[18px] text-[17px] font-semibold tracking-[-0.01em] text-fg">{point.title}</h3>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">{point.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
