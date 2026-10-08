import type { DemoExample } from "@/content/hero-demo/examples";
import { DEMO_LABELS } from "@/content/hero-demo/examples";

export type IntroCardProps = {
  example: DemoExample;
  show: boolean;
  /** How long the card holds; the bar drains over it. */
  ms: number;
  runKey: string;
  running: boolean;
};

/** The title card before each example, with a bar showing how long until it moves on. */
export function IntroCard({ example, show, ms, runKey, running }: IntroCardProps) {
  const rise = (delay: number) => (show ? { animation: `demo-in 450ms ${delay}ms ease both` } : undefined);
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[rgba(11,16,22,0.88)] backdrop-blur-[6px]"
      style={{ opacity: show ? 1 : 0, transition: "opacity 350ms ease" }}
    >
      {show && (
        <div className="max-w-[460px] px-8 text-center">
          <p className="font-mono text-[13px] tracking-[0.08em] text-amber" style={rise(0)}>
            {example.intro.kicker}
          </p>
          <p
            className="mt-2.5 text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-[#eef4fb]"
            style={rise(80)}
          >
            {example.intro.title}
          </p>
          <p className="mt-3.5 text-base leading-normal text-muted" style={rise(160)}>
            {example.intro.body}
          </p>
          <div className="mx-auto mt-[22px] h-[3px] w-40 overflow-hidden rounded-[3px] bg-white/12">
            <span
              key={runKey}
              className="block h-[3px] rounded-[3px] bg-amber"
              style={running ? { animation: `demo-drain ${ms}ms linear forwards` } : undefined}
            />
          </div>
          <p className="mt-2.5 text-xs text-[#93a4b6]">{DEMO_LABELS.clickToContinue}</p>
        </div>
      )}
    </div>
  );
}
