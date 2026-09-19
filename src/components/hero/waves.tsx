// The hero's animated wave lines. Two layers: one along the top edge and one,
// turned 180 degrees, along the bottom. Each layer fades out towards the
// centre through a mask, so the lines stay clear of the hero's text; the mask
// sits on the rotated element, so one mask class fades both layers inwards.
// Each layer is 120% of the hero's width so the drift never shows an end.

const PATHS = [
  "M-60 340 C 260 120, 520 460, 860 260 S 1420 120, 1700 300",
  "M-60 400 C 300 220, 560 520, 900 330 S 1440 200, 1700 370",
  "M-60 280 C 240 60, 500 400, 840 200 S 1400 60, 1700 240",
] as const;

// Gradient ids are document-global, so each layer names its own.
const LAYERS = [
  { gradientId: "hero-wave-top", paths: PATHS, layer: "top-0 h-64 opacity-70 md:h-80", drift: "" },
  {
    gradientId: "hero-wave-bottom",
    paths: PATHS.slice(0, 2),
    layer: "bottom-0 h-40 rotate-180 opacity-50 md:h-56",
    drift: "[animation-delay:-9s] [animation-direction:reverse]",
  },
] as const;

/** Decorative: rendered inside the hero's `aria-hidden` decoration layer. */
export function Waves() {
  return (
    <>
      {LAYERS.map(({ gradientId, paths, layer, drift }) => (
        <div
          key={gradientId}
          className={`absolute inset-x-[-10%] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] ${layer}`}
        >
          <svg
            viewBox="0 0 1640 600"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            className={`size-full animate-wave-drift ${drift}`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1640" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {paths.map((d, index) => (
              <g key={d}>
                <path
                  d={d}
                  stroke={`url(#${gradientId})`}
                  strokeWidth={12}
                  strokeLinecap="round"
                  opacity={0.12}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={d}
                  stroke={`url(#${gradientId})`}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  opacity={0.85 - index * 0.2}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
        </div>
      ))}
    </>
  );
}
