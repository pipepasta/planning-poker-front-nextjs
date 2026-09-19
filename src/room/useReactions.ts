"use client";
import { useCallback, useState } from "react";

export interface FloatingReaction {
    id: number;
    emoji: string;
    from: { clientId: string; name: string };
    /** Horizontal start, as a percentage of the participants panel's width. */
    x: number;
    /** Vertical jitter around the panel's launch line, in percentage points. */
    y: number;
}

/** Keeps the emoji clear of the panel's left and right edges at 390px. */
const X_MIN = 15;
const X_MAX = 85;
const Y_JITTER = 8;

export const randomOffset = (random: () => number = Math.random) => ({
    x: X_MIN + random() * (X_MAX - X_MIN),
    y: (random() * 2 - 1) * Y_JITTER,
});

let nextId = 1;

export const useReactions = () => {
    const [reactions, setReactions] = useState<FloatingReaction[]>([]);
    const push = useCallback(
        (emoji: string, from: FloatingReaction["from"]) => {
            const id = nextId++;
            // The scatter is chosen once, at push time, so repeats from one
            // person land somewhere new instead of stacking on a fixed seat.
            setReactions((prev) => [
                ...prev,
                { id, emoji, from, ...randomOffset() },
            ]);
            setTimeout(
                () => setReactions((prev) => prev.filter((r) => r.id !== id)),
                2500,
            );
        },
        [],
    );
    return { reactions, push };
};
