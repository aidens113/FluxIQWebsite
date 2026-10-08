"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";
import { introMs, landDelay, stepCount, stepMs, typingSpec } from "./timeline";

export type View = "site" | "panel";

export type PlayerState = {
  tab: number;
  step: number;
  /** True while an example's title card shows. */
  intro: boolean;
  /** Bumped on every step, so one-shot animations replay. */
  tick: number;
  /** False between a click and the moment it lands. */
  landed: boolean;
  typed: { key: string | null; count: number };
  /** A view the person picked on a phone; it holds while the focus it was picked over lasts. */
  pin: { view: View; focus: View; tab: number } | null;
};

function enter(s: PlayerState, tab: number, step: number, intro: boolean): PlayerState {
  const spec = typingSpec(tab, step, intro);
  return {
    ...s,
    tab,
    step,
    intro,
    tick: s.tick + 1,
    landed: landDelay(tab, step, intro) === 0,
    typed: { key: spec?.key ?? null, count: 0 },
    pin: tab === s.tab ? s.pin : null,
  };
}

function next(s: PlayerState): PlayerState {
  if (s.intro) return enter(s, s.tab, s.step, false);
  if (s.step < stepCount(s.tab) - 1) return enter(s, s.tab, s.step + 1, false);
  return enter(s, (s.tab + 1) % 3, 0, true);
}

// The server renders Tell it's finished frame, so the hero reads as a
// complete picture before (or without) JavaScript; playback starts from the
// first title card once the page is interactive.
const INITIAL: PlayerState = {
  tab: 0,
  step: stepCount(0) - 1,
  intro: false,
  tick: 0,
  landed: true,
  typed: { key: null, count: 0 },
  pin: null,
};

/**
 * Plays the three examples in a loop. Playback runs only while `animate` is
 * true (no reduced-motion preference), the stage is on screen, the tab is
 * visible, and the person has not paused. With motion off, each example
 * shows its final frame.
 */
export function useDemoPlayer(root: RefObject<HTMLElement | null>, animate: boolean) {
  const [state, setState] = useState<PlayerState>(INITIAL);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const running = animate && !paused && onScreen && pageVisible;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry?.isIntersecting ?? true), {
      threshold: 0.15,
    });
    observer.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [root]);

  // Start from the first title card when motion is on; with it off, show
  // the final frame of the current example.
  useEffect(() => {
    setState((s) =>
      animate
        ? { ...enter(s, 0, 0, true), pin: null }
        : { ...s, step: stepCount(s.tab) - 1, intro: false, landed: true, typed: { key: null, count: 0 } },
    );
  }, [animate]);

  const { tab, step, intro, landed, typed } = state;

  // Advance when the step's time is up.
  useEffect(() => {
    if (!running) return;
    const ms = intro ? introMs(tab) : stepMs(tab, step);
    const timer = setTimeout(() => setState(next), ms);
    return () => clearTimeout(timer);
  }, [running, tab, step, intro]);

  // Land a click once the press has happened.
  useEffect(() => {
    if (!running || landed) return;
    const timer = setTimeout(() => setState((s) => ({ ...s, landed: true })), landDelay(tab, step, intro));
    return () => clearTimeout(timer);
  }, [running, landed, tab, step, intro]);

  // Type one character at a time.
  useEffect(() => {
    const spec = typingSpec(tab, step, intro);
    if (!running || !spec || typed.key !== spec.key || typed.count >= spec.text.length) return;
    const timer = setTimeout(
      () => setState((s) => ({ ...s, typed: { ...s.typed, count: s.typed.count + 1 } })),
      spec.speed,
    );
    return () => clearTimeout(timer);
  }, [running, tab, step, intro, typed]);

  const skip = useCallback(() => {
    if (animate) setState(next);
  }, [animate]);

  const pickTab = useCallback(
    (i: number) =>
      setState((s) => {
        const entered = enter(s, i, animate ? 0 : stepCount(i) - 1, animate);
        return { ...entered, pin: null, landed: true };
      }),
    [animate],
  );

  const pin = useCallback(
    (view: View, focus: View) => setState((s) => ({ ...s, pin: { view, focus, tab: s.tab } })),
    [],
  );

  return { state, running, paused, setPaused, skip, pickTab, pin };
}

/** The part of `full` typed so far for a typing moment, or all of it. */
export function typedSoFar(state: PlayerState, key: string, full: string): string {
  return state.typed.key === key ? full.slice(0, state.typed.count) : full;
}
