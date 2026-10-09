import { WHY } from "@/content/why";
import { ValueIcon } from "./value-icon";

/** The four reasons it costs less: an icon list on a phone, tiles from `md` up. */
export function ValuePoints() {
  return (
    <>
      <ul className="mt-7 flex flex-col md:hidden">
        {WHY.points.map((point) => (
          <li key={point.icon} className="flex items-start gap-3.5 border-t border-line py-3.5 first:border-t-0">
            <ValueIcon name={point.icon} />
            <div>
              <h3 className="text-[15px] font-semibold text-fg">{point.shortTitle}</h3>
              <p className="mt-[3px] text-[13.5px] leading-[1.45] text-muted">{point.shortBody}</p>
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-14 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
        {WHY.points.map((point) => (
          <li key={point.icon} className="rounded-[18px] border border-rule bg-panel p-[26px]">
            <ValueIcon name={point.icon} />
            <h3 className="mt-[18px] text-[17px] font-semibold tracking-[-0.01em] text-fg">{point.title}</h3>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">{point.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
