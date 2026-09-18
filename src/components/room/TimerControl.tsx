"use client";
import { Pause, Play, RotateCcw } from "lucide-react";
import { IconButton } from "@/src/components/ui/IconButton";
import type { TimerState } from "@/src/domain/timer";
import type { TimerActionName } from "@/src/protocol/messages";
import { useTimerDisplay } from "@/src/room/useTimerDisplay";

interface Props {
    timer: TimerState | undefined;
    clockOffsetMs: number;
    onAction: (action: TimerActionName) => void;
}

export const TimerControl = ({ timer, clockOffsetMs, onAction }: Props) => {
    const text = useTimerDisplay(timer, clockOffsetMs);
    const paused = timer?.status === "paused";
    return (
        <div className="flex items-center gap-1">
            {/* A step smaller than the bar's other text below `sm`: the
                wordmark keeps its word at 390px, and this is where the room
                settings and the personal ones folding behind the gear still
                leave the row a few pixels short of the padding edge. */}
            <span
                className="text-sm font-semibold tabular-nums sm:text-lg"
                aria-live="off"
            >
                {text}
            </span>
            <IconButton
                className="size-8 sm:size-10"
                label={paused ? "Resume timer" : "Pause timer"}
                disabled={!timer}
                onClick={() => onAction(paused ? "resumeTimer" : "pauseTimer")}
            >
                {paused ? <Play size={18} /> : <Pause size={18} />}
            </IconButton>
            <IconButton
                className="size-8 sm:size-10"
                label="Reset timer"
                disabled={!timer}
                onClick={() => onAction("resetTimer")}
            >
                <RotateCcw size={18} />
            </IconButton>
        </div>
    );
};
