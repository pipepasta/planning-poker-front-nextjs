import { describe, expect, it } from "vitest";
import { randomOffset } from "@/src/room/useReactions";

describe("randomOffset", () => {
    it("keeps x inside the 15-85% band at both extremes of the RNG", () => {
        expect(randomOffset(() => 0).x).toBe(15);
        expect(randomOffset(() => 0.999999).x).toBeLessThanOrEqual(85);
    });

    it("jitters y by at most 8 points either way", () => {
        expect(randomOffset(() => 0).y).toBe(-8);
        expect(randomOffset(() => 1).y).toBe(8);
        expect(randomOffset(() => 0.5).y).toBe(0);
    });

    it("scatters successive calls instead of repeating one point", () => {
        const xs = new Set(
            Array.from({ length: 20 }, () => randomOffset().x.toFixed(6)),
        );
        expect(xs.size).toBeGreaterThan(15);
    });
});
