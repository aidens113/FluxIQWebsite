import { ClickRipple } from "./click-ripple";
import { KIND, READ_BLUE } from "./palette";
import type { Target, TargetName } from "./scenes/scene";
import { AIM_MS, TRAVEL_MS } from "./timeline";

export type HighlightProps = {
  /** The step's target; the highlight shows only when it names this element. */
  target: Target | null;
  name: TargetName;
  redesigned: boolean;
  tick: number;
};

/**
 * The outline, label, and click effect on an element of the example site. It
 * lives inside the element it marks, so it always lines up. The results list
 * takes no outline (its rows light up instead), only a label on its count line.
 */
export function Highlight({ target, name, redesigned, tick }: HighlightProps) {
  const on = target?.name === name;
  const kind = on ? target.kind : "auto";
  const style = KIND[kind];
  const listOnly = name === "results";
  const userClick = on && kind === "user" && target.click;
  const pressAt = kind === "user" ? TRAVEL_MS : AIM_MS;

  // Labels sit where they cover nothing: on the count line for the results,
  // below the Calgary chip, right-aligned on the Search button in its first
  // layout, otherwise above the element's left edge.
  const place = listOnly
    ? { right: 5, top: 3 }
    : name === "calgary"
      ? { left: -2, top: "calc(100% + 5px)" }
      : name === "button" && !redesigned
        ? { right: -2, bottom: "calc(100% + 5px)" }
        : { left: -2, bottom: "calc(100% + 5px)" };

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[5px] z-[4]"
      style={
        listOnly
          ? { opacity: on ? 1 : 0, transition: "opacity 250ms ease" }
          : {
              borderRadius: 12,
              border: `2px ${kind === "user" ? "dashed" : "solid"} ${style.color}`,
              background: style.wash,
              boxShadow: `0 0 0 4px ${style.glow}`,
              opacity: on ? 1 : 0,
              // The person's outline waits for their cursor to arrive.
              transition: `opacity 250ms ease ${userClick ? TRAVEL_MS : 0}ms`,
              animation: on && style.pulse !== "none" ? `${style.pulse} ease-in-out infinite` : undefined,
            }
      }
    >
      {on && target.click && <ClickRipple key={tick} color={style.color} delay={pressAt} crosshair={kind !== "user"} />}
      {on && (
        <span
          className="absolute rounded-[5px] px-[7px] py-[2px] font-sans text-[10.5px] leading-[1.4] font-semibold whitespace-nowrap"
          style={{
            ...place,
            background: kind === "done" ? style.color : listOnly ? READ_BLUE : style.color,
            color: kind === "auto" || kind === "done" ? "#0c0d0f" : "#ffffff",
            transition: "background 300ms ease",
          }}
        >
          {kind !== "user" && kind !== "done" && (
            <span
              className="mr-[5px] inline-block size-[6px] rounded-full align-[1px]"
              style={{
                background: kind === "auto" ? "#0c0d0f" : "#ffffff",
                animation: "demo-blink 1s ease-in-out infinite",
              }}
            />
          )}
          {target.tag}
        </span>
      )}
    </span>
  );
}
