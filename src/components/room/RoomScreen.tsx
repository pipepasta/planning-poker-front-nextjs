"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Panel } from "@/src/components/ui/Panel";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { DECKS, DEFAULT_DECK_ID } from "@/src/domain/deck";
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
            <h1 className="font-display text-2xl font-extrabold">
                You are signed out
            </h1>
            <p className="text-sm font-bold text-ink-soft">
                Sign in again to take a seat at this table.
            </p>
            <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="rounded-xl border-2 border-ink bg-macaroni px-4 py-2 font-display font-bold text-ink shadow-hard"
            >
                Go to sign in
            </Link>
        </Panel>
    </main>
);

const RoomSkeleton = () => (
    <div className="mx-auto flex h-full w-full min-h-0 max-w-4xl flex-1 flex-col items-center gap-4">
        <Skeleton className="h-10 w-full shrink-0" />
        <Skeleton className="w-full min-h-0 flex-1 rounded-[50%]" />
        <Skeleton className="h-20 w-2/3 shrink-0" />
    </div>
);

const LoadingRoom = () => (
    <div className="flex h-dvh flex-col overflow-hidden p-6">
        <RoomSkeleton />
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
        // A fixed-height, non-scrolling column: the table gives up space so
        // the hand at the bottom is always fully visible. Under 600px tall
        // the table would have to shrink past its own seat ring, so the shell
        // stops clipping and the page scrolls instead.
        <div className="flex h-dvh flex-col overflow-hidden [@media(max-height:599px)]:h-auto [@media(max-height:599px)]:min-h-dvh [@media(max-height:599px)]:overflow-visible">
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
            <main className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col items-center gap-2 px-3 py-3">
                {/* The seat ring sits at 16%/84% of this box and each seat is
                    ~110px tall, so under ~344px it clips; give it a floor and
                    let the (now scrolling) page absorb the overflow. */}
                <div className="flex w-full min-h-0 flex-1 flex-col [@media(max-height:599px)]:min-h-[360px]">
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
                </div>
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
