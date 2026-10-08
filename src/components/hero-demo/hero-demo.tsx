"use client";

import "./hero-demo.css";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { DESKTOP_WIDTH, PHONE_MAX, PHONE_MIN } from "./cursor-targets";
import { ExampleTabs } from "./example-tabs";
import { PauseButton } from "./pause-button";
import { itAdaptsScene } from "./scenes/it-adapts";
import { recordItScene } from "./scenes/record-it";
import type { SceneContext } from "./scenes/scene";
import { tellItScene } from "./scenes/tell-it";
import { Stage } from "./stage";
import { focusOf, landDelay, loads, pressAt } from "./timeline";
import { typedSoFar, useDemoPlayer, type View } from "./use-demo-player";
import { useMediaQuery } from "./use-media-query";
import { ViewSwitch } from "./view-switch";

const SCENES = [tellItScene, recordItScene, itAdaptsScene];
const COMPACT_BELOW = 600;
const subscribeNothing = () => () => {};

/**
 * The hero's example widgets: Tell it, Record it, and It adapts, played in a
 * loop on an example lead directory with the FluxIQ panel beside it (on a
 * phone, one view at a time). The stage is artwork for sighted visitors;
 * screen readers get a description, and the controls are real buttons.
 */
export function HeroDemo() {
  const root = useRef<HTMLDivElement>(null);
  // Until the column is measured, a media query guesses the layout.
  const narrowViewport = useMediaQuery("(max-width: 799px)");
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const { state, running, paused, setPaused, skip, pickTab, pin } = useDemoPlayer(root);
  const { tab, step, landed } = state;

  // The layout follows the column the widget sits in, not the window: the
  // side-by-side stage scales down to fit columns narrower than 760 px, and
  // below 600 px the phone layout (one view at a time) takes over.
  const [columnWidth, setColumnWidth] = useState<number | null>(null);
  useEffect(() => {
    const column = root.current?.parentElement;
    if (!column) return;
    // The content width: the column's padding is not room for the widget.
    const fit = () => {
      const style = getComputedStyle(column);
      setColumnWidth(column.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(column);
    return () => observer.disconnect();
  }, []);
  const compact = columnWidth === null ? narrowViewport : columnWidth < COMPACT_BELOW;
  const phoneWidth = Math.round(Math.min(PHONE_MAX, Math.max(PHONE_MIN, columnWidth ?? 343)));
  const stageScale = compact || columnWidth === null ? 1 : Math.min(1, columnWidth / DESKTOP_WIDTH);

  const ctx: SceneContext = { landed, typed: (key, full) => typedSoFar(state, key, full) };
  const scene = (SCENES[tab] ?? tellItScene)(step, ctx);
  const loading = loads(tab, step);
  const press = pressAt(tab);
  const motion = {
    loading,
    pending: loading && !landed,
    pressAt: press,
    loadMs: landDelay(tab, step) - press + 300,
  };

  // On a phone the view follows the action; a view the person picks holds
  // until the action moves to the other one.
  const focus = focusOf(tab, step);
  const view: View = compact
    ? state.pin && state.pin.focus === focus && state.pin.tab === tab
      ? state.pin.view
      : focus
    : "site";
  const pauseButton = <PauseButton paused={paused} onToggle={() => setPaused(!paused)} />;

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
          pause={pauseButton}
        />
      )}
      <div className="relative">
        <div aria-hidden="true">
          <Stage
            state={state}
            scene={scene}
            motion={motion}
            compact={compact}
            phoneWidth={phoneWidth}
            scale={stageScale}
            view={view}
            onSkip={skip}
            onOpenChat={() => pin("panel", focus)}
          />
        </div>
      </div>
      <ExampleTabs tab={tab} step={step} running={running} onPick={pickTab} pause={compact ? undefined : pauseButton} />
      <p className="mt-3 text-xs text-dim">{DEMO_LABELS.caption}</p>
    </div>
  );
}
