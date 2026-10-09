import type { HowItWorksContent } from "@/content/how-it-works";
import { CAPTURE_BEATS, CAPTURED_BEAT } from "./timeline";

export type RecordCardProps = {
  record: HowItWorksContent["chat"]["record"];
  beat: number;
};

/** The hero demo's colours: amber while FluxIQ acts, blue while it reads. */
const AMBER = "#f5b83d";
const TONE = {
  act: { color: AMBER, wash: "rgba(245,184,61,0.06)", pulse: "how-breathe" },
  read: { color: "#5e9eea", wash: "rgba(94,158,234,0.08)", pulse: "how-scan" },
} as const;

type MarkProps = { on: boolean; label: string; place: "above" | "below" | "inside"; tone: keyof typeof TONE };

/**
 * The hero demo's automation mark: a solid outline that breathes (amber for
 * typing and clicking, blue for reading), with a "FluxIQ · Typing"-style label
 * and a blinking dot, drawn inside the element it marks so it lines up.
 */
function ActionMark({ on, label, place, tone }: MarkProps) {
  const style = TONE[tone];
  const at =
    place === "above"
      ? { left: -2, bottom: "calc(100% + 3px)" }
      : place === "below"
        ? { left: -2, top: "calc(100% + 3px)" }
        : { right: 4, top: 3 };
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[3px] z-[2] rounded-lg"
      style={{
        border: `2px solid ${style.color}`,
        background: style.wash,
        opacity: on ? 1 : 0,
        transition: "opacity 250ms ease",
        animation: on ? `${style.pulse} 1.6s ease-in-out infinite` : undefined,
      }}
    >
      {on && (
        <span
          className="absolute rounded-[4px] px-[5px] py-px text-[9px] leading-[1.4] font-semibold whitespace-nowrap text-[#0c0d0f]"
          style={{ ...at, background: style.color }}
        >
          <span
            className="mr-1 inline-block size-[5px] rounded-full bg-[#0c0d0f] align-[1px]"
            style={{ animation: "how-blink 1s ease-in-out infinite" }}
          />
          {label}
        </span>
      )}
    </span>
  );
}

/**
 * Doing the job once: FluxIQ types the search, picks a city, and reads the
 * results on a small directory, each action under the hero demo's amber mark,
 * and lists each step it learns. Everything appears whole; only the marks and
 * the list move.
 */
export function RecordCard({ record, beat }: RecordCardProps) {
  const [typeAt, pickAt, readAt] = CAPTURE_BEATS;
  const done = beat >= CAPTURED_BEAT;
  const active = (at: number) => !done && beat >= at && beat < at + 3;
  const captured = record.captured.filter((_, i) => beat >= (CAPTURE_BEATS[i] ?? Number.POSITIVE_INFINITY));
  return (
    <div className="how-msg-in overflow-hidden rounded-2xl border border-[#2a2414] bg-[#141518] md:ml-10">
      <div className="flex items-center gap-2 px-3 py-2 text-[11.5px] md:px-3.5 md:text-xs">
        <span
          className={`size-2 rounded-full ${done ? "bg-ok" : "animate-pulse"}`}
          style={done ? undefined : { background: AMBER }}
        />
        <span className={`font-semibold ${done ? "text-ok" : "text-fg"}`}>{done ? record.done : record.label}</span>
        <span className="text-dim">· {record.watching}</span>
        <span className="ml-auto text-dim tabular-nums">
          {captured.length} {captured.length === 1 ? record.countOne : record.count}
        </span>
      </div>

      <div className="mx-2.5 rounded-lg bg-[#f6f7f9] p-2 text-[10.5px] text-[#1d232b] md:mx-3 md:p-2.5 md:text-[11px]">
        <p className="truncate rounded bg-[#e6e9ee] px-1.5 py-0.5 font-mono text-[9.5px] text-[#5b6573]">
          {record.url}
        </p>
        <div className="mt-1.5 flex gap-1.5">
          <span className="relative flex h-[22px] min-w-0 flex-1 items-center rounded-md border border-[#d3d8de] bg-white px-1.5">
            {beat >= (typeAt ?? 0) ? record.query : null}
            <ActionMark on={active(typeAt ?? 0)} label={record.tags.typing} place="above" tone="act" />
          </span>
          <span className="flex h-[22px] items-center rounded-md bg-[#1d232b] px-2 text-white">{record.search}</span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {record.cities.map((city) => {
            const picked = city === record.city && beat >= (pickAt ?? 0);
            return (
              <span
                key={city}
                className={`relative rounded-full border px-2 py-px transition-colors duration-300 ${picked ? "border-[#1d232b] bg-[#1d232b] text-white" : "border-[#d3d8de] bg-white"}`}
              >
                {city}
                {city === record.city && (
                  <ActionMark on={active(pickAt ?? 0)} label={record.tags.clicking} place="below" tone="act" />
                )}
              </span>
            );
          })}
        </div>
        <div
          className="relative mt-1.5 flex flex-col gap-1 rounded-md transition-opacity duration-300"
          style={{ opacity: beat >= (pickAt ?? 0) ? 1 : 0.25 }}
        >
          <ActionMark on={active(readAt ?? 0)} label={record.tags.reading} place="inside" tone="read" />
          {[0.72, 0.58, 0.66].map((w) => (
            <span key={w} className="flex items-center gap-1.5 rounded bg-white px-1.5 py-1">
              <span className="h-1.5 rounded-sm bg-[#c9cfd7]" style={{ width: `${w * 60}%` }} />
              <span className="ml-auto h-1.5 w-8 rounded-sm bg-[#dfe3e8]" />
            </span>
          ))}
        </div>
      </div>

      <ol className="flex min-h-[34px] flex-wrap gap-1.5 px-2.5 py-2 md:px-3">
        {captured.map((step) => (
          <li
            key={step.verb}
            className="how-step-in inline-flex items-center gap-1 rounded-full bg-[#1a1b1f] px-2 py-0.5 text-[11px] md:text-[11.5px]"
          >
            <span className="text-ok">✓</span>
            <span className="font-semibold text-fg">{step.verb}</span>
            <span className="text-muted">{step.target}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
