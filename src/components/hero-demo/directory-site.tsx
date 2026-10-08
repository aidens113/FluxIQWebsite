import { DIRECTORY } from "@/content/hero-demo/directory";
import { Highlight } from "./highlight";
import { pressStyle } from "./motion";
import { ResultsList } from "./results-list";
import type { SiteScene } from "./scenes/scene";
import { AIM_MS, TRAVEL_MS } from "./timeline";

export type SiteMotion = {
  /** True on a step where the site loads something after the click. */
  loading: boolean;
  /** True from the step's start until its click lands. */
  pending: boolean;
  /** When the press happens within the step. */
  pressAt: number;
  /** How long the loading bar runs after the press. */
  loadMs: number;
};

export type DirectorySiteProps = {
  site: SiteScene;
  motion: SiteMotion;
  compact: boolean;
  tick: number;
};

/**
 * The example website: a lead directory with a search box, city filters, and
 * results. Nothing reacts before a press: a thin bar runs under the address
 * bar and the results dim from the moment of the click until the new content
 * arrives.
 */
export function DirectorySite({ site, motion, compact, tick }: DirectorySiteProps) {
  const { target, redesigned } = site;
  const press = target?.click ? target.name : null;
  const pressDelay = target?.kind === "user" ? TRAVEL_MS : AIM_MS;
  const ease = "all 500ms ease";
  const dim = motion.pending ? `${motion.pressAt}ms` : "0ms";
  const reading = target?.name === "results" && target.kind === "auto";

  return (
    <>
      <div className="flex h-[34px] items-center gap-1.5 border-b border-[#d9dde3] bg-[#e9ebef] px-3">
        <span className="size-[9px] rounded-full bg-[#f26b5b]" />
        <span className="size-[9px] rounded-full bg-[#f5bf4f]" />
        <span className="size-[9px] rounded-full bg-[#5ec26a]" />
        <span className="ml-3.5 flex h-5 flex-1 items-center rounded-md bg-white px-2.5 text-[10.5px] text-[#6b7480]">
          {DIRECTORY.url}
        </span>
      </div>
      <div className="relative z-[5] h-0">
        {motion.loading && (
          <span
            key={tick}
            className="absolute top-0 left-0 h-0.5 bg-[#5e9eea] shadow-[0_0_6px_rgba(94,158,234,0.6)]"
            style={{ animation: `demo-load ${motion.loadMs}ms ${motion.pressAt}ms ease-out both` }}
          />
        )}
      </div>
      <div
        className="flex h-11 items-center justify-between px-4"
        style={{
          transition: ease,
          background: redesigned ? "#2a1f4f" : "#ffffff",
          color: redesigned ? "#ffffff" : "#1d232b",
          borderBottom: redesigned ? "1px solid transparent" : "1px solid #e3e7ec",
        }}
      >
        <span className="flex items-center gap-2 text-[13.5px] font-bold tracking-[-0.01em]">
          <span
            className="inline-flex size-5 items-center justify-center rounded-[5px] text-[11px] text-white"
            style={{ transition: ease, background: redesigned ? "#8b6cff" : "#1d232b" }}
          >
            {DIRECTORY.initial}
          </span>
          {DIRECTORY.name}
        </span>
        <span className="text-[11px] opacity-65">{DIRECTORY.nav}</span>
      </div>
      <div
        className="relative mx-4 mt-3.5 mb-2.5 flex gap-2"
        style={{ transition: ease, flexDirection: redesigned ? "row-reverse" : "row" }}
      >
        <Highlight target={target} name="row" redesigned={redesigned} tick={tick} />
        <div
          className="relative flex h-[34px] flex-1 items-center rounded-lg border border-[#d3d8de] bg-white px-[11px] text-[12.5px] text-[#1d232b]"
          style={press === "search" ? pressStyle(pressDelay) : undefined}
        >
          {site.query}
          <span
            className="ml-px inline-block h-3.5 w-px bg-[#1d232b]"
            style={site.caret ? { animation: "demo-caret 1s steps(1) infinite" } : { opacity: 0 }}
          />
          {!site.query && <span className="text-[#9aa3ad]">{DIRECTORY.placeholder}</span>}
          <Highlight target={target} name="search" redesigned={redesigned} tick={tick} />
        </div>
        <span
          className="relative inline-flex h-[34px] items-center px-4 text-[12.5px] font-semibold text-white"
          style={{
            transition: ease,
            borderRadius: redesigned ? 3 : 8,
            background: redesigned ? "#7a5cf0" : "#1d232b",
            ...(press === "button" ? pressStyle(pressDelay) : {}),
          }}
        >
          {DIRECTORY.button}
          <Highlight target={target} name="button" redesigned={redesigned} tick={tick} />
        </span>
      </div>
      <div className="flex gap-1.5 px-4 pb-3">
        {DIRECTORY.chips.map((chip) => {
          const city = chip === DIRECTORY.city;
          const active = city && site.filtered;
          return (
            <span
              key={chip}
              className="relative px-[11px] py-[5px] text-[11px] font-medium"
              style={{
                transition: "all 260ms ease",
                borderRadius: redesigned ? 3 : 999,
                background: active ? "#1d232b" : "#ffffff",
                color: active ? "#ffffff" : "#3d4652",
                border: `1px solid ${active ? "#1d232b" : "#d3d8de"}`,
                ...(city && press === "calgary" ? pressStyle(pressDelay) : {}),
              }}
            >
              {chip}
              {city && <Highlight target={target} name="calgary" redesigned={redesigned} tick={tick} />}
            </span>
          );
        })}
      </div>
      <div
        style={{
          // On a phone the list is cut off at the bottom of the site with a
          // fade, like a page that scrolls.
          ...(compact
            ? { overflow: "hidden", maxHeight: 270, maskImage: "linear-gradient(to bottom, #000 78%, transparent)" }
            : {}),
          transition: `opacity 200ms ease ${dim}, filter 200ms ease ${dim}`,
          opacity: motion.pending ? 0.4 : 1,
          filter: motion.pending ? "blur(1px)" : "none",
        }}
      >
        {site.rows ? (
          <ResultsList site={site} reading={reading} tick={tick} />
        ) : (
          <div className="mx-4 mt-9 text-center">
            <p className="text-[13px] font-semibold text-[#3d4652]">{DIRECTORY.emptyTitle}</p>
            <p className="mt-1.5 text-[11.5px] text-[#8a929c]">{DIRECTORY.emptyBody}</p>
          </div>
        )}
      </div>
    </>
  );
}
