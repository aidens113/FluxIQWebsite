import { PANEL } from "@/content/hero-demo/panel";
import type { CardState } from "./scenes/scene";

export type ActionIconProps = {
  /** The card's action, as the panel names it ("Click", "Type", "Read"). */
  name: string;
  state: CardState;
  tone: string;
};

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** A pointer for clicks, a keyboard for typing, rows for reading. */
function Glyph({ name }: { name: string }) {
  if (name === PANEL.actions.type)
    return (
      <>
        <rect x="2" y="5.5" width="20" height="13" rx="2.4" fill="none" {...stroke} />
        <path d="M6.2 9.8h.01M10.1 9.8h.01M13.9 9.8h.01M17.8 9.8h.01M8 14.2h8" fill="none" {...stroke} />
      </>
    );
  if (name === PANEL.actions.read)
    return <path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" {...stroke} />;
  return (
    <>
      <path d="M9 7.5v12.5l3.4-3.2 2.4 5.2 2.3-1.1-2.4-5.1 4.8-.4z" fill="currentColor" fillOpacity="0.2" {...stroke} />
      <path d="M5.6 4.1 4 2.5M9 3.6V1.4M4.1 7.5H1.9" fill="none" {...stroke} />
    </>
  );
}

/** The icon at the start of an action card: what was done. */
export function ActionIcon({ name, state, tone }: ActionIconProps) {
  return (
    <span
      className="relative inline-flex size-[22px] flex-none items-center justify-center rounded-md"
      style={{ color: state === "captured" ? "#c9d3de" : tone, background: `${tone}1f`, transition: "all 300ms ease" }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5">
        <Glyph name={name} />
      </svg>
    </span>
  );
}
