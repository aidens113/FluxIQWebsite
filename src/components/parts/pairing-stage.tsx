"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { PARTS } from "@/content/parts";
import { Connector } from "./connector";
import { FlowsMock } from "./flows-mock";
import { PartCard } from "./part-card";
import { SearchPage } from "./search-page";
import { SidePanel } from "./side-panel";
import { partsFrame } from "./timeline";

/**
 * The two cards and the wire between them, playing the pairing story on the
 * shared loop clock: side by side from `md`, stacked on a phone.
 */
export function PairingStage() {
  const { ref, tick } = useLoopClock<HTMLDivElement>();
  const { browserMock, flowsMock, pairingCode, wire } = PARTS;
  const frame = partsFrame(tick, browserMock.results.length);
  return (
    <div ref={ref} className="mt-7 grid md:mt-12 md:grid-cols-[minmax(0,1fr)_clamp(112px,16vw,184px)_minmax(0,1fr)]">
      <PartCard copy={PARTS.framework}>
        <FlowsMock frame={frame} copy={flowsMock} code={pairingCode} />
      </PartCard>
      <div className="snap-start md:hidden">
        <Connector frame={frame} labels={wire} orientation="column" />
      </div>
      <div className="hidden md:block">
        <Connector frame={frame} labels={wire} orientation="row" />
      </div>
      <PartCard copy={PARTS.extension}>
        <SearchPage frame={frame} copy={browserMock} />
        <SidePanel frame={frame} copy={browserMock} code={pairingCode} />
      </PartCard>
    </div>
  );
}
