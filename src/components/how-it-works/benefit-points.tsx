import { HOW_IT_WORKS } from "@/content/how-it-works";
import { BenefitIcon } from "./benefit-icon";

/** What a Flow gives you, in a few words each: two columns on a phone, four in a row from `lg` up. */
export function BenefitPoints() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 md:mt-9 lg:grid-cols-4 lg:gap-6">
      {HOW_IT_WORKS.benefits.map((point) => (
        <li key={point.icon} className="flex items-start gap-2.5 lg:items-center lg:gap-3">
          <BenefitIcon name={point.icon} />
          <div className="min-w-0">
            <h3 className="text-[13px] leading-[1.3] font-medium text-fg lg:text-[14.5px]">{point.title}</h3>
            <p className="mt-0.5 text-[11.5px] leading-[1.35] text-dim lg:text-[12.5px]">{point.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
