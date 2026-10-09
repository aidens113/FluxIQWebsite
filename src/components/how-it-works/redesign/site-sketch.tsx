export type SiteSketchProps = {
  site: string;
  search: { before: string; after: string };
  /** Shows the redesigned layout, crossfading from the recorded one. */
  changed: boolean;
};

const LAYER = "absolute inset-x-0 top-3.5 px-2 py-[7px] transition-opacity duration-600 md:top-5 md:px-3 md:py-2.5";
const BAR = "rounded-[2px] md:rounded-[3px]";

/**
 * A tiny browser window on the leads site: the search box in the page as
 * recorded, then, after the redesign, moved into a new header.
 */
export function SiteSketch({ site, search, changed }: SiteSketchProps) {
  return (
    <div className="relative h-[76px] w-[120px] flex-none overflow-hidden rounded-lg border border-edge bg-[#0e0f11] md:h-[120px] md:w-[260px] md:rounded-[10px]">
      <div className="flex h-3.5 items-center gap-1 border-b border-[#1d1f23] px-1.5 md:h-5 md:gap-[5px] md:px-[9px]">
        <span className="size-1 rounded-full bg-edge md:size-1.5" />
        <span className="size-1 rounded-full bg-edge md:size-1.5" />
        <span className="ml-2 hidden font-mono text-[9.5px] text-dim md:inline">{site}</span>
      </div>
      <div className={`${LAYER} ${changed ? "opacity-0" : "opacity-100"}`}>
        <div className="flex items-center gap-1 md:gap-1.5">
          <span className={`h-[5px] w-[18px] bg-[#33363c] md:h-2 md:w-[34px] ${BAR}`} />
          <span className={`ml-auto h-1 w-3 bg-[#26282d] md:h-1.5 md:w-[22px] ${BAR}`} />
          <span className={`hidden h-1.5 w-[22px] bg-[#26282d] md:block ${BAR}`} />
        </div>
        <div className="mt-2 flex h-3 items-center rounded border border-ok px-2 md:mt-3.5 md:h-5 md:rounded-md">
          <span className="hidden font-mono text-[9px] text-dim md:inline">{search.before}</span>
        </div>
        <div className={`mt-1.5 h-1 w-[76%] bg-[#1d1f23] md:mt-[9px] md:h-1.5 md:w-4/5 ${BAR}`} />
        <div className={`mt-1.5 hidden h-1.5 w-[64%] bg-[#1d1f23] md:block ${BAR}`} />
      </div>
      <div className={`${LAYER} ${changed ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-1 md:gap-1.5">
          <span className={`h-[5px] w-[18px] bg-[#33363c] md:h-2 md:w-[34px] ${BAR}`} />
          <span className="ml-auto inline-flex h-[9px] w-11 items-center rounded-[3px] border border-amber px-1.5 md:h-4 md:w-24 md:rounded-[5px]">
            <span className="hidden font-mono text-[8px] text-dim md:inline">{search.after}</span>
          </span>
        </div>
        <div className="mt-[7px] h-5 rounded bg-linear-110 from-[#1b1d21] to-amber-wash md:mt-3 md:h-[34px] md:rounded-md" />
        <div className="mt-2 hidden grid-cols-3 gap-[5px] md:grid">
          <span className="h-3 rounded-[3px] bg-[#1d1f23]" />
          <span className="h-3 rounded-[3px] bg-[#1d1f23]" />
          <span className="h-3 rounded-[3px] bg-[#1d1f23]" />
        </div>
      </div>
    </div>
  );
}
