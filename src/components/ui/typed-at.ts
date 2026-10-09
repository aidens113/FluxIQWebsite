// Human typing for the looping illustrations: quick keys at uneven gaps, a
// beat after some spaces and after punctuation. Deterministic, so the same
// moment always shows the same text.

const noise = (n: number): number => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

/** How many characters of `text` are typed `ms` after typing starts. */
export function typedAt(text: string, ms: number, seed = 1): number {
  let at = 0;
  for (let i = 0; i < text.length; i++) {
    const r = noise(i + seed * 31);
    let gap = 26 + r * 44;
    const prev = text[i - 1];
    if (prev === " " && r > 0.55) gap += 80;
    if (prev === "," || prev === "." || prev === "!") gap += 190;
    if (r > 0.94) gap += 130;
    at += gap;
    if (at > ms) return i;
  }
  return text.length;
}
