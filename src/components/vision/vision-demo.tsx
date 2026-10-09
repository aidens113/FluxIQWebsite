"use client";

import { useLoopClock } from "@/components/ui/use-loop-clock";
import { VISION } from "@/content/vision";
import { DesktopApp } from "./app/desktop-app";
import { PhoneApp } from "./app/phone-app";
import { storyAt } from "./outcome-story";
import { RequestChat } from "./request-chat";

export type VisionDemoProps = {
  className?: string;
};

/**
 * Ask for an outcome, get the app: the request, FluxIQ's reply, and the
 * concept app in use, all on the shared 50 ms clock. The phone app shows below
 * `md` and the desktop app from `md` up; both read the same story frame.
 */
export function VisionDemo({ className }: VisionDemoProps) {
  const { ref, tick } = useLoopClock<HTMLElement>();
  const { chat, app, caption } = VISION;
  const frame = storyAt(tick, chat.prompt, chat.reply, app.pool);
  return (
    <figure ref={ref} className={`min-w-0 ${className ?? ""}`}>
      <RequestChat chat={chat} frame={frame} />
      <div aria-hidden="true">
        <PhoneApp app={app} frame={frame} className="md:hidden" />
        <DesktopApp app={app} frame={frame} className="max-md:hidden" />
      </div>
      <figcaption className="mt-2.5 text-[11.5px] text-dim md:mt-3">{caption}</figcaption>
    </figure>
  );
}
