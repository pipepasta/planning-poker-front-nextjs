"use client";
import { useSyncExternalStore } from "react";
import type { SnapshotParticipant } from "@/src/protocol/messages";
import { seatPositions } from "@/src/room/seatLayout";
import type { FloatingReaction } from "@/src/room/useReactions";
import { ReactionFloat } from "./ReactionFloat";
import { Seat } from "./Seat";

const query = "(min-width: 640px)";
const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
};
const useIsWide = () =>
    useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
    );

interface Props {
    participants: SnapshotParticipant[];
    revealed: boolean;
    myClientId: string;
    reactions: FloatingReaction[];
    children: React.ReactNode;
}

export const Table = ({
    participants,
    revealed,
    myClientId,
    reactions,
    children,
}: Props) => {
    const wide = useIsWide();
    const positions = seatPositions(participants.length);
    const indexOf = (clientId: string) =>
        participants.findIndex((p) => p.clientId === clientId);

    const seats = participants.map((p, i) => (
        <Seat
            key={p.clientId}
            participant={p}
            revealed={revealed}
            isMe={p.clientId === myClientId}
            index={i}
            style={
                wide
                    ? {
                          position: "absolute",
                          left: positions[i].left,
                          top: positions[i].top,
                          transform: "translate(-50%, -50%)",
                      }
                    : undefined
            }
        />
    ));

    return (
        <div className="flex w-full flex-col items-center gap-3">
            {!wide && (
                <div className="flex flex-wrap justify-center gap-2">
                    {seats}
                </div>
            )}
            <div className="relative mx-auto aspect-[16/10] max-h-[62vh] w-full max-w-4xl">
                <div className="absolute inset-[12%] rounded-[50%] border-4 border-ink bg-felt shadow-hard-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
                {wide && seats}
                {reactions.map((r) => {
                    const i = indexOf(r.from.clientId);
                    const pos =
                        wide && i >= 0
                            ? positions[i]
                            : { left: "50%", top: "85%" };
                    return (
                        <ReactionFloat
                            key={r.id}
                            reaction={r}
                            style={{ left: pos.left, top: pos.top }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
