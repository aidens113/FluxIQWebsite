// Where the person's cursor points, as offsets from the example site's
// top-left, measured from the rendered widget. The cursor's tip sits 2 px
// inside its box, so each centre moves by 2 to land the tip on it. On a phone
// the stage takes the available width and the panel sits one stage-width to
// the right of the site, so right-aligned controls are placed from the
// right edge: the Search button's centre sits 55 px from it, the panel's
// Stop button centre 63 px and its record button 33 px.
import type { CursorSpot } from "./scenes/scene";

type Point = readonly [number, number];

const DESKTOP: Record<Exclude<CursorSpot, null>, Point> = {
  search: [187, 109],
  button: [405, 109],
  calgary: [120, 150],
  stop: [698, 65],
  record: [727, 22],
  rest: [310, 340],
};

function phone(width: number): Record<Exclude<CursorSpot, null>, Point> {
  return {
    search: [(width - 84) / 2, 109],
    button: [width - 55, 109],
    calgary: [120, 150],
    stop: [width + width - 63, 65],
    record: [width + width - 33, 22],
    rest: [Math.round(width * 0.55), 300],
  };
}

/** The phone stage's width range; it fills the column between these. */
/** The side-by-side stage's natural width; narrower columns scale it down. */
export const DESKTOP_WIDTH = 760;
export const PHONE_MIN = 300;
export const PHONE_MAX = 400;

export function cursorPoint(spot: Exclude<CursorSpot, null>, compact: boolean, width: number): [number, number] {
  const [x, y] = (compact ? phone(width) : DESKTOP)[spot];
  return [x - 2, y - 2];
}
