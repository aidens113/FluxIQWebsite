import type { ReactNode } from "react";
import { LinkButton } from "@/components/ui/link-button";
import type { PartCardCopy } from "@/content/parts";

export type PartCardProps = {
  copy: PartCardCopy;
  /** The card's illustration: the framework's or the extension's mock. */
  children: ReactNode;
};

/** One half of FluxIQ: an illustration of it at work, then what it is and where to read more. */
export function PartCard({ copy, children }: PartCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-rule bg-panel">
      <div
        role="img"
        aria-label={copy.illustration}
        className="flex h-[176px] overflow-hidden bg-[#0f1012] px-3 pt-3 md:h-[284px] md:border-b md:border-rule md:px-[22px] md:pt-[22px]"
      >
        {children}
      </div>
      <div className="flex flex-1 flex-col items-start px-4 pt-3.5 pb-4 md:px-[30px] md:pt-7 md:pb-[30px]">
        <p className="font-mono text-[10.5px] text-dim uppercase md:text-xs">
          {copy.kicker}
          {copy.kickerTag ? (
            <>
              {" · "}
              <span className="text-amber md:hidden">{copy.kickerTagShort ?? copy.kickerTag}</span>
              <span className="hidden text-amber md:inline">{copy.kickerTag}</span>
            </>
          ) : null}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold md:mt-2.5 md:text-2xl md:tracking-[-0.02em]">{copy.title}</h3>
        <p className="mt-1 text-[13.5px] leading-normal text-muted md:mt-2.5 md:text-[15px] md:leading-[1.55]">
          <span className="md:hidden">{copy.bodyShort}</span>
          <span className="hidden md:inline">{copy.body}</span>
        </p>
        <div className="mt-4 md:mt-auto md:pt-[22px]">
          <LinkButton action={{ ...copy.link, variant: "ghost" }} />
        </div>
      </div>
    </article>
  );
}
