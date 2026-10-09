import { PAPER } from "@/content/paper";

export type PageStackProps = {
  /** Which image is up: 0 is the cover, then one per section. */
  index: number;
};

const IMAGES = [PAPER.cover, ...PAPER.sections.map((section) => section.image)];
const LAST = IMAGES.length - 1;

/**
 * The paper's pages, stacked in one place. Each keeps its own tilt, stepping
 * evenly from the cover (-6°, -12 px) to the last page (+6°, +12 px); only the
 * current one is shown, and the change is a 0.8 s crossfade with no movement.
 */
export function PageStack({ index }: PageStackProps) {
  return (
    <div className="relative h-[244px] md:h-[340px]">
      <div
        aria-hidden="true"
        className="absolute top-6 left-11 hidden h-[305px] w-[236px] -rotate-5 rounded-xl bg-[#1c1d21] md:block"
      />
      {IMAGES.map((image, j) => {
        const step = j / LAST;
        const shown = j === index;
        return (
          // biome-ignore lint/performance/noImgElement: a static export with unoptimized images gains nothing from next/image but its client JavaScript.
          <img
            key={image.src}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            aria-hidden={shown ? undefined : true}
            loading="lazy"
            decoding="async"
            style={{
              opacity: shown ? 1 : 0,
              transform: `translateX(${-12 + 24 * step}px) rotate(${-6 + 12 * step}deg)`,
            }}
            className="absolute top-2 left-1/2 -ml-[88px] h-[228px] w-[176px] rounded-xl bg-white object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] transition-opacity duration-800 ease-in-out md:left-[34px] md:ml-0 md:h-[316px] md:w-[244px]"
          />
        );
      })}
    </div>
  );
}
