"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/src/components/ui/Button";
import { Panel } from "@/src/components/ui/Panel";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { DECKS, DEFAULT_DECK_ID } from "@/src/domain/deck";
import { summarize } from "@/src/domain/results";
import { useSession } from "@/src/lib/session";
import { useReactions } from "@/src/room/useReactions";
import { useRoomConnection } from "@/src/room/useRoomConnection";
import { ConnectionBanner } from "./ConnectionBanner";
import { Hand } from "./Hand";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { ReactionBar } from "./ReactionBar";
import { ResultsPanel } from "./ResultsPanel";
import { RoomHeader } from "./RoomHeader";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const reduceMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduceMotion = (cb: () => void) => {
    const mq = window.matchMedia(reduceMotionQuery);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
};
const usePrefersReducedMotion = () =>
    useSyncExternalStore(
        subscribeReduceMotion,
        () => window.matchMedia(reduceMotionQuery).matches,
        () => false,
    );

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

const SignedOut = ({ next }: { next: string }) => (
    <main className="flex min-h-dvh items-center justify-center p-4">
        <Panel className="flex w-full max-w-sm flex-col items-start gap-3 p-6">
            <h1 className="text-2xl font-semibold">You are signed out</h1>
            <p className="text-sm text-muted-foreground">
                Sign in again to join this room.
            </p>
            <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-sm"
            >
                Go to sign in
            </Link>
        </Panel>
    </main>
);

const RoomSkeleton = () => (
    <div className="flex w-full flex-col items-center gap-4">
        <Skeleton className="h-10 w-full max-w-3xl" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-84" />
        <Skeleton className="h-28 w-full max-w-md" />
    </div>
);

const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-3 py-4 sm:gap-5">
        {children}
    </div>
);

const LoadingRoom = () => (
    <main className="min-h-dvh">
        <Shell>
            <RoomSkeleton />
        </Shell>
    </main>
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
    const reduceMotion = usePrefersReducedMotion();
    const room = state.room;
    const deck = DECKS[room?.deckId ?? DEFAULT_DECK_ID];
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
        // A normally scrolling page: the stack has no fixed-height table to fit
        // around, so nothing needs clipping.
        <div className="min-h-dvh">
            {celebrate && !reduceMotion && (
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
            <main>
                <Shell>
                    {room ? (
                        <>
                            <ResultsPanel
                                deck={deck}
                                participants={room.participants}
                                revealed={revealed}
                            />
                            <ParticipantsPanel
                                participants={room.participants}
                                revealed={revealed}
                                myClientId={userId}
                                reactions={reactions}
                            />
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    className="w-40"
                                    onClick={actions.reveal}
                                >
                                    Reveal
                                </Button>
                                <Button
                                    size="lg"
                                    className="w-40"
                                    onClick={actions.nextRound}
                                >
                                    Next Vote
                                </Button>
                            </div>
                        </>
                    ) : (
                        <RoomSkeleton />
                    )}
                    <Hand
                        deck={deck}
                        selected={state.myCard}
                        onSelect={actions.selectCard}
                        disabled={!room || state.connection !== "connected"}
                    />
                    <ReactionBar onReact={actions.react} />
                </Shell>
            </main>
        </div>
    );
};

export const RoomScreen = ({ roomId }: { roomId: string }) => {
    const session = useSession();
    const pathname = usePathname();
    if (session.status === "loading") return <LoadingRoom />;
    // Session resolved but nobody is signed in: an endless skeleton looks like
    // a hang, so point at the login page instead.
    if (!session.userId)
        return <SignedOut next={pathname ?? `/rooms/${roomId}`} />;
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
