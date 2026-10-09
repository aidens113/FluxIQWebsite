"use client";

import { useRef } from "react";
import type { ConceptAppContent } from "@/content/vision";
import { dollars, fadeStyle, type StoryFrame } from "../outcome-story";
import { FlowsView } from "./flows-view";
import { LeadsView } from "./leads-view";
import { PipelineView } from "./pipeline-view";
import { Pointer } from "./pointer";

export type PhoneAppProps = {
  app: ConceptAppContent;
  frame: StoryFrame;
  className?: string;
};

const VIEW = "absolute inset-x-3 top-3";

/** The concept app below `md`: tabs across the top, a 262 px view, a budget line, and a fingertip using it. */
export function PhoneApp({ app, frame, className }: PhoneAppProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shown = frame.appShown;
  return (
    <div
      ref={cardRef}
      className={`relative mt-4 overflow-hidden rounded-[18px] border border-rule bg-panel text-[12px] shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] ${className ?? ""}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(16px) scale(.98)",
        transition: "opacity .6s, transform .6s cubic-bezier(.3,.7,.3,1)",
      }}
    >
      <div className="px-3 pt-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-amber text-[11px] font-bold text-ink">
            {app.initial}
          </span>
          {app.name}
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] font-normal text-ok">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative size-1.5 rounded-full bg-ok" />
            </span>
            {app.pipeline.live}
          </span>
        </span>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-[9px] bg-[#16171a] p-[3px]">
          {app.nav.slice(0, 3).map((label, i) => (
            <span
              key={label}
              data-aim={`nav-${i}`}
              className={`rounded-[7px] py-1.5 text-center transition-colors duration-[250ms] ${i === frame.view ? "bg-[#2a2c31] text-fg" : "bg-transparent text-dim"}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="relative h-[262px] text-[11.5px]">
        <div className={VIEW} style={fadeStyle(frame.view === 0)}>
          <PipelineView app={app} frame={frame} compact />
        </div>
        <div className={VIEW} style={fadeStyle(frame.view === 1)}>
          <LeadsView app={app} frame={frame} compact />
        </div>
        <div className={VIEW} style={fadeStyle(frame.view === 2)}>
          <FlowsView app={app} frame={frame} compact />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-rule px-3 py-2.5 text-[11px] text-dim">
        <span>
          {app.budget.label}{" "}
          <span className={`font-semibold transition-colors duration-300 ${frame.spendHot ? "text-amber" : "text-fg"}`}>
            {dollars(frame.spend)}
          </span>{" "}
          {app.budget.ofShort}
        </span>
        <span>
          {app.budget.savedShort} <span className="font-semibold text-ok tabular-nums">{dollars(frame.saved)}</span>
        </span>
      </div>
      <Pointer cardRef={cardRef} aim={frame.aim} shown={frame.pointerShown} click={frame.click} kind="finger" />
    </div>
  );
}
