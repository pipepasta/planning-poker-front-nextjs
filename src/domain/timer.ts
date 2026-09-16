export interface TimerState {
    readonly status: "running" | "paused";
    readonly startedAt: number | null;
    readonly accumulatedMs: number;
}

export const elapsedMs = (timer: TimerState, now: number): number =>
    timer.accumulatedMs +
    (timer.status === "running" && timer.startedAt !== null
        ? Math.max(0, now - timer.startedAt)
        : 0);

export const formatDuration = (ms: number): string => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
};
