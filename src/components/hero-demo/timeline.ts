// Pacing for the hero's example widgets. Steps last as long as their action
// takes rather than a fixed clock: typing as long as its letters, a click long
// enough to press and show its result, reading as long as the row sweep, chat
// lines in proportion to their length, endings a little longer.
import { IT_ADAPTS } from "@/content/hero-demo/panel";

/**
 * One dial for the whole demo's pace. Every duration in the demo, step
 * lengths, typing, cursor travel, clicks, and the row sweep, is written at
 * the original pace and scaled by this, so they stay in step with each other.
 */
export const PACE = 0.7;
export const paced = (ms: number) => Math.round(ms * PACE);
/**
 * A second dial for how long the visual effects run (ripples, the press,
 * rows sliding in, the read sweep), independent of the step timing: the
 * steps and every delay stay at PACE, the effects play longer than that.
 */
export const ANIMATION_STRETCH = 1.4;
export const animated = (ms: number) => Math.round(ms * PACE * ANIMATION_STRETCH);

// Click timing at the original pace.
const RAW_TRAVEL = 700;
const RAW_AIM = 450;
const RAW_AFTER_USER_CLICK = RAW_TRAVEL + 400;

/** How long the person's cursor takes to reach a target. */
export const TRAVEL_MS = paced(RAW_TRAVEL);
/** How long FluxIQ aims (outline and crosshair settle) before it clicks. */
export const AIM_MS = paced(RAW_AIM);
/** When a click's result appears: after the press, then a short gap. */
const AFTER_USER_CLICK = paced(RAW_AFTER_USER_CLICK);
const AFTER_AUTO_CLICK = paced(RAW_AIM + 450);
/** The read sweep: rows light up this far apart, each sweep lasting SWEEP_MS. */
export const ROW_STAGGER_MS = paced(240);
// The sweep ends before the read step does, so the rows never cut it short.
export const SWEEP_MS = animated(560);

const BEAT = 450;
const CLICK = 1000;
const READ = 5 * 240 + 650;
const END = 2800;
/**
 * The gap before key `index` of `text`, typed at an average `speed`: a person
 * typing quickly, not a metronome. Keys land at uneven gaps, some spaces get
 * a short hesitation, punctuation a longer one. Deterministic, so a step's
 * length (the sum of its gaps) always matches what the player types.
 */
export function keyGap(text: string, index: number, speed: number): number {
  const noise = Math.sin((index + text.length * 7) * 12.9898) * 43758.5453;
  const r = noise - Math.floor(noise);
  let gap = speed * (0.45 + r * 0.9);
  const previous = text[index - 1];
  if (previous === " " && r > 0.55) gap += speed * 1.6;
  if (previous === "," || previous === "." || previous === "!" || previous === "?") gap += speed * 4;
  if (r > 0.94) gap += speed * 2.5;
  return Math.round(gap);
}
const typingMs = (text: string, speed: number) =>
  Array.from(text, (_, i) => keyGap(text, i, speed)).reduce((a, b) => a + b, 0);
const typing = (text: string, speed: number) => typingMs(text, speed) + BEAT;
const line = (text: string) => Math.min(2400, Math.max(900, 500 + text.length * 22));

// Typing, a key at a time: the average gap per key at the original pace.
const RAW_TYPING = { search: 85, recorded: 95 };
export const TYPING_SPEED = {
  search: paced(RAW_TYPING.search),
  recorded: paced(RAW_TYPING.recorded),
};

/** Each example's step durations, in order, written at the original pace. */
const RAW_STEP_MS: number[][] = [
  // Tell it: empty, the ask waits in the composer (it appears whole), plan, type, click Search, click Calgary, read, settle, done
  [500, 900, 1100, typing("roofing", RAW_TYPING.search) + 250, CLICK + 500, CLICK + 600, READ, 650, END],
  // Record it: click record, click the box, type, click Search, click Calgary, stop, build, saved
  [
    // The click lands; a short beat to read "I'm recording", then on.
    RAW_AFTER_USER_CLICK + 1000,
    CLICK + 700,
    typing("roofing", RAW_TYPING.recorded),
    CLICK + 850,
    CLICK + 700,
    CLICK + 700,
    1600,
    END,
  ],
  // It adapts: type, Search fails, scan, found and click, Calgary, read, finished, run 2 click, read, done
  [
    typing("roofing", RAW_TYPING.search),
    line(IT_ADAPTS.moved) + 400,
    1900,
    CLICK + 800,
    CLICK + 600,
    READ,
    line(IT_ADAPTS.finished),
    CLICK + 500,
    READ,
    END,
  ],
];

/** Each example's step durations, in order, at the demo's pace. */
export const STEP_MS: number[][] = RAW_STEP_MS.map((steps) => steps.map(paced));

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
  if (tab === 0 && step === 3) return { key: "chat-search", text: "roofing", speed: TYPING_SPEED.search };
  if (tab === 1 && step === 2) return { key: "recorded", text: "roofing", speed: TYPING_SPEED.recorded };
  if (tab === 2 && step === 0) return { key: "replay", text: "roofing", speed: TYPING_SPEED.search };
  return null;
}

/**
 * A quiet step: nothing is happening on the example site (no outline at
 * work, no cursor, no typing) and it is neither an example's first step nor
 * its last, and not the moment the request waits to send. FluxIQ's newest
 * message pulses only then, so the eye always has
 * somewhere to go without every card competing for it.
 */
export function isQuiet(tab: number, step: number, siteBusy: boolean): boolean {
  const sending = tab === 0 && step === 1;
  return !siteBusy && !sending && step > 0 && step < stepCount(tab) - 1 && typingSpec(tab, step) === null;
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
