import type { HowItWorksContent } from "@/content/how-it-works";
import { FluxiqMessage } from "./fluxiq-message";

export type AskCardProps = {
  chat: HowItWorksContent["chat"];
  ring: boolean;
  pressed: boolean;
  allowed: boolean;
};

/** FluxIQ asks before the one step that sends something; Allow is pressed. */
export function AskCard({ chat, ring, pressed, allowed }: AskCardProps) {
  return (
    <FluxiqMessage>
      <p>{chat.permission}</p>
      {allowed ? (
        <p className="mt-2.5 text-[12.5px] text-ok">{chat.allowed}</p>
      ) : (
        <div className="mt-2.5 flex gap-2">
          <span
            className={`rounded-lg bg-amber px-2.5 py-[5px] text-xs font-semibold text-ink transition-[transform,box-shadow] duration-150 md:px-3.5 md:py-1.5 md:text-[12.5px] ${pressed ? "scale-[.92]" : ""} ${ring ? "shadow-[0_0_0_3px_rgba(245,184,61,.3)]" : ""}`}
          >
            {chat.allow}
          </span>
          <span className="rounded-lg border border-edge px-2.5 py-[5px] text-xs text-muted md:px-3.5 md:py-1.5 md:text-[12.5px]">
            {chat.askEachTime}
          </span>
        </div>
      )}
    </FluxiqMessage>
  );
}
