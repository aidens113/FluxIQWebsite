export type SiteSketchProps = {
  site: string;
  /** Shows the redesigned layout, crossfading from the recorded one. */
  changed: boolean;
  /** FluxIQ is scanning the page for the moved search box. */
  scanning: boolean;
};

const LAYER = "absolute inset-x-0 top-3.5 px-2 py-[7px] transition-opacity duration-600";

/**
 * A tiny browser window on the leads site: the search box in the page as
 * recorded, then, after the redesign, moved into a new header. While FluxIQ
 * looks for it, a blue scan sweeps down the page.
 */
export function SiteSketch({ site, changed, scanning }: SiteSketchProps) {
  return (
    <div
      className={`relative h-[74px] w-[120px] overflow-hidden rounded-lg border bg-[#0e0f11] transition-colors duration-400 ${changed ? "border-amber-edge" : "border-edge"}`}
    >
      <div className="flex h-3.5 items-center gap-1 border-b border-[#1d1f23] px-1.5">
        <span className="size-1 rounded-full bg-edge" />
        <span className="size-1 rounded-full bg-edge" />
        <span className="ml-1 font-mono text-[7.5px] text-[#55585f]">{site}</span>
      </div>
      <div className={`${LAYER} ${changed ? "opacity-0" : "opacity-100"}`}>
        <div className="flex items-center gap-1">
          <span className="h-[5px] w-5 rounded-[2px] bg-[#33363c]" />
          <span className="ml-auto h-1 w-3 rounded-[2px] bg-[#26282d]" />
        </div>
        <div className="mt-2 h-3 rounded border border-ok" />
        <div className="mt-1.5 h-1 w-[76%] rounded-[2px] bg-[#1d1f23]" />
        <div className="mt-1 h-1 w-[58%] rounded-[2px] bg-[#1d1f23]" />
      </div>
      {scanning && (
        <span className="how-scan pointer-events-none absolute inset-x-0 top-3.5 z-10 h-1/4 bg-linear-to-b from-transparent via-[#5e9eea]/25 to-transparent" />
      )}
      <div className={`${LAYER} ${changed ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-1">
          <span className="h-[5px] w-5 rounded-[2px] bg-[#33363c]" />
          <span className="ml-auto h-2.5 w-[46px] rounded-[3px] border border-amber" />
        </div>
        <div className="mt-[7px] h-6 rounded bg-linear-110 from-[#1b1d21] to-amber-wash" />
      </div>
    </div>
  );
}
