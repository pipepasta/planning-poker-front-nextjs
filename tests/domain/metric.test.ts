import { describe, expect, it } from "vitest";
import {
    DEFAULT_METRIC_ID,
    isMetricId,
    METRIC_IDS,
    METRICS,
    metricLabel,
} from "@/src/domain/metric";

// Drift guard: these values are duplicated in
// planning-poker-server/cdk/src/domain/metric.ts. Changing them here without
// changing them there makes the server reject what the picker sends, so this
// test is deliberately exact.
describe("metric definitions (server parity)", () => {
    it("pins the metric ids", () => {
        expect(METRIC_IDS).toEqual(["average", "mode", "decision"]);
        expect(METRICS.map((m) => m.id)).toEqual([
            "average",
            "mode",
            "decision",
        ]);
    });

    it("defaults to the scrum decision", () => {
        expect(DEFAULT_METRIC_ID).toBe("decision");
    });

    it("recognises metric ids", () => {
        expect(isMetricId("average")).toBe(true);
        expect(isMetricId("decision")).toBe(true);
        expect(isMetricId("median")).toBe(false);
        expect(isMetricId(3)).toBe(false);
        expect(isMetricId(undefined)).toBe(false);
    });

    it("labels every metric", () => {
        expect(METRICS.map((m) => m.label)).toEqual([
            "Average",
            "Mode",
            "Decision",
        ]);
        expect(metricLabel("mode")).toBe("Mode");
    });
});
