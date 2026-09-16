"use client";
import { EmojiPicker } from "frimousse";
import { Dialog, DialogContent } from "@/src/components/ui/Dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPick: (emoji: string) => void;
}

export const EmojiDialog = ({ open, onOpenChange, onPick }: Props) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent title="Pick an emoji">
            <EmojiPicker.Root
                className="flex h-80 flex-col"
                onEmojiSelect={({ emoji }) => {
                    onPick(emoji);
                    onOpenChange(false);
                }}
            >
                <EmojiPicker.Search
                    autoFocus
                    placeholder="Search emojis…"
                    className="mb-2 h-10 rounded-xl border-2 border-ink bg-white px-3"
                />
                <EmojiPicker.Viewport className="relative flex-1 overflow-y-auto rounded-xl border-2 border-ink bg-white">
                    <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-ink-soft">
                        Loading…
                    </EmojiPicker.Loading>
                    <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-ink-soft">
                        No emoji found.
                    </EmojiPicker.Empty>
                    <EmojiPicker.List
                        className="select-none pb-1"
                        components={{
                            CategoryHeader: ({ category, ...props }) => (
                                <div
                                    {...props}
                                    className="bg-white px-2 pb-1 pt-2 text-xs font-bold text-ink-soft"
                                >
                                    {category.label}
                                </div>
                            ),
                            Row: ({ children, ...props }) => (
                                <div {...props} className="px-1">
                                    {children}
                                </div>
                            ),
                            Emoji: ({ emoji, ...props }) => (
                                <button
                                    {...props}
                                    className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-macaroni"
                                >
                                    {emoji.emoji}
                                </button>
                            ),
                        }}
                    />
                </EmojiPicker.Viewport>
            </EmojiPicker.Root>
        </DialogContent>
    </Dialog>
);
