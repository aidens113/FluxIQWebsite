import type { HowItWorksContent } from "@/content/how-it-works";
import { FluxiqMessage } from "./fluxiq-message";

export type FixCardProps = {
  chat: HowItWorksContent["chat"];
  pressed: boolean;
  kept: boolean;
};

/** Run 400 stops on a changed site; FluxIQ offers its tested fix, and it is kept. */
export function FixCard({ chat, pressed, kept }: FixCardProps) {
  const button = kept ? "bg-ok/16 text-ok" : "bg-amber text-ink";
  return (
    <FluxiqMessage alert>
      <p className="text-[12.5px] font-semibold text-amber">{chat.stopTitle}</p>
      <p className="mt-1">{chat.stopBody}</p>
      <div className="mt-2.5 flex items-center gap-2.5">
        <span
          className={`rounded-lg px-2.5 py-[5px] text-xs font-semibold transition-[transform,background-color,color] duration-300 md:px-3.5 md:py-1.5 md:text-[12.5px] ${button} ${pressed ? "scale-[.92]" : ""}`}
        >
          {kept ? chat.kept : chat.keep}
        </span>
        <span className="text-xs text-dim">{chat.fixCost}</span>
      </div>
    </FluxiqMessage>
  );
}
