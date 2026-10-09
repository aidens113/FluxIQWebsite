import { LogoMark } from "@/components/ui/logo-mark";
import type { VisionContent } from "@/content/vision";
import { fadeStyle, type StoryFrame } from "./outcome-story";

export type RequestChatProps = {
  chat: VisionContent["chat"];
  frame: StoryFrame;
};

/**
 * The visitor's request and FluxIQ's reply. Each appears whole; the reply
 * waits behind thinking dots, in a bubble already sized for it. Assistive tech reads the
 * full text once, not the animation.
 */
export function RequestChat({ chat, frame }: RequestChatProps) {
  return (
    <div className="flex flex-col gap-2.5 md:gap-3">
      <p className="sr-only">{chat.prompt}</p>
      <p className="sr-only">
        {chat.replyLabel} {chat.reply}
      </p>
      <div aria-hidden="true" className="flex justify-end">
        <span
          style={{ visibility: frame.promptChars > 0 ? "visible" : "hidden" }}
          className="min-h-5 max-w-[86%] rounded-[16px_16px_4px_16px] border border-edge bg-[#1c1d21] px-3.5 py-[11px] text-[14.5px] leading-[1.45] md:max-w-[80%] md:rounded-[18px_18px_4px_18px] md:px-4 md:py-3 md:text-[15px]"
        >
          {chat.prompt.slice(0, frame.promptChars)}
        </span>
      </div>
      <div aria-hidden="true" className="flex items-start gap-2.5" style={fadeStyle(frame.replyShown)}>
        <span className="inline-flex size-[26px] flex-none items-center justify-center rounded-lg border border-amber-edge bg-amber-wash md:size-[30px] md:rounded-[9px]">
          <LogoMark className="size-[13px] md:size-[15px]" />
        </span>
        <span className="relative max-w-[86%] rounded-[4px_16px_16px_16px] border border-rule bg-[#141518] px-3.5 py-[11px] text-[14.5px] leading-[1.45] text-soft md:max-w-[80%] md:rounded-[4px_18px_18px_18px] md:px-4 md:py-3 md:text-[15px]">
          {/* The whole reply always holds its space, so nothing below jumps and no gap is reserved. */}
          <span style={{ visibility: frame.replyChars > 0 ? "visible" : "hidden" }}>{chat.reply}</span>
          {frame.dotsShown ? (
            <span className="absolute top-[11px] left-3.5 inline-flex animate-pulse gap-1 text-dim md:top-3 md:left-4">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}
