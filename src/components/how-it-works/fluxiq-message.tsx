import type { ReactNode } from "react";

export type FluxiqMessageProps = {
  /** An alert message (a stopped run) is drawn in the accent. */
  alert?: boolean;
  children: ReactNode;
};

/** A message from FluxIQ in the chat: its avatar, then a card. */
export function FluxiqMessage({ alert, children }: FluxiqMessageProps) {
  const card = alert ? "border-amber-edge bg-[#17150f]" : "border-[#1f2125] bg-[#141518]";
  return (
    <div className="how-msg-in flex items-start gap-2.5">
      <span className="inline-flex size-6 flex-none items-center justify-center rounded-[7px] border border-amber-edge bg-amber-wash text-[11px] font-bold text-amber md:size-[30px] md:rounded-[9px] md:text-xs">
        F
      </span>
      <div
        className={`min-w-0 flex-1 rounded-[4px_16px_16px_16px] border px-3 py-2.5 text-[12.5px] leading-normal text-soft md:max-w-[86%] md:px-3.5 md:py-3 md:text-[13.5px] ${card}`}
      >
        {children}
      </div>
    </div>
  );
}
