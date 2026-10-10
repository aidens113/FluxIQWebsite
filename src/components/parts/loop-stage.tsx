"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { PARTS } from "@/content/parts";
import { FlowsMock } from "./flows-mock";
import { SearchPage } from "./search-page";
import { SidePanel } from "./side-panel";
import { partsFrame } from "./timeline";
import { Wire } from "./wire";
import { Zone } from "./zone";

/**
 * The two halves of FluxIQ and the wire between them, playing one loop on
 * the smooth shared clock. The clock carries on rather than restarting, so
 * the pairing plays once per visit and only the job loop repeats. Side by
 * side from `lg`, stacked below with the wire running down between them.
 */
export function LoopStage() {
  const { ref, tick } = useLoopClock<HTMLDivElement>(50, true, false);
  const { browserMock, flowsMock, pairingCode } = PARTS;
  const frame = partsFrame(tick, browserMock.results.length, browserMock.query.length);
  return (
    <div
      ref={ref}
      className="mt-8 rounded-[18px] border border-rule bg-panel px-3.5 py-[18px] md:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(160px,328px)_minmax(0,1fr)] lg:rounded-[20px] lg:px-8 lg:pt-7 lg:pb-8"
    >
      <Zone copy={PARTS.framework} icon="computer">
        <FlowsMock frame={frame} copy={flowsMock} code={pairingCode} />
      </Zone>
      <div className="lg:hidden">
        <Wire frame={frame} orientation="column" />
      </div>
      <div className="hidden lg:block lg:h-[250px] lg:translate-y-[34px]">
        <Wire frame={frame} orientation="row" />
      </div>
      <Zone copy={PARTS.extension} icon="browser">
        <div className="flex h-[26px] flex-none items-center gap-[5px] border-b border-[#1d1f23] px-2.5">
          <span className="size-1.5 rounded-full bg-edge" />
          <span className="size-1.5 rounded-full bg-edge" />
          <span className="ml-2 h-[15px] flex-1 rounded-[5px] bg-[#16171a] px-[7px] font-mono text-[9.5px] leading-[15px] text-[#55585f]">
            {browserMock.site}
          </span>
        </div>
        <div className="flex min-h-0 flex-1">
          <SearchPage frame={frame} copy={browserMock} />
          <SidePanel frame={frame} copy={browserMock} code={pairingCode} />
        </div>
      </Zone>
    </div>
  );
}
