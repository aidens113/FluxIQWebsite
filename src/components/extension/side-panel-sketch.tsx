import { TONE_TEXT } from "@/components/ui/tone-class";
import { EXTENSION } from "@/content/extension";

/**
 * A drawing of the extension's Automations tab, labelled as a sketch. It is
 * a picture, so the mock buttons are plain text, not controls.
 */
export function SidePanelSketch() {
  const panel = EXTENSION.panel;
  return (
    <figure className="w-full max-w-[380px] overflow-hidden rounded-xl border border-edge bg-panel text-sm">
      <div className="flex items-center justify-between gap-2 border-b border-rule px-4 py-3">
        <div className="flex gap-4">
          <span className="text-dim">{panel.tabs[0]}</span>
          <span className="font-semibold">{panel.tabs[1]}</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
          <span aria-hidden="true" className="size-1.75 rounded-full bg-ok" />
          {panel.connection}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {panel.items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-2 rounded-lg border border-rule p-3">
            <span>
              <span className="block font-medium">{item.name}</span>
              <span className={`font-mono text-[11px] ${item.tone === "neutral" ? "text-dim" : TONE_TEXT[item.tone]}`}>
                {item.detail}
              </span>
            </span>
            <span className="rounded-md bg-rule px-3 py-1.5 text-[13px]">{panel.runLabel}</span>
          </div>
        ))}
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-edge bg-amber-row p-3 font-medium text-amber">
          <span aria-hidden="true" className="size-2.25 rounded-full bg-amber" />
          {panel.record}
        </div>
        <div className="rounded-lg border border-dashed border-edge p-3 text-muted">{panel.extract}</div>
      </div>
      <figcaption className="border-t border-rule px-4 py-2.5 text-xs text-dim">{panel.caption}</figcaption>
    </figure>
  );
}
