import type { CSSProperties } from "react";
import type { WireLabels } from "@/content/parts";
import { PARTS_PALETTE as C } from "./palette";
import type { PartsFrame } from "./timeline";
import "./wire.css";

export type ConnectorProps = {
  frame: PartsFrame;
  labels: WireLabels;
  /** `row` joins side-by-side cards (desktop); `column` joins stacked cards (phone). */
  orientation: "row" | "column";
};

// The two orientations' measures, from the desktop and phone boards.
const MEASURES = {
  row: { gap: 34, ball: 14, joined: 36, ring: 5, blur: 18, shield: 20 },
  column: { gap: 16, ball: 10, joined: 30, ring: 4, blur: 14, shield: 16 },
} as const;

const EASE = "cubic-bezier(.4,0,.2,1)";
const SPRING = "cubic-bezier(.3,1.4,.5,1)";

/**
 * The connection between the two cards: two balls on wires that slide
 * together when the code is approved and grow into one ball with a shield.
 * The wire is striped while something travels along it, and the stripes move
 * the way it travels. Decorative; the cards' illustrations carry the story.
 */
export function Connector({ frame, labels, orientation }: ConnectorProps) {
  const row = orientation === "row";
  const m = MEASURES[orientation];
  const { flow, phase } = frame;
  const live = phase === "live";
  const pairing = phase === "pairing";
  const flowColor = flow ? (flow.tone === "amber" ? C.amber : C.ok) : null;
  const flowLight = flow ? (flow.tone === "amber" ? C.amberLight : C.okLight) : null;
  const color = flowColor ?? (live ? C.ok : pairing ? C.amber : C.wireIdle);
  const glow = flowColor ?? C.ok;

  const wire = (end: "start" | "end"): CSSProperties => {
    const length = live ? "50%" : `calc(50% - ${m.gap}px)`;
    const forward = flow?.toBrowser ?? false;
    const keyframes = row
      ? forward
        ? "parts-wire-right"
        : "parts-wire-left"
      : forward
        ? "parts-wire-down"
        : "parts-wire-up";
    return {
      position: "absolute",
      borderRadius: 2,
      ...(row
        ? { top: "calc(50% - 2px)", height: 4, width: length, [end === "start" ? "left" : "right"]: 0 }
        : { left: "50%", marginLeft: -2, width: 4, height: length, [end === "start" ? "top" : "bottom"]: 0 }),
      background: flow
        ? `repeating-linear-gradient(${row ? 90 : 180}deg, ${flowColor} 0 12px, ${flowLight} 12px 18px)`
        : color,
      backgroundSize: row ? "36px 4px" : "4px 36px",
      animation: flow ? `${keyframes} .9s linear infinite` : "none",
      boxShadow: `0 0 12px ${flow ? `${flowColor}66` : "transparent"}`,
      transition: `${row ? "width" : "height"} .5s ${EASE}, box-shadow .4s`,
    };
  };

  const ball = (end: "start" | "end"): CSSProperties => {
    const size = live ? m.joined : m.ball;
    const at = live ? "50%" : `calc(50% ${end === "start" ? "-" : "+"} ${m.gap}px)`;
    const shadow = live
      ? `0 0 0 ${m.ring}px ${glow}1a, 0 0 ${m.blur}px ${glow}55`
      : pairing && row
        ? "0 0 12px rgba(245,184,61,.45)"
        : "none";
    return {
      position: "absolute",
      zIndex: 2,
      ...(row ? { top: "50%", left: at } : { left: "50%", top: at }),
      width: size,
      height: size,
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      boxSizing: "border-box",
      background: live ? C.okDeep : color,
      border: `2px solid ${live ? C.ok : color}`,
      boxShadow: shadow,
      transition: `${row ? "left" : "top"} .5s ${EASE}, width .45s ${SPRING} .2s, height .45s ${SPRING} .2s, background .4s, border-color .4s, box-shadow .4s`,
    };
  };

  return (
    <div
      aria-hidden="true"
      className={row ? "relative h-full min-h-[306px]" : "relative h-[76px]"}
      style={{ opacity: frame.connectorShown ? 1 : 0, transition: "opacity .5s ease" }}
    >
      <span style={wire("start")} />
      <span style={wire("end")} />
      <span style={ball("start")} />
      <span style={ball("end")} />
      <span
        className="absolute top-1/2 left-1/2 z-[3] flex"
        style={{
          color: C.ok,
          opacity: live ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${live ? 1 : 0.4})`,
          transition: "opacity .3s .45s, transform .4s cubic-bezier(.3,1.5,.5,1) .45s",
        }}
      >
        <svg
          aria-hidden="true"
          width={m.shield}
          height={m.shield}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 2.6v5.6c0 4.2-3 7.6-7 8.8-4-1.2-7-4.6-7-8.8V5.6z" />
          <path d="M9 12l2.2 2.2L15 10.4" />
        </svg>
      </span>
      {row ? (
        <span
          className="absolute left-1/2 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] whitespace-nowrap"
          style={{
            top: "calc(50% - 64px)",
            transform: "translateX(-50%)",
            border: `1px solid ${flowColor ?? C.edge}55`,
            color: flowColor ?? C.dim,
            opacity: flow ? 1 : 0,
            transition: "opacity .3s, color .3s",
          }}
        >
          {flow ? labels[flow.load] : ""}
        </span>
      ) : null}
    </div>
  );
}
