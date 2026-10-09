// Shared inline styles for the pairing illustration's moving parts.
import type { CSSProperties } from "react";

/** Fades and lifts a view in when `on`, and drops it out otherwise. */
export const fadeStyle = (on: boolean, dy = 8): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: `translateY(${on ? 0 : dy}px)`,
  transition: "opacity .35s, transform .35s",
});

/** A button pressing in, with a ring of `color` around the press. */
export const pressStyle = (pressed: boolean, glow: boolean, color: string): CSSProperties => ({
  transform: `scale(${pressed ? 0.92 : 1})`,
  boxShadow: glow ? `0 0 0 3px ${color}55` : "none",
  transition: "transform .15s, box-shadow .2s",
});
