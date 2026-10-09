"use client";

import { useEffect } from "react";

/** Ms of quiet that mark the end of a scroll. */
const SETTLE_MS = 140;
/** How far ahead, as a share of the screen, the next snap point may be and still be reached. */
const AHEAD = 0.45;
/** How far past a snap point a scroll may stop and still settle back onto it. */
const BEHIND = 0.12;

/** Where each snap point puts the page: its top, less the scroll padding and its own margin. */
function snapTops(): number[] {
  const pad = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return [...document.querySelectorAll<HTMLElement>('[class*="snap-start"]')]
    .filter((el) => getComputedStyle(el).scrollSnapAlign.includes("start") && el.getBoundingClientRect().height > 0)
    .map(
      (el) =>
        el.getBoundingClientRect().top + window.scrollY - pad - Number.parseFloat(getComputedStyle(el).scrollMarginTop),
    );
}

/**
 * Desktop scroll snapping for the home page (from `md`; phones use CSS
 * proximity snapping instead). CSS snapping on a desktop either ignored a
 * wheel scroll or pulled it back to where it began, so a scroll that stops
 * eases on to the next snap point in its direction when one is within about
 * half a screen, or settles back onto one it only just passed. Otherwise the
 * page stays put, so long sections can be read freely and nothing traps.
 */
export function ScrollSnapper() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let from = window.scrollY;
    let timer = 0;
    let snapping = false;

    const settle = () => {
      const y = window.scrollY;
      const moved = y - from;
      from = y;
      if (snapping) {
        snapping = false;
        return;
      }
      if (!desktop.matches || moved === 0) return;
      const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd) return;
      const dir = Math.sign(moved);
      const tops = snapTops();
      const ahead = tops.filter((t) => (t - y) * dir > 0 && Math.abs(t - y) <= window.innerHeight * AHEAD);
      const behind = tops.filter((t) => (y - t) * dir >= 0 && Math.abs(t - y) <= window.innerHeight * BEHIND);
      const nearest = (list: number[]) => list.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
      const target = ahead.length ? nearest(ahead) : behind.length ? nearest(behind) : null;
      if (target === null || Math.abs(target - y) < 2) return;
      snapping = true;
      window.scrollTo({ top: target, behavior: reduced.matches ? "auto" : "smooth" });
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
