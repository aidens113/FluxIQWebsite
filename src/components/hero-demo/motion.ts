// Shared motion values for the example widgets' components.
import type { CSSProperties } from "react";

export const RIPPLE_GAP_MS = 160;

/** A control pressing in, at the moment of a click. */
export const pressStyle = (delay: number): CSSProperties => ({ animation: `demo-press 420ms ${delay}ms ease both` });
