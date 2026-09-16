"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { DECKS } from "@/src/domain/deck";
import { summarize } from "@/src/domain/results";
import { useSession } from "@/src/lib/session";
import { useReactions } from "@/src/room/useReactions";
import { useRoomConnection } from "@/src/room/useRoomConnection";
import { CenterPanel } from "./CenterPanel";
import { ConnectionBanner } from "./ConnectionBanner";
import { Hand } from "./Hand";
import { ReactionBar } from "./ReactionBar";
import { RoomHeader } from "./RoomHeader";
import { Table } from "./Table";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const useWindowSize = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const update = () =>
            setSize({ width: window.innerWidth, height: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return size;
};

const RoomSkeleton = () => (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="aspect-[16/10] w-full rounded-[50%]" />
        <Skeleton className="h-28 w-2/3" />
    </div>
);

const ConnectedRoom = ({
    roomId,
    userId,
    name,
    getToken,
    rename,
}: {
    roomId: string;
    userId: string;
    name: string;
    getToken: () => Promise<string | null>;
    rename: (n: string) => Promise<void>;
}) => {
    const { reactions, push } = useReactions();
    const { state, actions } = useRoomConnection({
        roomId,
        myClientId: userId,
        name,
        getToken,
        onReaction: push,
    });
    const { width, height } = useWindowSize();
    const room = state.room;
    const deck = DECKS[room?.deckId ?? "fibonacci"];
    const revealed = room?.phase === "revealed";
    const consensus =
        !!room &&
        revealed &&
        summarize(
            deck,
            room.participants.map((p) => p.vote),
        ).consensus;

    const [celebrate, setCelebrate] = useState(false);
    useEffect(() => {
        if (!consensus) return;
        setCelebrate(true);
        const id = setTimeout(() => setCelebrate(false), 4000);
        return () => clearTimeout(id);
    }, [consensus]);

    return (
        <div className="flex min-h-dvh flex-col">
            {celebrate && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={400}
                />
            )}
            <RoomHeader
                roomId={roomId}
                name={name}
                onRename={rename}
                timer={room?.timer}
                clockOffsetMs={state.clockOffsetMs}
                onTimer={actions.timer}
                deckId={deck.id}
                onDeck={actions.changeDeck}
            />
            <ConnectionBanner status={state.connection} />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-2 px-3 py-4">
                {room ? (
                    <Table
                        participants={room.participants}
                        revealed={revealed}
                        myClientId={userId}
                        reactions={reactions}
                    >
                        <CenterPanel
                            phase={room.phase}
                            deck={deck}
                            participants={room.participants}
                            onReveal={actions.reveal}
                            onNextRound={actions.nextRound}
                        />
                    </Table>
                ) : (
                    <RoomSkeleton />
                )}
                <ReactionBar onReact={actions.react} />
                <Hand
                    deck={deck}
                    selected={state.myCard}
                    onSelect={actions.selectCard}
                    disabled={!room || state.connection !== "connected"}
                />
            </main>
        </div>
    );
};

export const RoomScreen = ({ roomId }: { roomId: string }) => {
    const session = useSession();
    if (session.status === "loading" || !session.userId)
        return <RoomSkeleton />;
    return (
        <ConnectedRoom
            roomId={roomId}
            userId={session.userId}
            name={session.displayName || "Guest"}
            getToken={session.getToken}
            rename={session.rename}
        />
    );
};
