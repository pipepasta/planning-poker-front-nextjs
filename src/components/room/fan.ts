// Fan geometry for the hand. Two numbers describe the whole thing: how far the
// end cards lean, and how far below the cards the hand that holds them pivots.
// Where each card sits, how far it sinks, and how tall the fan box has to be
// all follow from those two, for any card count and any width, so there is
// nothing to re-tune when the deck changes.
//
// The layout is a full-width box with absolutely positioned cards: card i sits
// at `left: (100% - card-w) * i / (n - 1)`, so the leftmost card's left edge and
// the rightmost card's right edge touch the box's edges and the overlap is
// whatever the remaining width dictates. Nothing has a fixed total width, so
// nothing can overflow and no horizontal scroller is needed.

/** Degrees of lean at each end of the fan.
 *
 * 12deg is as far as the end cards can lean before their rotated top corners
 * leave the page's gutters: rotating about the bottom edge pushes a card's top
 * corner `(w/2)cos + h*sin - w/2` past its own box, which is 0.28 * w for the
 * 5:7 cards here — 22.4px for the widest (5rem) card, inside the 24px the
 * shell's px-3 plus the hand's own px-3 leave on each side. */
export const MAX_TILT = 12;

/** How far below the cards' bottom edge the hand pivots, in px.
 *
 * This is the radius of the circle the cards' top corners ride on, so it sets
 * how deep the arc is: 48rem gives the end cards a 16.8px drop. It is also what
 * makes the fan physically coherent — a hand pivoting this far down spreads
 * 2 * 768 * sin(12deg) = 319px, which is the width the fan actually gets on the
 * phones this has to fit. */
const PIVOT_PX = 768;

const RAD = Math.PI / 180;
const round = (n: number) => Math.round(n * 10000) / 10000;

/** 0 at the left end of the fan, 1 at the right. A lone card sits in the
 * middle, which is also the guard against dividing by n - 1 = 0. */
export const fanFraction = (index: number, total: number) =>
    total > 1 ? index / (total - 1) : 0.5;

/** -MAX_TILT at the left end, +MAX_TILT at the right, 0 in the centre. */
export const fanTilt = (index: number, total: number) =>
    total > 1 ? (2 * fanFraction(index, total) - 1) * MAX_TILT : 0;

/** How much lower a card at this tilt rides than the centre card, in px: the
 * sagitta of the pivot circle. This is the arc the eye reads — highest in the
 * centre, falling away symmetrically to both ends — and it is the same number
 * at every viewport, because the pivot is a fixed distance rather than a
 * fraction of the card. */
export const fanArc = (tilt: number) => PIVOT_PX * (1 - Math.cos(tilt * RAD));

/** `left` for card `index`: the cards spread evenly across the fan box. */
export const fanLeft = (index: number, total: number) =>
    `calc((100% - var(--card-w)) * ${round(fanFraction(index, total))})`;

/** `translateY` for a card at this tilt, as a CSS length.
 *
 * Rotating about the bottom edge swings a card's outer top corner *up* by
 * `(w/2)sin - h(1 - cos)`, which is why rotation alone bends the row the wrong
 * way. The sink cancels exactly that, then drops the card by `fanArc`, so the
 * corner lands `fanArc` px below the centre card's top edge whatever the card
 * measures. The card's width and height are CSS-side (they scale with the
 * viewport), so those two terms stay as calc coefficients. */
export const fanSink = (tilt: number) => {
    const rad = Math.abs(tilt) * RAD;
    if (rad === 0) return "0px";
    return `calc(${round(fanArc(tilt))}px + ${round(Math.sin(rad) / 2)} * var(--card-w) - ${round(1 - Math.cos(rad))} * var(--card-h))`;
};

/** Headroom above the cards, for the rise a selected (1rem) and hovered
 * (0.5rem) card get. */
export const FAN_RISE = "1.75rem";

/** The deepest sink any card takes, i.e. the room the arc needs below the
 * cards. The end cards define it. */
export const FAN_SINK_MAX = fanSink(MAX_TILT);
