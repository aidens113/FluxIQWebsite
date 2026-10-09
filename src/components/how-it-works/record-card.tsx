import type { HowItWorksContent } from "@/content/how-it-works";
import { CAPTURE_BEATS, CAPTURED_BEAT } from "./timeline";

export type RecordCardProps = {
  record: HowItWorksContent["chat"]["record"];
  beat: number;
};

const REC = "#fa6571";
/** The element the person is using rings red while FluxIQ records it. */
const ring = (on: boolean) => (on ? `0 0 0 2px ${REC}` : "0 0 0 0 transparent");

/**
 * Showing the job once: a small directory where the person types the search,
 * picks a city, and reads the results, while FluxIQ lists each action it
 * captures. Everything appears whole; only the ring and the list move.
 */
export function RecordCard({ record, beat }: RecordCardProps) {
  const [typeAt, pickAt, readAt] = CAPTURE_BEATS;
  const done = beat >= CAPTURED_BEAT;
  const active = (at: number) => !done && beat >= at && beat < at + 3;
  const captured = record.captured.filter((_, i) => beat >= (CAPTURE_BEATS[i] ?? Number.POSITIVE_INFINITY));
  return (
    <div className="how-msg-in overflow-hidden rounded-2xl border border-[#2a1d20] bg-[#141518] md:ml-10">
      <div className="flex items-center gap-2 px-3 py-2 text-[11.5px] md:px-3.5 md:text-xs">
        <span
          className={`size-2 rounded-full ${done ? "bg-ok" : "animate-pulse"}`}
          style={done ? undefined : { background: REC }}
        />
        <span className={`font-semibold ${done ? "text-ok" : "text-fg"}`}>{done ? record.done : record.label}</span>
        <span className="text-dim">· {record.watching}</span>
        <span className="ml-auto text-dim tabular-nums">
          {captured.length} {record.count}
        </span>
      </div>

      <div className="mx-2.5 rounded-lg bg-[#f6f7f9] p-2 text-[10.5px] text-[#1d232b] md:mx-3 md:p-2.5 md:text-[11px]">
        <p className="truncate rounded bg-[#e6e9ee] px-1.5 py-0.5 font-mono text-[9.5px] text-[#5b6573]">
          {record.url}
        </p>
        <div className="mt-1.5 flex gap-1.5">
          <span
            className="flex h-[22px] min-w-0 flex-1 items-center rounded-md border border-[#d3d8de] bg-white px-1.5 transition-shadow duration-300"
            style={{ boxShadow: ring(active(typeAt ?? 0)) }}
          >
            {beat >= (typeAt ?? 0) ? record.query : null}
          </span>
          <span className="flex h-[22px] items-center rounded-md bg-[#1d232b] px-2 text-white">{record.search}</span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {record.cities.map((city) => {
            const picked = city === record.city && beat >= (pickAt ?? 0);
            return (
              <span
                key={city}
                className={`rounded-full border px-2 py-px transition-colors duration-300 ${picked ? "border-[#1d232b] bg-[#1d232b] text-white" : "border-[#d3d8de] bg-white"}`}
                style={{ boxShadow: city === record.city ? ring(active(pickAt ?? 0)) : undefined }}
              >
                {city}
              </span>
            );
          })}
        </div>
        <div
          className="mt-1.5 flex flex-col gap-1 rounded-md transition-[opacity,box-shadow] duration-300"
          style={{ opacity: beat >= (pickAt ?? 0) ? 1 : 0.25, boxShadow: ring(active(readAt ?? 0)) }}
        >
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
