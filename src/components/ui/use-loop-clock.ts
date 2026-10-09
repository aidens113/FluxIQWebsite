"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * A ticking clock for the home page's looping illustrations. It counts up
 * every `stepMs` while the element is on screen and the tab is visible, and
 * holds still otherwise, so off-screen sections cost nothing; it restarts at
 * zero whenever the element scrolls back into view. Each section
 * derives its own story from the tick (`tick % cycle`). It plays for every
 * visitor, as the hero demo does (the user's decision).
 */
export function useLoopClock<T extends HTMLElement>(stepMs = 50): { ref: RefObject<T | null>; tick: number } {
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
    const timer = setInterval(() => setTick((t) => t + 1), stepMs);
    return () => clearInterval(timer);
  }, [onScreen, pageVisible, stepMs]);

  return { ref, tick };
}
