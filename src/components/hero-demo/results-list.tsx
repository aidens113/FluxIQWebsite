import { DIRECTORY } from "@/content/hero-demo/directory";
import { Highlight } from "./highlight";
import type { SiteScene } from "./scenes/scene";

export type ResultsListProps = {
  site: SiteScene;
  /** True while FluxIQ reads the rows. */
  reading: boolean;
  tick: number;
};

/**
 * The example site's results. New results slide in row by row; while FluxIQ
 * reads, each row lights up blue with one sweep of light (adding the read
 * animation leaves the slide-in alone), and every row turns green the moment
 * the chat reports them read.
 */
export function ResultsList({ site, reading, tick }: ResultsListProps) {
  const rows = site.filtered ? DIRECTORY.rowsCity : DIRECTORY.rowsAll;
  return (
    <div
      key={site.rowsLoad}
      className="relative mx-4 flex flex-col gap-1.5"
      style={{ animation: "demo-fade 260ms ease both" }}
    >
      <Highlight target={site.target} name="results" redesigned={site.redesigned} tick={tick} />
      <p className="mb-0.5 text-[11px] text-[#6b7480]">{site.filtered ? DIRECTORY.countCity : DIRECTORY.countAll}</p>
      {rows.map((row, i) => (
        <div
          key={row.initials}
          className="relative flex items-center gap-2.5 overflow-hidden px-2.5 py-[7px]"
          style={{
            borderRadius: site.redesigned ? 2 : 9,
            border: `1px solid ${site.rowsDone ? "#3bc982" : "#e3e7ec"}`,
            background: site.rowsDone ? "#f2fbf6" : "#ffffff",
            boxShadow: site.rowsDone ? "0 0 0 3px rgba(59,201,130,0.22)" : undefined,
            transition: "all 450ms ease",
            animation: `demo-rowin 360ms ${i * 60}ms ease-out both${reading ? `, demo-rowread 350ms ${i * 240}ms ease-out both` : ""}`,
          }}
        >
          {reading && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-2/5"
              style={{
                background: "linear-gradient(100deg, transparent, rgba(94,158,234,0.40), transparent)",
                animation: `demo-rowsweep 650ms ${i * 240}ms ease-in-out both`,
              }}
            />
          )}
          <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-[#e7ebf0] text-[10.5px] font-semibold text-[#4a5562]">
            {row.initials}
          </span>
          <span className="flex flex-col gap-px">
            <span className="text-xs font-semibold">{row.name}</span>
            <span className="text-[10.5px] text-[#6b7480]">{row.meta}</span>
          </span>
          <span className="ml-auto text-[11px] text-[#3d4652] tabular-nums">{row.phone}</span>
        </div>
      ))}
    </div>
  );
}
