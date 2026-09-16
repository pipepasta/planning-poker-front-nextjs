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
        className="float-up pointer-events-none absolute z-30 flex flex-col items-center gap-1"
    >
        <span className="flex size-12 items-center justify-center rounded-full border-2 border-ink bg-cream text-2xl shadow-hard-sm">
            {reaction.emoji}
        </span>
        <span className="rounded-md bg-ink px-1.5 text-[10px] font-bold text-cream">
            {reaction.from.name}
        </span>
    </div>
);
