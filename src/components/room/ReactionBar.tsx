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
            className="flex max-w-full shrink-0 flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-card px-2 py-1 shadow-sm"
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
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
                <SmilePlus size={20} />
            </button>
            <EmojiDialog open={open} onOpenChange={setOpen} onPick={onReact} />
        </div>
    );
};
