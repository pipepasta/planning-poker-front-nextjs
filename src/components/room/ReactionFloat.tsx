import type { CSSProperties } from "react";
import type { FloatingReaction } from "@/src/room/useReactions";

export const ReactionFloat = ({
    reaction,
    style,
}: {
    reaction: FloatingReaction;
    style: CSSProperties;
}) => (
    <div
        style={style}
        className="float-up pointer-events-none absolute z-10 flex flex-col items-center gap-1"
    >
        <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-2xl shadow-md">
            {reaction.emoji}
        </span>
        <span className="max-w-24 truncate rounded-md bg-card px-1.5 text-[10px] font-semibold text-muted-foreground shadow-sm">
            {reaction.from.name}
        </span>
    </div>
);
