"use client";
import { useEffect, useState } from "react";
import { elapsedMs, formatDuration, type TimerState } from "@/src/domain/timer";

export const useTimerDisplay = (
    timer: TimerState | undefined,
    clockOffsetMs: number,
): string => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        // Repaint at once so a paused -> running flip shows the right value
        // without waiting up to a second for the first tick.
        setNow(Date.now());
        if (timer?.status !== "running") return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [timer?.status]);
    if (!timer) return "00:00:00";
    return formatDuration(elapsedMs(timer, now + clockOffsetMs));
};
