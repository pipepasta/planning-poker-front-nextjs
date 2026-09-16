import { describe, expect, it } from "vitest";
import { seatPositions } from "@/src/room/seatLayout";

describe("seatPositions", () => {
    it("puts the first seat at the bottom centre", () => {
        const [first] = seatPositions(4);
        expect(first).toEqual({ left: "50.0%", top: "90.0%" });
    });
    it("spaces seats evenly", () => {
        const p = seatPositions(4);
        expect(p[1].left).toBe("4.0%");
        expect(p[2].top).toBe("10.0%");
        expect(p[3].left).toBe("96.0%");
    });
    it("handles zero", () => {
        expect(seatPositions(0)).toEqual([]);
    });
});
