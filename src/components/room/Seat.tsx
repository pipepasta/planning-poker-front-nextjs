import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { cardLabel } from "@/src/domain/deck";
import { cn } from "@/src/lib/cn";
import type { SnapshotParticipant } from "@/src/protocol/messages";

interface Props {
    participant: SnapshotParticipant;
    revealed: boolean;
    isMe: boolean;
    index: number;
    style?: CSSProperties;
    className?: string;
}

export const Seat = ({
    participant,
    revealed,
    isMe,
    index,
    style,
    className,
}: Props) => {
    const flipped = revealed && typeof participant.vote === "string";
    const face = participant.vote == null ? "?" : cardLabel(participant.vote);
    return (
        <div
            style={style}
            className={cn("flex w-24 flex-col items-center gap-1", className)}
        >
            <div
                className="relative h-20 w-14 sm:h-[5.75rem] sm:w-16"
                style={{ perspective: "800px" }}
            >
                {/* Placemat: an empty seat still reads as a seat at the table. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-[50%] border-2 border-ink/30"
                />
                {isMe && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-macaroni"
                    />
                )}
                <div
                    className={cn(
                        "flip relative h-full w-full",
                        flipped && "is-flipped",
                    )}
                    style={{ transitionDelay: `${index * 70}ms` }}
                >
                    <div
                        className={cn(
                            "face absolute inset-0 flex items-center justify-center rounded-lg border-ink",
                            isMe ? "border-[3px]" : "border-2",
                            participant.hasVoted
                                ? "bg-ink shadow-hard-sm bg-[repeating-linear-gradient(45deg,transparent_0_6px,rgba(255,247,225,0.18)_6px_8px)]"
                                : "border-dashed bg-cream/60 animate-pulse",
                        )}
                        role="img"
                        aria-label={participant.hasVoted ? "Voted" : "Waiting"}
                    >
                        {participant.hasVoted && (
                            <span className="rounded-full bg-macaroni p-1 text-ink">
                                <Check size={16} strokeWidth={3} />
                            </span>
                        )}
                    </div>
                    <div
                        className={cn(
                            "face face-back absolute inset-0 flex items-center justify-center rounded-lg border-ink bg-cream font-display text-2xl font-extrabold text-ink shadow-hard-sm",
                            isMe ? "border-[3px]" : "border-2",
                        )}
                    >
                        {face}
                    </div>
                </div>
            </div>
            <span
                className={cn(
                    "max-w-24 truncate rounded-md px-1.5 text-xs font-bold text-ink",
                    isMe && "bg-macaroni",
                )}
                title={participant.name}
            >
                {participant.name}
            </span>
        </div>
    );
};
