"use client";
import { type CSSProperties, useSyncExternalStore } from "react";
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

// A vignette on the felt so the table reads as a dished surface rather than a
// flat blob. closest-side follows the ellipse the border radius already draws.
const FELT_VIGNETTE =
    "radial-gradient(closest-side, transparent 52%, color-mix(in srgb, var(--color-ink) 14%, transparent) 100%)";

// Reactions start part of the way in from their sender's seat and drift the
// rest of the way toward the middle, so they converge on the felt instead of
// scattering off the table edge.
const PULL = 0.35;
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const floatStyle = (left: number, top: number): CSSProperties =>
    ({
        left: `${lerp(left, 50, PULL).toFixed(1)}%`,
        top: `${lerp(top, 50, PULL).toFixed(1)}%`,
        "--float-dx": `${Math.round((50 - left) * 0.6)}px`,
        "--float-dy": top > 50 ? "-120px" : "-56px",
    }) as CSSProperties;

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
    const indexOf = (clientId: string) =>
        participants.findIndex((p) => p.clientId === clientId);
    const myIndex = indexOf(myClientId);
    const positions = seatPositions(
        participants.length,
        myIndex < 0 ? 0 : myIndex,
    );

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
        // `flex-1`, not `h-full`: on a short viewport the parent has only a
        // min-height, and `height: 100%` against an indefinite height collapses
        // to zero and takes the whole table with it.
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-2 sm:gap-3">
            {!wide && (
                // One scrolling row keeps the seats to a fixed height however
                // many people are in the room, so the hand below never moves.
                <div className="w-full shrink-0 overflow-x-auto pb-1">
                    <div className="mx-auto flex w-max items-start gap-2 px-2">
                        {seats}
                    </div>
                </div>
            )}
            <div className="relative mx-auto min-h-0 w-full max-w-4xl flex-1">
                <div
                    aria-hidden="true"
                    className="absolute inset-[5%] rounded-[50%] border-2 border-ink bg-cloth-ink shadow-hard-lg sm:inset-[9%]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-[8%] rounded-[50%] border-2 border-ink bg-felt sm:inset-[12%]"
                    style={{ backgroundImage: FELT_VIGNETTE }}
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    {children}
                </div>
                {wide && seats}
                {reactions.map((r) => {
                    const i = indexOf(r.from.clientId);
                    const seat = wide && i >= 0 ? positions[i] : null;
                    const style = seat
                        ? floatStyle(
                              Number.parseFloat(seat.left),
                              Number.parseFloat(seat.top),
                          )
                        : // Narrow: fan the floats out by sender so several
                          // reactions at once do not stack on one point.
                          floatStyle(28 + ((i < 0 ? 0 : i) % 5) * 11, 88);
                    return (
                        <ReactionFloat key={r.id} reaction={r} style={style} />
                    );
                })}
            </div>
        </div>
    );
};
