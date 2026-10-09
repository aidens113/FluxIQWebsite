"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { ChatWindow } from "./chat-window";
import "./chat.css";
import { StageList } from "./stage-list";
import { StageProgress } from "./stage-progress";
import { howFrame } from "./timeline";

/**
 * One job's life, played on the shared clock while on screen: the stage list
 * (a progress bar on the phone) follows the chat beside it.
 */
export function FlowStory() {
  const { ref, tick } = useLoopClock<HTMLDivElement>();
  const { stages, chat } = HOW_IT_WORKS;
  const frame = howFrame(tick);
  const stageProps = { stages, active: frame.stage, progress: frame.progress, glide: frame.glide };
  return (
    <div
      ref={ref}
      className="mt-7 grid gap-3.5 md:mt-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-stretch md:gap-7 lg:grid-cols-[360px_minmax(0,1fr)]"
    >
      <StageList {...stageProps} />
      <StageProgress {...stageProps} />
      <figure className="min-w-0">
        <figcaption className="sr-only">{chat.description}</figcaption>
        <div aria-hidden="true">
          <ChatWindow chat={chat} frame={frame} />
        </div>
      </figure>
    </div>
  );
}
