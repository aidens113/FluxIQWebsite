import type { HowPhrase } from "@/content/how-it-works";

export type FitTextProps = {
  phrase: HowPhrase;
};

/** A phrase in full from `md` up and in its short form below it; a plain string reads the same everywhere. */
export function FitText({ phrase }: FitTextProps) {
  if (typeof phrase === "string") return phrase;
  return (
    <>
      <span className="md:hidden">{phrase.short}</span>
      <span className="max-md:hidden">{phrase.full}</span>
    </>
  );
}
