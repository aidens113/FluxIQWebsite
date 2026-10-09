import { DEMO_LABELS } from "@/content/hero-demo/examples";
import { ChatPeek } from "./chat-peek";
import { cursorPoint } from "./cursor-targets";
import { DirectorySite, type SiteMotion } from "./directory-site";
import { ExtensionPanel } from "./extension-panel";
import { Pointer } from "./pointer";
import type { Scene } from "./scenes/scene";
import { isQuiet } from "./timeline";
import type { PlayerState, View } from "./use-demo-player";

export type StageProps = {
  state: PlayerState;
  scene: Scene;
  motion: SiteMotion;
  compact: boolean;
  /** The phone stage's width; the desktop stage is always 760 px. */
  phoneWidth: number;
  /** The desktop stage scaled down to fit a narrower column; 1 otherwise. */
  scale: number;
  view: View;
  onSkip: () => void;
  onOpenChat: () => void;
};

/**
 * The widget's stage. On a desktop the example site and the extension panel
 * sit side by side; on a phone they share a sliding strip and show one at a
 * time. Clicking anywhere on the stage skips to the next step.
 */
export function Stage(props: StageProps) {
  const { state, scene, motion, compact, phoneWidth, scale, view } = props;
  const width = compact ? phoneWidth : 760;
  const [x, y] = cursorPoint(scene.cursor ?? "rest", compact, phoneWidth);
  const latest = scene.panel.messages.at(-1);
  // On a quiet step, point the eye at what FluxIQ says.
  const target = scene.site.target;
  const siteBusy = scene.cursor !== null || (target !== null && (target.kind !== "done" || target.click === true));
  const spotlight = isQuiet(state.tab, state.step, siteBusy);
  // A scaled stage keeps its 760 x 470 layout (and cursor targets) and is
  // shrunk as a whole; the outer box takes the scaled size.
  const scaled = scale < 1;
  return (
    <div style={scaled ? { width: width * scale, height: 470 * scale } : undefined}>
      <div style={scaled ? { width, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}>
        <div
          className="relative h-[470px] overflow-hidden rounded-[14px] border border-edge bg-[#0b1016] font-sans shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)]"
          style={{ width }}
        >
          <div
            className="flex h-full"
            style={
              compact
                ? {
                    width: width * 2,
                    transform: `translateX(${view === "panel" ? -width : 0}px)`,
                    transition: "transform 450ms cubic-bezier(.4,0,.2,1)",
                  }
                : undefined
            }
          >
            <div
              className="relative h-full flex-none bg-[#f6f7f9] text-[#1d232b]"
              style={{ width: compact ? width : 460 }}
            >
              {/* Each example starts on a fresh page: the site and panel fade in when the example changes. */}
              <div key={state.tab} className="h-full" style={{ animation: "demo-fade 600ms ease both" }}>
                <DirectorySite site={scene.site} motion={motion} compact={compact} tick={state.tick} />
              </div>
              <Pointer x={x} y={y} visible={scene.cursor !== null} />
            </div>
            <div className="h-full flex-none border-l border-[#26384a]" style={{ width: compact ? width : 300 }}>
              <div key={state.tab} className="h-full" style={{ animation: "demo-fade 600ms ease both" }}>
                <ExtensionPanel panel={scene.panel} tick={state.tick} />
              </div>
            </div>
          </div>
          {compact && view === "site" && latest && (
            <ChatPeek
              key={latest.id}
              message={latest}
              onOpen={props.onOpenChat}
              spotlight={spotlight && latest.kind !== "user"}
            />
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={props.onSkip}
            aria-label={DEMO_LABELS.skipStep}
            title={DEMO_LABELS.skipStep}
            className="absolute inset-0 z-30 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
