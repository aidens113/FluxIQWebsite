"use client";

import "./hero-demo.css";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { PHONE_MAX, PHONE_MIN } from "./cursor-targets";
import { ExampleTabs } from "./example-tabs";
import { itAdaptsScene } from "./scenes/it-adapts";
import { recordItScene } from "./scenes/record-it";
import type { SceneContext } from "./scenes/scene";
import { tellItScene } from "./scenes/tell-it";
import { Stage } from "./stage";
import { exampleOf, focusOf, introMs, landDelay, loads, pressAt, stepCount, stepMs } from "./timeline";
import { typedSoFar, useDemoPlayer, type View } from "./use-demo-player";
import { useMediaQuery } from "./use-media-query";
import { ViewSwitch } from "./view-switch";

const SCENES = [tellItScene, recordItScene, itAdaptsScene];
const subscribeNothing = () => () => {};

/**
 * The hero's example widgets: Tell it, Record it, and It adapts, played in a
 * loop on an example lead directory with the FluxIQ panel beside it (on a
 * phone, one view at a time). The stage is artwork for sighted visitors;
 * screen readers get a description, and the controls are real buttons.
 */
export function HeroDemo() {
  const root = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery("(max-width: 799px)");
  const animate = !useMediaQuery("(prefers-reduced-motion: reduce)");
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const { state, running, paused, setPaused, skip, pickTab, pin } = useDemoPlayer(root, animate);
  const { tab, step, intro, landed, tick } = state;

  // The phone stage fills the column, within limits.
  const [phoneWidth, setPhoneWidth] = useState(343);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => setPhoneWidth(Math.round(Math.min(PHONE_MAX, Math.max(PHONE_MIN, el.clientWidth))));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ctx: SceneContext = { landed, intro, typed: (key, full) => (animate ? typedSoFar(state, key, full) : full) };
  const scene = (SCENES[tab] ?? tellItScene)(step, ctx);
  const loading = animate && !intro && loads(tab, step);
  const press = pressAt(tab);
  const motion = {
    loading,
    pending: loading && !landed,
    pressAt: press,
    loadMs: landDelay(tab, step, false) - press + 300,
  };

  // On a phone the view follows the action; a view the person picks holds
  // until the action moves to the other one.
  const focus = focusOf(tab, step);
  const view: View = compact
    ? state.pin && state.pin.focus === focus && state.pin.tab === tab
      ? state.pin.view
      : focus
    : "site";
  const ms = intro ? introMs(tab) : stepMs(tab, step);
  const runKey = `${tick}-${running}`;
  const example = exampleOf(tab);
  const narration = intro ? example.introLine : example.lines[Math.min(step, example.lines.length - 1)];

  return (
    <div
      ref={root}
      className={`hero-demo mx-auto w-full ${compact ? "max-w-[400px]" : "max-w-[760px]"} ${mounted ? "" : "max-[799px]:invisible"}`}
    >
      <p className="sr-only">{DEMO_LABELS.description}</p>
      {compact && (
        <ViewSwitch
          view={view}
          onPick={(v) => pin(v, focus)}
          chatNews={view === "site" && scene.panel.messages.length > 0}
          stepShort={`${step + 1}/${stepCount(tab)}`}
          ms={ms}
          runKey={runKey}
          running={running && !intro}
        />
      )}
      <div aria-hidden="true">
        <Stage
          state={state}
          scene={scene}
          motion={motion}
          compact={compact}
          phoneWidth={phoneWidth}
          view={view}
          running={running}
          animate={animate}
          ms={ms}
          runKey={runKey}
          stepLabel={`Step ${step + 1} of ${stepCount(tab)}`}
          onSkip={skip}
          onOpenChat={() => pin("panel", focus)}
        />
      </div>
      <div className={`flex items-baseline ${compact ? "mt-3 min-h-11 gap-2" : "mt-4 min-h-[26px] gap-3"}`}>
        <span className="flex-none font-mono text-xs text-amber">{example.beat}</span>
        <span className={`${compact ? "text-sm" : "text-base"} leading-[1.4] text-fg`}>{narration}</span>
        <span className="ml-auto flex flex-none items-baseline gap-3">
          {!compact && animate && <span className="text-xs text-[#6f6d69]">{DEMO_LABELS.skipHint}</span>}
          {animate && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              className={`min-h-9 rounded-md border border-edge px-3 text-xs font-medium text-soft hover:text-fg ${FOCUS_RING}`}
            >
              {paused ? DEMO_LABELS.play : DEMO_LABELS.pause}
            </button>
          )}
        </span>
      </div>
      <ExampleTabs tab={tab} step={step} intro={intro} running={running} compact={compact} onPick={pickTab} />
      <p className="mt-4 text-xs text-dim">{DEMO_LABELS.caption}</p>
    </div>
  );
}
