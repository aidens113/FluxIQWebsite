// Shared motion values for the example widgets' components.
import type { CSSProperties } from "react";
import { paced } from "./timeline";

export const RIPPLE_GAP_MS = paced(160);

/** A control pressing in, at the moment of a click. */
export const pressStyle = (delay: number): CSSProperties => ({
  animation: `demo-press ${paced(420)}ms ${delay}ms ease both`,
});
