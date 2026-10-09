"use client";

import { type RefObject, useEffect, useState } from "react";
import { AIM, type AimKey } from "../outcome-story";

export type PointerProps = {
  /** The positioned card the pointer moves inside; aimed elements carry `data-aim`. */
  cardRef: RefObject<HTMLDivElement | null>;
  aim: AimKey;
  shown: boolean;
  click: boolean;
  /** `arrow` is the desktop mouse pointer; `finger` is the phone's fingertip. */
  kind: "arrow" | "finger";
};

type Point = { x: number; y: number };

const EASE = "cubic-bezier(.4,0,.2,1)";

/**
 * Where an aimed element sits in the card, from layout offsets rather than
 * the board's pixels, so the pointer lands on the real sidebar item or tab at
 * any width. Offsets ignore transforms, so a view that is still fading in
 * does not pull the pointer off its target.
 */
function measure(card: HTMLElement, aim: AimKey, centred: boolean): Point | null {
  const target = card.querySelector<HTMLElement>(`[data-aim="${aim}"]`);
  if (!target) return null;
  let x = 0;
  let y = 0;
  let el: HTMLElement | null = target;
  while (el && el !== card) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  if (el !== card) return null;
  const nav = aim.startsWith("nav-");
  const { fx, fy } = centred && nav ? { fx: 0.5, fy: 0.5 } : AIM[aim];
  return { x: x + target.offsetWidth * fx, y: y + target.offsetHeight * fy };
}

/** The visitor's stand-in: a pointer (desktop) or fingertip (phone) that moves between targets and clicks. */
export function Pointer({ cardRef, aim, shown, click, kind }: PointerProps) {
  const [at, setAt] = useState<Point | null>(null);
  const finger = kind === "finger";

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const update = () => setAt(measure(card, aim, finger));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    return () => observer.disconnect();
  }, [cardRef, aim, finger]);

  if (!at) return null;
  const ring = finger ? 28 : 24;
  const size = finger ? 22 : 18;

  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[5] origin-top-left drop-shadow-[0_2px_4px_rgba(0,0,0,.6)]"
        style={{
          left: finger ? at.x - size / 2 : at.x,
          top: finger ? at.y - size / 2 : at.y,
          opacity: shown ? 1 : 0,
          transform: `scale(${click ? (finger ? 0.8 : 0.82) : 1})`,
          transformOrigin: finger ? "50% 50%" : "0 0",
          transition: `left .7s ${EASE}, top .7s ${EASE}, transform .15s, opacity .3s`,
        }}
      >
        {finger ? (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="rgba(232,230,227,.22)"
              stroke="rgba(232,230,227,.8)"
              strokeWidth="1.5"
            />
          </svg>
        ) : (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3l14 8-6 1.5L10 19z" fill="#e8e6e3" stroke="#0c0d0f" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[4] rounded-full border-2 border-amber"
        style={{
          left: at.x - ring / 2,
          top: at.y - ring / 2,
          width: ring,
          height: ring,
          opacity: click && shown ? 0.9 : 0,
          transform: `scale(${click ? 1.4 : 0.5})`,
          transition: "opacity .3s, transform .3s",
        }}
      />
    </>
  );
}
