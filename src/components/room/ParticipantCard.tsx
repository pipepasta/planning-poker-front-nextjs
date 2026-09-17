import { Check } from "lucide-react";
import { Spinner } from "@/src/components/ui/Spinner";
import { cardLabel } from "@/src/domain/deck";
import { cn } from "@/src/lib/cn";
import type { SnapshotParticipant } from "@/src/protocol/messages";

interface Props {
    participant: SnapshotParticipant;
    revealed: boolean;
    isMe: boolean;
    index: number;
}

export const ParticipantCard = ({
    participant,
    revealed,
    isMe,
    index,
}: Props) => {
    const flipped = revealed && typeof participant.vote === "string";
    const face = participant.vote == null ? "?" : cardLabel(participant.vote);
    return (
        <div className="flex w-20 flex-col items-center gap-1.5">
            <div
                className={cn(
                    "relative h-24 w-16 rounded-lg",
                    isMe &&
                        "ring-2 ring-ring/60 ring-offset-2 ring-offset-card",
                )}
                style={{ perspective: "800px" }}
            >
                <div
                    className={cn(
                        "flip relative h-full w-full",
                        flipped && "is-flipped",
                    )}
                    // Staggered so a reveal ripples across the panel instead of
                    // every card turning on the same frame.
                    style={{ transitionDelay: `${index * 70}ms` }}
                >
                    <div
                        role="img"
                        aria-label={participant.hasVoted ? "Voted" : "Waiting"}
                        className={cn(
                            "face absolute inset-0 flex items-center justify-center rounded-lg border",
                            participant.hasVoted
                                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                                : "border-dashed border-muted-foreground/40 bg-muted/20",
                        )}
                    >
                        {participant.hasVoted ? (
                            <Check size={20} strokeWidth={3} />
                        ) : (
                            <Spinner className="size-5" />
                        )}
                    </div>
                    <div className="face face-back absolute inset-0 flex items-center justify-center rounded-lg border border-border bg-card text-2xl font-semibold text-card-foreground shadow-sm">
                        {face}
                    </div>
                </div>
            </div>
            <span
                className="w-full truncate text-center text-xs font-medium"
                title={participant.name}
            >
                {participant.name}
            </span>
        </div>
    );
};
