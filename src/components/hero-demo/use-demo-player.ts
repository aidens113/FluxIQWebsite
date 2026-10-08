"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";
import { landDelay, stepCount, stepMs, typingSpec } from "./timeline";

export type View = "site" | "panel";

export type PlayerState = {
  tab: number;
  step: number;
  /** Bumped on every step, so one-shot animations replay. */
  tick: number;
  /** False between a click and the moment it lands. */
  landed: boolean;
  typed: { key: string | null; count: number };
  /** A view the person picked on a phone; it holds while the focus it was picked over lasts. */
  pin: { view: View; focus: View; tab: number } | null;
};

function enter(s: PlayerState, tab: number, step: number): PlayerState {
  const spec = typingSpec(tab, step);
  return {
    tab,
    step,
    tick: s.tick + 1,
    landed: landDelay(tab, step) === 0,
    typed: { key: spec?.key ?? null, count: 0 },
    pin: tab === s.tab ? s.pin : null,
  };
}

/** The next step; after an example's last step, the next example begins. */
function next(s: PlayerState): PlayerState {
  if (s.step < stepCount(s.tab) - 1) return enter(s, s.tab, s.step + 1);
  return enter(s, (s.tab + 1) % 3, 0);
}

// The server renders Tell it's finished frame, so the hero reads as a
// complete picture before (or without) JavaScript; playback starts from the
// first step once the page is interactive.
const INITIAL: PlayerState = {
  tab: 0,
  step: stepCount(0) - 1,
  tick: 0,
  landed: true,
  typed: { key: null, count: 0 },
  pin: null,
};

/**
 * Plays the three examples in a loop, for every visitor. Playback runs while
 * the stage is on screen, the tab is visible, and the person has not paused.
 */
export function useDemoPlayer(root: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<PlayerState>(INITIAL);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const running = !paused && onScreen && pageVisible;

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

  // Once interactive, start from the first step.
  useEffect(() => {
    setState((s) => enter(s, 0, 0));
  }, []);

  const { tab, step, landed, typed } = state;

  // Advance when the step's time is up.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setState(next), stepMs(tab, step));
    return () => clearTimeout(timer);
  }, [running, tab, step]);

  // Land a click once the press has happened.
  useEffect(() => {
    if (!running || landed) return;
    const timer = setTimeout(() => setState((s) => ({ ...s, landed: true })), landDelay(tab, step));
    return () => clearTimeout(timer);
  }, [running, landed, tab, step]);

  // Type one character at a time.
  useEffect(() => {
    const spec = typingSpec(tab, step);
    if (!running || !spec || typed.key !== spec.key || typed.count >= spec.text.length) return;
    const timer = setTimeout(
      () => setState((s) => ({ ...s, typed: { ...s.typed, count: s.typed.count + 1 } })),
      spec.speed,
    );
    return () => clearTimeout(timer);
  }, [running, tab, step, typed]);

  const skip = useCallback(() => setState(next), []);
  const pickTab = useCallback((i: number) => setState((s) => ({ ...enter(s, i, 0), pin: null })), []);
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
