import { describe, expect, it } from "vitest";
import {
    fanArc,
    fanFraction,
    fanLeft,
    fanSink,
    fanTilt,
    MAX_TILT,
} from "@/src/components/room/fan";

// The hand has to fit and fan for any deck, so these assert the shape of the
// geometry for every card count rather than for the two decks that ship.
const counts = Array.from({ length: 20 }, (_, i) => i + 1);

describe("fan layout", () => {
    it("spreads the cards from one edge of the box to the other", () => {
        expect(fanFraction(0, 11)).toBe(0);
        expect(fanFraction(5, 11)).toBe(0.5);
        expect(fanFraction(10, 11)).toBe(1);
    });

    it("centres a lone card instead of dividing by zero", () => {
        expect(fanFraction(0, 1)).toBe(0.5);
        expect(fanTilt(0, 1)).toBe(0);
        expect(fanSink(fanTilt(0, 1))).toBe("0px");
        expect(fanLeft(0, 1)).toBe("calc((100% - var(--card-w)) * 0.5)");
    });

    it("never places a card outside the box, for any count", () => {
        for (const n of counts) {
            for (let i = 0; i < n; i++) {
                const fraction = fanFraction(i, n);
                expect(fraction).toBeGreaterThanOrEqual(0);
                expect(fraction).toBeLessThanOrEqual(1);
            }
        }
    });

    it("positions every card off the box width, so nothing has a fixed total", () => {
        expect(fanLeft(3, 11)).toBe("calc((100% - var(--card-w)) * 0.3)");
        for (const n of counts) {
            for (let i = 0; i < n; i++) {
                expect(fanLeft(i, n)).toContain("100% - var(--card-w)");
            }
        }
    });
});

describe("fan tilt", () => {
    it("leans from -MAX_TILT on the left to +MAX_TILT on the right", () => {
        expect(fanTilt(0, 11)).toBeCloseTo(-MAX_TILT);
        expect(fanTilt(5, 11)).toBeCloseTo(0);
        expect(fanTilt(10, 11)).toBeCloseTo(MAX_TILT);
        expect(fanTilt(0, 5)).toBeCloseTo(-MAX_TILT);
        expect(fanTilt(4, 5)).toBeCloseTo(MAX_TILT);
    });

    it("rises left to right and stays symmetric, for any count", () => {
        for (const n of counts.filter((c) => c > 1)) {
            for (let i = 1; i < n; i++) {
                expect(fanTilt(i, n)).toBeGreaterThan(fanTilt(i - 1, n));
            }
            for (let i = 0; i < n; i++) {
                expect(fanTilt(i, n)).toBeCloseTo(-fanTilt(n - 1 - i, n));
            }
            expect(Math.abs(fanTilt(0, n))).toBeLessThanOrEqual(MAX_TILT);
        }
    });
});

describe("fan arc", () => {
    it("peaks in the centre and falls away to both ends", () => {
        const drops = Array.from({ length: 11 }, (_, i) =>
            fanArc(fanTilt(i, 11)),
        );
        expect(drops[5]).toBe(0);
        for (let i = 1; i <= 5; i++)
            expect(drops[i]).toBeLessThan(drops[i - 1]);
        for (let i = 6; i < 11; i++)
            expect(drops[i]).toBeGreaterThan(drops[i - 1]);
        expect(drops[0]).toBeCloseTo(drops[10]);
    });

    it("drops the end cards a visible amount below the middle", () => {
        expect(fanArc(MAX_TILT)).toBeGreaterThan(8);
        expect(fanArc(MAX_TILT)).toBeCloseTo(16.78, 1);
    });

    it("keeps the centre card highest, for any count", () => {
        for (const n of counts.filter((c) => c > 2)) {
            const drops = Array.from({ length: n }, (_, i) =>
                fanArc(fanTilt(i, n)),
            );
            const middle = Math.min(...drops);
            expect(middle).toBe(drops[Math.floor((n - 1) / 2)]);
            expect(drops[0]).toBeGreaterThan(middle);
            expect(drops[n - 1]).toBeGreaterThan(middle);
        }
    });
});

describe("fan sink", () => {
    it("cancels the corner's rise off the card's own size", () => {
        // Sink = arc + (w/2)sin - h(1 - cos): the two trig terms stay as calc
        // coefficients because the card scales with the viewport.
        expect(fanSink(MAX_TILT)).toBe(
            "calc(16.7826px + 0.104 * var(--card-w) - 0.0219 * var(--card-h))",
        );
    });

    it("sinks the same amount either side of the centre", () => {
        expect(fanSink(-MAX_TILT)).toBe(fanSink(MAX_TILT));
    });
});
