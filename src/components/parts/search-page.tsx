import type { BrowserMockCopy } from "@/content/parts";
import { pressStyle } from "./motion";
import { PARTS_PALETTE as C } from "./palette";
import type { PartsFrame } from "./timeline";

export type SearchPageProps = {
  frame: PartsFrame;
  copy: BrowserMockCopy;
};

/** A real site's search page, where the extension types the query, clicks Search, and reads the list. */
export function SearchPage({ frame, copy }: SearchPageProps) {
  return (
    <div className="min-w-0 flex-1 bg-[#f6f7f9] p-2.5 text-[10px] text-[#1d232b] md:p-3 md:text-[10.5px]">
      <div className="flex gap-[5px] md:gap-1.5">
        <span className="flex h-[22px] min-w-0 flex-1 items-center rounded-md border border-[#d3d8de] bg-white px-1.5 md:px-[7px]">
          {copy.query.slice(0, frame.typed)}
          {frame.typed > 0 && frame.typed < copy.query.length && (
            <span className="ml-px inline-block h-3 w-px animate-pulse bg-[#1d232b]" />
          )}
        </span>
        <span
          className="flex h-[22px] items-center rounded-md bg-[#1d232b] px-[9px] text-white"
          style={pressStyle(frame.search.pressed, frame.search.glow, C.amber)}
        >
          {copy.search}
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-[5px] md:mt-2.5">
        {copy.results.map((name, i) => {
          const state = frame.results[i];
          return (
            <span
              key={name}
              className="flex h-[22px] items-center overflow-hidden rounded-md border border-[#e3e7ec] px-2 text-[9.5px] font-semibold whitespace-nowrap md:h-6 md:text-[10px]"
              style={{
                color: state?.shown ? "#1d232b" : "transparent",
                background: state?.reading ? "#fff3d6" : "#fff",
                transition: "color .3s, background .4s",
              }}
            >
              <span className="md:hidden">{copy.resultsShort[i] ?? name}</span>
              <span className="hidden md:inline">{name}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
