// Pacing for the hero's example widgets. Steps last as long as their action
// takes rather than a fixed clock: typing as long as its letters, a click long
// enough to press and show its result, reading as long as the row sweep, chat
// lines in proportion to their length, endings a little longer.
import { DEMO_EXAMPLES } from "@/content/hero-demo/examples";
import { IT_ADAPTS, TELL_IT } from "@/content/hero-demo/panel";

/** How long the person's cursor takes to reach a target. */
export const TRAVEL_MS = 700;
/** How long FluxIQ aims (outline and crosshair settle) before it clicks. */
export const AIM_MS = 450;
/** The press itself, then the gap before its result appears. */
const AFTER_PRESS_MS = 450;
const AFTER_USER_CLICK = TRAVEL_MS + 400;
const AFTER_AUTO_CLICK = AIM_MS + AFTER_PRESS_MS;

const BEAT = 450;
const CLICK = 1000;
const READ = 5 * 240 + 650;
const END = 2800;
const typing = (text: string, speed: number) => text.length * speed + BEAT;
const line = (text: string) => Math.min(2400, Math.max(900, 500 + text.length * 22));

export const TYPING_SPEED = { ask: 42, search: 110, recorded: 120 };

/** Each example's step durations, in order. */
export const STEP_MS: number[][] = [
  // Tell it: empty, type the ask, plan, type, click Search, click Calgary, read, settle, done
  [
    500,
    typing(TELL_IT.ask, TYPING_SPEED.ask),
    1100,
    typing("roofing", TYPING_SPEED.search) + 250,
    CLICK + 500,
    CLICK + 600,
    READ,
    650,
    END,
  ],
  // Record it: click record, click the box, type, click Search, click Calgary, stop, build, saved
  [
    // The click lands at 1.1 s; a short beat to read "I'm recording", then on.
    AFTER_USER_CLICK + 1000,
    CLICK + 700,
    typing("roofing", TYPING_SPEED.recorded),
    CLICK + 850,
    CLICK + 700,
    CLICK + 700,
    1600,
    END,
  ],
  // It adapts: type, Search fails, scan, found and click, Calgary, read, finished, run 2 click, read, done
  [
    typing("roofing", TYPING_SPEED.search),
    line(IT_ADAPTS.moved) + 400,
    1900,
    Math.max(CLICK + 800, line(IT_ADAPTS.fixed)),
    CLICK + 600,
    READ,
    line(IT_ADAPTS.finished),
    CLICK + 500,
    READ,
    END,
  ],
];

/** The example shown on a tab. */
export const exampleOf = (tab: number) => DEMO_EXAMPLES[tab] ?? DEMO_EXAMPLES[0];
export const stepsOf = (tab: number): number[] => STEP_MS[tab] ?? [];
export const stepCount = (tab: number) => stepsOf(tab).length;
export const stepMs = (tab: number, step: number) => stepsOf(tab)[step] ?? 1200;

/**
 * A click step has two phases: until the click lands only the action shows;
 * once it lands, everything it causes appears together. Zero means the step
 * has no click to wait for.
 */
export function landDelay(tab: number, step: number): number {
  if (tab === 0 && (step === 4 || step === 5)) return AFTER_AUTO_CLICK;
  if (tab === 1 && step <= 5 && step !== 2) return AFTER_USER_CLICK;
  if (tab === 2 && (step === 3 || step === 4 || step === 7)) return AFTER_AUTO_CLICK;
  return 0;
}

/** Steps where the example site loads something new after the click. */
export function loads(tab: number, step: number): boolean {
  return (
    (tab === 0 && (step === 4 || step === 5)) ||
    (tab === 1 && (step === 3 || step === 4)) ||
    (tab === 2 && (step === 3 || step === 4 || step === 7))
  );
}

/** When the press happens within a step: the person's cursor travels, FluxIQ aims. */
export const pressAt = (tab: number) => (tab === 1 ? TRAVEL_MS : AIM_MS);

export type TypingSpec = { key: string; text: string; speed: number };

/** The typing moment of a step, if it has one. */
export function typingSpec(tab: number, step: number): TypingSpec | null {
  if (tab === 0 && step === 1) return { key: "ask", text: TELL_IT.ask, speed: TYPING_SPEED.ask };
  if (tab === 0 && step === 3) return { key: "chat-search", text: "roofing", speed: TYPING_SPEED.search };
  if (tab === 1 && step === 2) return { key: "recorded", text: "roofing", speed: TYPING_SPEED.recorded };
  if (tab === 2 && step === 0) return { key: "replay", text: "roofing", speed: TYPING_SPEED.search };
  return null;
}

/**
 * A quiet step: nothing is happening on the example site (no outline at
 * work, no cursor, no typing) and it is neither an example's first step nor
 * its last. FluxIQ's newest message pulses only then, so the eye always has
 * somewhere to go without every card competing for it.
 */
export function isQuiet(tab: number, step: number, siteBusy: boolean): boolean {
  return !siteBusy && step > 0 && step < stepCount(tab) - 1 && typingSpec(tab, step) === null;
}

/**
 * On a phone the widget shows one view at a time and follows the action: the
 * panel while the person talks to FluxIQ or uses its controls, the site
 * otherwise.
 */
export function focusOf(tab: number, step: number): "site" | "panel" {
  const p = "panel" as const;
  const s = "site" as const;
  const map = [
    [p, p, p, s, s, s, s, s, p],
    [p, s, s, s, s, p, p, p],
    [s, s, s, s, s, s, p, s, s, p],
  ][tab] ?? [s];
  return map[Math.min(step, map.length - 1)] ?? s;
}
