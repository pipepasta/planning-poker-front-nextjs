import type { Emoji } from "frimousse";
import { Plus, Smile, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
    EmojiPicker,
    EmojiPickerContent,
    EmojiPickerFooter,
    EmojiPickerSearch,
} from "@/app/_components/features/reactions/EmojiPicker";
import ReactionButton from "@/app/_components/features/reactions/ReactionButton";
import { standardEmojis } from "@/app/_types/types";

type ReactionButtonContainerProps = {
    onClick: (emoji: Emoji) => void;
};

const ReactionButtonContainer: React.FC<ReactionButtonContainerProps> = ({
    onClick,
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    useEffect(() => {
        if (showEmojiPicker) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showEmojiPicker]);

    const handleEmojiSelect = (emoji: Emoji) => {
        onClick(emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="max-sm:hidden relative flex flex-col items-center justify-center">
            {/* リアクションボタン */}
            <div
                className={`absolute -top-16 flex justify-center items-center rounded-full bg-zinc-600 px-1 py-1 bg-opacity-30 transition-all duration-200 ease-in-out transform ${isExpanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"}`}
            >
                {standardEmojis.map((emoji: Emoji) => (
                    <ReactionButton
                        key={emoji.label}
                        emoji={emoji}
                        onClick={() => onClick(emoji)}
                    />
                ))}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(true)}
                    className="select-none flex items-center justify-center size-12 m-1 bg-white rounded-full shadow-lg hover:bg-zinc-100 border border-zinc-300 transition transform active:scale-90"
                >
                    <span className="text-xl">
                        <Plus size={20} />
                    </span>
                </button>
            </div>

            <button
                type="button"
                className="flex items-center justify-center size-12 m-1 bg-white rounded-full shadow-lg hover:bg-zinc-100 border border-zinc-300"
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                {isExpanded ? <X size={20} /> : <Smile size={20} />}
            </button>

            {showEmojiPicker && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="emoji picker"
                    className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowEmojiPicker(false);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setShowEmojiPicker(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-2 w-80">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">search emojis</h3>
                            <button
                                type="button"
                                className="text-zinc-500 hover:text-zinc-700"
                                onClick={() => setShowEmojiPicker(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <EmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            className="h-80 w-full"
                        >
                            <EmojiPickerSearch placeholder="search emojis..." />
                            <EmojiPickerContent />
                            <EmojiPickerFooter />
                        </EmojiPicker>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReactionButtonContainer;
