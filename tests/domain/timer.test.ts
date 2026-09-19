import { describe, expect, it } from "vitest";
import { elapsedMs, formatDuration } from "@/src/domain/timer";

describe("timer", () => {
    it("formats durations", () => {
        expect(formatDuration(0)).toBe("00:00:00");
        expect(formatDuration(61_999)).toBe("00:01:01");
        expect(formatDuration(3_600_000 * 2 + 5_000)).toBe("02:00:05");
        expect(formatDuration(-5)).toBe("00:00:00");
    });

    it("computes elapsed for running and paused timers", () => {
        expect(
            elapsedMs(
                { status: "running", startedAt: 1000, accumulatedMs: 500 },
                3000,
            ),
        ).toBe(2500);
        expect(
            elapsedMs(
                { status: "paused", startedAt: null, accumulatedMs: 500 },
                3000,
            ),
        ).toBe(500);
    });
});
