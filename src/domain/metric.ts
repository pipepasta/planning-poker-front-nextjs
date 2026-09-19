// PARITY: the block below must stay equivalent to the server's copy at
// planning-poker-server/cdk/src/domain/metric.ts. The metric is room-wide
// state the server validates and broadcasts, so a one-sided edit makes the
// server reject the ids we send. tests/domain/metric.test.ts pins the ids and
// the default; the server has the same test.
export type MetricId = "average" | "mode" | "decision";

export const METRIC_IDS: readonly MetricId[] = ["average", "mode", "decision"];

export const DEFAULT_METRIC_ID: MetricId = "decision";

export const isMetricId = (value: unknown): value is MetricId =>
    typeof value === "string" &&
    (METRIC_IDS as readonly string[]).includes(value);

// Presentation only, so the server has no copy of this.
export interface Metric {
    readonly id: MetricId;
    readonly label: string;
}

export const METRICS: readonly Metric[] = [
    { id: "average", label: "Average" },
    { id: "mode", label: "Mode" },
    // The wire id stays `decision` — it is room state the server validates and
    // old rooms carry — but the team calls this the scrum result, so that is
    // what the room says.
    { id: "decision", label: "Scrum" },
];

export const metricLabel = (id: MetricId): string =>
    METRICS.find((m) => m.id === id)?.label ?? id;
