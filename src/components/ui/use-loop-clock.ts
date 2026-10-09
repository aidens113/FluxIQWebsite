"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * A ticking clock for the home page's looping illustrations. It counts up
 * every `stepMs` while the element is on screen and the tab is visible, and
 * holds still otherwise, so off-screen sections cost nothing; it restarts at
 * zero whenever the element scrolls back into view. Each section
 * derives its own story from the tick (`tick % cycle`). It plays for every
 * visitor, as the hero demo does (the user's decision).
 *
 * With `smooth`, the tick is fractional and advances on every animation
 * frame instead of every `stepMs`, for a motion that must glide (the savings
 * chart's dot) rather than step between CSS transitions.
 */
export function useLoopClock<T extends HTMLElement>(
  stepMs = 50,
  smooth = false,
): { ref: RefObject<T | null>; tick: number } {
  const ref = useRef<T>(null);
  const [tick, setTick] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The story starts the moment any part of the illustration enters the
    // screen, so it is never caught standing still.
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry?.isIntersecting ?? false), {
      threshold: 0,
    });
    observer.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Each time the illustration scrolls into view, its story starts over, so
  // a visitor always sees it from the beginning.
  useEffect(() => {
    if (onScreen) setTick(0);
  }, [onScreen]);

  useEffect(() => {
    if (!onScreen || !pageVisible) return;
    if (!smooth) {
      const timer = setInterval(() => setTick((t) => t + 1), stepMs);
      return () => clearInterval(timer);
    }
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const elapsed = now - last;
      last = now;
      setTick((t) => t + elapsed / stepMs);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [onScreen, pageVisible, stepMs, smooth]);

  return { ref, tick };
}
