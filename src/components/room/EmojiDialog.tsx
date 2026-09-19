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
                    className="mb-2 h-10 rounded-lg border border-input bg-card px-3"
                />
                <EmojiPicker.Viewport className="relative flex-1 overflow-y-auto rounded-lg border border-border bg-card">
                    <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                        Loading…
                    </EmojiPicker.Loading>
                    <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                        No emoji found.
                    </EmojiPicker.Empty>
                    <EmojiPicker.List
                        className="select-none pb-1"
                        components={{
                            CategoryHeader: ({ category, ...props }) => (
                                <div
                                    {...props}
                                    className="bg-card px-2 pb-1 pt-2 text-xs font-semibold text-muted-foreground"
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
                                    className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-accent"
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
