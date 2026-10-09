"use client";

import { useRef } from "react";
import type { ConceptAppContent } from "@/content/vision";
import { dollars, fadeStyle, type StoryFrame } from "../outcome-story";
import { FlowsView } from "./flows-view";
import { LeadsView } from "./leads-view";
import { PipelineView } from "./pipeline-view";
import { Pointer } from "./pointer";

export type DesktopAppProps = {
  app: ConceptAppContent;
  frame: StoryFrame;
  className?: string;
};

const VIEW = "absolute inset-x-[18px] top-4";

/** The concept app from `md` up: a sidebar with the AI budget, three views, and a pointer using it. */
export function DesktopApp({ app, frame, className }: DesktopAppProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shown = frame.appShown;
  return (
    <div
      ref={cardRef}
      className={`relative mt-4 grid grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-[18px] border border-rule bg-panel text-[12px] shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] ${className ?? ""}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(16px) scale(.98)",
        transition: "opacity .6s, transform .6s cubic-bezier(.3,.7,.3,1)",
      }}
    >
      <div className="flex flex-col gap-1 border-r border-rule bg-[#0f1012] px-3 py-4">
        <span className="mb-3.5 flex h-5 items-center gap-2 text-[13px] font-semibold">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-amber text-[11px] font-bold text-ink">
            {app.initial}
          </span>
          {app.name}
        </span>
        {app.nav.map((label, i) => {
          const on = i === frame.view;
          return (
            <span
              key={label}
              data-aim={i < 3 ? `nav-${i}` : undefined}
              className={`flex h-7 items-center justify-between rounded-[7px] px-2 transition-colors duration-[250ms] ${on ? "bg-[#1c1d21] text-fg" : "bg-transparent text-dim"}`}
            >
              {label}
              <span className={`text-[8px] ${i === 2 && frame.fixing ? "text-amber" : "text-transparent"}`}>●</span>
            </span>
          );
        })}
        <div className="mt-auto rounded-[9px] border border-rule p-2.5 leading-[1.4]">
          <p className="text-[10.5px] text-dim">{app.budget.label}</p>
          <p className="mt-0.5 text-[11px] text-dim">
            <span
              className={`text-[13px] font-semibold transition-colors duration-300 ${frame.spendHot ? "text-amber" : "text-fg"}`}
            >
              {dollars(frame.spend)}
            </span>{" "}
            {app.budget.of}
          </p>
          <div className="mt-1.5 h-[3px] overflow-hidden rounded-sm bg-rule">
            <span
              className="block h-full bg-ok transition-[width] duration-[400ms]"
              style={{ width: `${(frame.spend / 5) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[10.5px] text-dim">{app.budget.saved}</p>
          <p className="mt-px text-[15px] font-semibold text-ok tabular-nums">{dollars(frame.saved)}</p>
        </div>
      </div>
      <div className="relative h-[372px] min-w-0">
        <div className={VIEW} style={fadeStyle(frame.view === 0)}>
          <PipelineView app={app} frame={frame} />
        </div>
        <div className={VIEW} style={fadeStyle(frame.view === 1)}>
          <LeadsView app={app} frame={frame} />
        </div>
        <div className={VIEW} style={fadeStyle(frame.view === 2)}>
          <FlowsView app={app} frame={frame} />
        </div>
      </div>
      <Pointer cardRef={cardRef} aim={frame.aim} shown={frame.pointerShown} click={frame.click} kind="arrow" />
    </div>
  );
}
