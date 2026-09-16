"use client";
import { useCallback, useState } from "react";

export interface FloatingReaction {
    id: number;
    emoji: string;
    from: { clientId: string; name: string };
}

let nextId = 1;

export const useReactions = () => {
    const [reactions, setReactions] = useState<FloatingReaction[]>([]);
    const push = useCallback(
        (emoji: string, from: FloatingReaction["from"]) => {
            const id = nextId++;
            setReactions((prev) => [...prev, { id, emoji, from }]);
            setTimeout(
                () => setReactions((prev) => prev.filter((r) => r.id !== id)),
                2500,
            );
        },
        [],
    );
    return { reactions, push };
};
