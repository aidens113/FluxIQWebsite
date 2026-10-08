// The shape every example step produces: what the example site, the
// extension panel, the status pill, and the person's cursor show. Scenes are
// plain data; the components decide how each part looks and moves.

/** Elements on the example site that can carry a highlight. */
export type TargetName = "row" | "search" | "button" | "calgary" | "results";

/**
 * Who is acting and how it went: `auto` FluxIQ acting (amber), `user` the
 * person while recording (dashed red), `fail` a step that broke (red), `scan`
 * FluxIQ looking the page over (blue), `done` a success (green).
 */
export type TargetKind = "auto" | "user" | "fail" | "scan" | "done";

export type Target = { name: TargetName; kind: TargetKind; tag: string; click?: boolean };

export type SiteScene = {
  query: string;
  caret: boolean;
  /** True once the Calgary filter is on. */
  filtered: boolean;
  rows: boolean;
  /** Bumped whenever a new set of results loads, so the rows slide in again. */
  rowsLoad: number;
  rowsDone: boolean;
  redesigned: boolean;
  target: Target | null;
};

export type CardState = "working" | "done" | "failed" | "fixing" | "captured";

/** Each message has a stable id, so a card that changes state is not re-animated. */
export type Message =
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "text"; text: string }
  | { id: string; kind: "card"; name: string; target: string; state: CardState; outcome: string }
  | { id: string; kind: "live"; headline: string; step: string; detail: string }
  | { id: string; kind: "data" };

export type StripTone = "muted" | "amber" | "green";

export type PanelScene = {
  /** The panel's empty state, before anything is asked or recorded. */
  empty: boolean;
  /** Text being typed into the composer, or null for its placeholder. */
  composer: string | null;
  /** The recording banner's step count, or null when not recording. */
  recording: number | null;
  recordClick: boolean;
  stopClick: boolean;
  strip: { runLabel: string; text: string; tone: StripTone } | null;
  messages: Message[];
};

export type PillScene = { kind: "running" | "fixing" | "done"; detail: string; step?: string } | null;

/** Where the person's cursor points, or null when it is hidden. */
export type CursorSpot = "rest" | "search" | "button" | "calgary" | "stop" | "record" | null;

export type Scene = { site: SiteScene; panel: PanelScene; pill: PillScene; cursor: CursorSpot };

/** What a scene builder may know about playback. */
export type SceneContext = {
  /** False between a click and the moment it lands. */
  landed: boolean;
  /** The part of `full` typed so far for a typing moment, or all of it. */
  typed: (key: string, full: string) => string;
};

export const emptyPanel = (): PanelScene => ({
  empty: false,
  composer: null,
  recording: null,
  recordClick: false,
  stopClick: false,
  strip: null,
  messages: [],
});
