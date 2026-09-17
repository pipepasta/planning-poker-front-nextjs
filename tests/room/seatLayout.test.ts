import { describe, expect, it } from "vitest";
import { seatPositions } from "@/src/room/seatLayout";

describe("seatPositions", () => {
    it("puts the first seat at the bottom centre", () => {
        const [first] = seatPositions(4);
        expect(first).toEqual({ left: "50.0%", top: "84.0%" });
    });
    it("spaces seats evenly", () => {
        const p = seatPositions(4);
        expect(p[1]).toEqual({ left: "10.0%", top: "50.0%" });
        expect(p[2]).toEqual({ left: "50.0%", top: "16.0%" });
        expect(p[3]).toEqual({ left: "90.0%", top: "50.0%" });
    });
    it("keeps the ring inside the felt", () => {
        const p = seatPositions(3);
        expect(p[1]).toEqual({ left: "15.4%", top: "33.0%" });
        expect(p[2]).toEqual({ left: "84.6%", top: "33.0%" });
    });
    it("rotates the named participant to the bottom centre seat", () => {
        const p = seatPositions(4, 2);
        expect(p[2]).toEqual({ left: "50.0%", top: "84.0%" });
        expect(p[3]).toEqual({ left: "10.0%", top: "50.0%" });
        expect(p[0]).toEqual({ left: "50.0%", top: "16.0%" });
        expect(p[1]).toEqual({ left: "90.0%", top: "50.0%" });
    });
    it("is unchanged when the rotation is zero", () => {
        expect(seatPositions(5, 0)).toEqual(seatPositions(5));
    });
    it("handles zero", () => {
        expect(seatPositions(0)).toEqual([]);
        expect(seatPositions(0, 3)).toEqual([]);
    });
});
