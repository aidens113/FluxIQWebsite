import type { ConceptFlowState, ConceptLead, ConceptLeadStatus } from "@/content/vision";

/*
 * The "Where it's going" story as a pure function of the 50 ms clock, ported
 * from the approved v5 board (HomeV4.dc.html `app(t, fine)`). One pass is 500
 * fine ticks (25 s): the request reveals, FluxIQ shows typing dots and
 * answers, the app rises in at story tick 14, and then someone uses it for 84
 * story ticks. Story ticks are 250 ms (five fine ticks). Counters and Flow run
 * counts keep climbing across passes. Every number here is invented.
 */

export const PASS = 500;
/** How much faster than the shared clock the story plays (the user asked for a quicker app). */
export const STORY_SPEED = 1.6;
const INTRO = 16;
const CARD_AT = 14;

/** Places the pointer can rest. Each names an element marked `data-aim`. */
export type AimKey = "nav-0" | "nav-1" | "nav-2" | "chart" | "lead-0" | "lead-3" | "flow-2" | "flow-3";

/**
 * Where inside each aimed element the pointer rests, as fractions of its
 * width and height, so it follows the layout at any width. The nav entries are
 * the desktop sidebar's; the phone's tabs aim at their centres instead.
 */
export const AIM: Readonly<Record<AimKey, { fx: number; fy: number }>> = {
  "nav-0": { fx: 0.4, fy: 0.5 },
  "nav-1": { fx: 0.4, fy: 0.5 },
  "nav-2": { fx: 0.4, fy: 0.5 },
  chart: { fx: 0.8, fy: 0.55 },
  "lead-0": { fx: 0.45, fy: 0.6 },
  "lead-3": { fx: 0.7, fy: 0.5 },
  "flow-2": { fx: 0.6, fy: 0.15 },
  "flow-3": { fx: 0.6, fy: 0.35 },
};

export type AppView = 0 | 1 | 2;

export type CounterFrame = { value: number; note: number; hot: boolean };

export type LeadFrame = ConceptLead & {
  status: ConceptLeadStatus;
  /** False while the newest lead has not been scored yet. */
  scored: boolean;
  /** The newest lead, flashed as it arrives. */
  flash: boolean;
  /** The newest lead before it arrives on the Leads view. */
  hidden: boolean;
};

export type FlowFrame = {
  runs: number;
  state: ConceptFlowState;
  /** The cost of this pass, in dollars. */
  cost: number;
  /** True when the cost was paid once to fix the Flow. */
  once: boolean;
};

export type StoryFrame = {
  /** How many characters of the request and the reply show. */
  promptChars: number;
  replyChars: number;
  replyShown: boolean;
  dotsShown: boolean;
  appShown: boolean;
  pointerShown: boolean;
  view: AppView;
  aim: AimKey;
  click: boolean;
  counters: readonly CounterFrame[];
  /** Thirty days of new leads; the last bar is today, growing as leads arrive. */
  bars: readonly number[];
  today: number;
  total: number;
  /** The three newest leads, for the pipeline view. */
  top: readonly ConceptLead[];
  /** The seven newest leads, for the Leads view. */
  leads: readonly LeadFrame[];
  flows: readonly FlowFrame[];
  /** True while the refresh Flow is being fixed: the Flows nav item shows a dot. */
  fixing: boolean;
  spend: number;
  spendHot: boolean;
  saved: number;
};

const BARS = [
  12, 15, 11, 18, 16, 20, 17, 22, 19, 24, 21, 18, 25, 23, 27, 22, 26, 29, 24, 28, 31, 27, 30, 33, 29, 32, 35, 31, 34,
];
/** The tallest bar the chart has room for. */
export const BAR_MAX = 40;

/** The statuses of the older leads, newest first; the newest lead's status moves. */
const OLDER_STATUS: readonly ConceptLeadStatus[] = [
  "replied",
  "contacted",
  "qualified",
  "contacted",
  "replied",
  "qualified",
  "contacted",
];

/** Each Flow's run count at the start and how many story ticks pass between runs. */
const FLOW_RUNS: readonly { base: number; every: number }[] = [
  { base: 212, every: 8 },
  { base: 198, every: 9 },
  { base: 187, every: 11 },
  { base: 41, every: 40 },
];

/** The pointer's path through one pass, by story tick after the intro. */
function aimAt(p: number): AimKey {
  if (p >= 20 && p < 28) return "nav-1";
  if (p >= 28 && p < 38) return "lead-0";
  if (p >= 38 && p < 50) return "lead-3";
  if (p >= 50 && p < 56) return "nav-2";
  if (p >= 56 && p < 80) return p < 62 ? "flow-2" : "flow-3";
  if (p >= 80) return "nav-0";
  return "chart";
}

/** The whole story at one fine tick of the clock. */
export function storyAt(fine: number, prompt: string, reply: string, pool: readonly ConceptLead[]): StoryFrame {
  const t = Math.floor(fine / 5);
  const inPass = fine % PASS;
  const raw = Math.floor(inPass / 5);
  const intro = raw < INTRO;
  const pass = Math.floor(fine / PASS);
  const p = intro ? 0 : raw - INTRO;
  const view: AppView = p < 28 ? 0 : p < 56 ? 1 : 2;

  // No typing: the request appears whole, then FluxIQ's answer appears whole
  // after a short "thinking" pause.
  const promptChars = inPass >= 5 ? prompt.length : 0;
  const replyChars = inPass >= 42 ? reply.length : 0;

  const lead = (k: number) => pool[((k % pool.length) + pool.length) % pool.length] as ConceptLead;

  const fixing = view === 2 && p >= 62 && p < 70;
  const fixed = view === 2 && p >= 70;
  const spend = 0.42 + (p >= 62 ? 0.05 : 0);

  const discovered = 1284 + Math.floor(t / 3);
  const counters: CounterFrame[] = [
    { value: discovered, note: 96 + Math.floor(t / 3), hot: t % 3 === 0 },
    { value: 812 + Math.floor(t / 6), note: 71 + Math.floor(t / 6), hot: t % 6 === 0 },
    { value: 236 + Math.floor(t / 16), note: 18 + Math.floor(t / 16), hot: t % 16 === 0 },
    { value: 58 + Math.floor(t / 40), note: 12 + Math.floor(t / 80), hot: false },
  ];

  const today = 8 + Math.floor(p / 3);
  const newStatus: ConceptLeadStatus = p < 40 ? "new" : p < 46 ? "enriched" : "qualified";
  const leads: LeadFrame[] = OLDER_STATUS.map((older, back) => {
    const newest = back === 0;
    return {
      ...lead(pass - back),
      status: newest ? newStatus : older,
      scored: !(newest && p < 46),
      flash: newest && p >= 32 && p < 38,
      hidden: newest && p < 32 && view === 1,
    };
  });

  const flows: FlowFrame[] = FLOW_RUNS.map(({ base, every }, i) => {
    const runs = base + Math.floor(t / every);
    if (i === 3) {
      if (fixing) return { runs, state: "fixing", cost: 0.05, once: false };
      if (fixed) return { runs, state: "fixed", cost: 0.05, once: true };
      return { runs, state: "ok", cost: 0, once: false };
    }
    const busy = t % every < 3;
    return { runs, state: busy ? "running" : i === 2 ? "checked" : "ok", cost: 0, once: false };
  });

  return {
    promptChars,
    replyChars,
    replyShown: raw >= 6,
    dotsShown: inPass >= 30 && inPass < 42,
    appShown: raw >= CARD_AT,
    pointerShown: !intro,
    view,
    aim: aimAt(p),
    click: p === 26 || p === 54 || p === 82,
    counters,
    bars: [...BARS, today],
    today,
    total: discovered,
    top: [0, 1, 2].map((k) => lead(pass - k)),
    leads,
    flows,
    fixing,
    spend,
    spendHot: p >= 62 && p < 70,
    saved: 38.2 + Math.floor(t / 2) * 0.05,
  };
}

/** A dollar amount as the app shows it. */
export const dollars = (n: number) => `$${n.toFixed(2)}`;

/** Puts a live number into a `{n}` template from the content. */
export const fill = (template: string, n: number | string) =>
  template.replace("{n}", typeof n === "number" ? n.toLocaleString("en-US") : n);

/** A view or message fading and rising into place. */
export const fadeStyle = (on: boolean, dy = 6) => ({
  opacity: on ? 1 : 0,
  transform: `translateY(${on ? 0 : dy}px)`,
  transition: "opacity .35s, transform .35s",
});
