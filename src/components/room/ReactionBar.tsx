"use client";
import { SmilePlus } from "lucide-react";
import { useState } from "react";
import { EmojiDialog } from "./EmojiDialog";

export const STANDARD_EMOJIS = ["👍", "❤️", "😤", "😁", "❓", "🤯", "☕️"];

export const ReactionBar = ({
    onReact,
}: {
    onReact: (emoji: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            role="toolbar"
            aria-label="Reactions"
            className="flex items-center gap-1 rounded-full border-2 border-ink bg-cream px-2 py-1 shadow-hard"
        >
            {STANDARD_EMOJIS.map((e) => (
                <button
                    key={e}
                    type="button"
                    aria-label={`React ${e}`}
                    onClick={() => onReact(e)}
                    className="size-9 rounded-full text-xl transition-transform hover:scale-125 active:scale-90"
                >
                    {e}
                </button>
            ))}
            <button
                type="button"
                aria-label="More emojis"
                onClick={() => setOpen(true)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-ink/10"
            >
                <SmilePlus size={20} />
            </button>
            <EmojiDialog open={open} onOpenChange={setOpen} onPick={onReact} />
        </div>
    );
};
