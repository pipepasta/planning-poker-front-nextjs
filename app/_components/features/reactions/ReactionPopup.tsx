import type React from "react";
import type { ReactionType } from "@/app/_types/types";

type ReactionPopupProps = {
    reaction: ReactionType;
    x: number;
    y: number;
    username: string;
};

const ReactionPopup: React.FC<ReactionPopupProps> = ({
    reaction,
    x,
    y,
    username,
}) => {
    const emoji = reaction;
    return (
        <div
            className="absolute flex justify-center items-center left-1/2 top-1/2 z-10 emoji-animation"
            style={{
                marginLeft: x,
                marginTop: y,
            }}
        >
            <div className="text-2xl flex items-center">
                <span className="text-sm text-zinc-700 mr-2">{username}</span>
                <div className="rounded-full bg-white shadow-md px-3 py-2">
                    {emoji}
                </div>
            </div>
        </div>
    );
};

export default ReactionPopup;
