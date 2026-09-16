import { describe, expect, it } from "vitest";
import { DECKS } from "@/src/domain/deck";
import { summarize } from "@/src/domain/results";

const fib = DECKS.fibonacci;
const tee = DECKS.tshirt;

describe("summarize", () => {
    it("computes average, mode and decision for numeric decks", () => {
        expect(summarize(fib, ["3", "5", "5"])).toEqual({
            average: "4.3",
            mode: ["5"],
            decision: "5",
            consensus: false,
            counted: 3,
        });
    });

    it("decision uses adjacency on the deck", () => {
        expect(summarize(fib, ["3", "5", "8"]).decision).toBe("5");
        expect(summarize(fib, ["3", "8"]).decision).toBe("discuss");
        expect(summarize(fib, ["1", "2", "3", "5"]).decision).toBe("discuss");
        expect(summarize(tee, ["S", "M"]).decision).toBe("M");
        expect(summarize(tee, ["S", "L"]).decision).toBe("discuss");
    });

    it("ignores skip and null, reports multiple modes in deck order", () => {
        const s = summarize(fib, ["8", null, "skip", "3"]);
        expect(s.counted).toBe(2);
        expect(s.mode).toEqual(["3", "8"]);
        expect(s.average).toBe("5.5");
        expect(s.consensus).toBe(false);
    });

    it("handles empty and skip-only rounds", () => {
        expect(summarize(fib, [])).toEqual({
            average: "-",
            mode: [],
            decision: "-",
            consensus: false,
            counted: 0,
        });
        expect(summarize(fib, ["skip", "skip"]).average).toBe("-");
    });

    it("ordinal decks have no average", () => {
        expect(summarize(tee, ["M", "M"])).toEqual({
            average: null,
            mode: ["M"],
            decision: "M",
            consensus: true,
            counted: 2,
        });
    });

    it("consensus requires everyone to vote the same non-skip card", () => {
        expect(summarize(fib, ["5", "5"]).consensus).toBe(true);
        expect(summarize(fib, ["5", "5", null]).consensus).toBe(false);
        expect(summarize(fib, ["5", "5", "skip"]).consensus).toBe(false);
    });
});
