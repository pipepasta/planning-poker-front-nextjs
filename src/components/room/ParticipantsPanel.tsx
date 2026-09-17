import type { CSSProperties } from "react";
import { Panel } from "@/src/components/ui/Panel";
import type { SnapshotParticipant } from "@/src/protocol/messages";
import type { FloatingReaction } from "@/src/room/useReactions";
import { ParticipantCard } from "./ParticipantCard";
import { ReactionFloat } from "./ReactionFloat";

interface Props {
    participants: SnapshotParticipant[];
    revealed: boolean;
    myClientId: string;
    reactions: FloatingReaction[];
}

// No seat geometry any more: reactions just fan out by sender index so several
// at once do not stack on one point, and drift up out of the panel.
const floatStyle = (index: number): CSSProperties =>
    ({
        left: `${12 + (index % 6) * 14}%`,
        top: "72%",
        "--float-dx": `${((index % 3) - 1) * 24}px`,
        "--float-dy": "-180px",
    }) as CSSProperties;

export const ParticipantsPanel = ({
    participants,
    revealed,
    myClientId,
    reactions,
}: Props) => {
    const voted = participants.filter((p) => p.hasVoted).length;
    return (
        // min-h keeps the panel reading as a panel while a room is still empty.
        <Panel className="relative w-full min-h-56 p-4 sm:min-h-64 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold">Participants</h2>
                <span className="text-sm text-muted-foreground tabular-nums">
                    {voted} / {participants.length} voted
                </span>
            </div>
            {participants.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    Waiting for people to join…
                </p>
            ) : (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-5">
                    {participants.map((p, i) => (
                        <ParticipantCard
                            key={p.clientId}
                            participant={p}
                            revealed={revealed}
                            isMe={p.clientId === myClientId}
                            index={i}
                        />
                    ))}
                </div>
            )}
            {reactions.map((r) => {
                const i = participants.findIndex(
                    (p) => p.clientId === r.from.clientId,
                );
                return (
                    <ReactionFloat
                        key={r.id}
                        reaction={r}
                        style={floatStyle(i < 0 ? 0 : i)}
                    />
                );
            })}
        </Panel>
    );
};
