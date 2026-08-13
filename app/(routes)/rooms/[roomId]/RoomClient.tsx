"use client";
import { useAtom } from "jotai/index";
import { useState } from "react";
import Confetti from "react-confetti";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWindowSize } from "react-use";
import { useWebHaptics } from "web-haptics/react";
import ButtonsContainer from "@/app/_components/containers/ButtonsContainer";
import ParticipantList from "@/app/_components/containers/ParticipantsList";
import ReactionButtonContainer from "@/app/_components/containers/ReactionButtonContainer";
import ScrumCards from "@/app/_components/containers/ScrumCards";
import VoteResultsContainer from "@/app/_components/containers/VoteResultsContainer";
import ReactionPopup from "@/app/_components/features/reactions/ReactionPopup";
import CopyToClipBoard from "@/app/_components/features/room/CopyToClipBoard";
import EditNameDialog from "@/app/_components/features/room/EditNameDialog";
import ThemeSelector from "@/app/_components/features/voting/ThemeSelector";
import Timer from "@/app/_components/features/voting/Timer";
import Header from "@/app/_components/ui/layout/Header";
import HeaderItem from "@/app/_components/ui/layout/HeaderItem";
import { userNameAtom } from "@/app/_lib/atoms";
import { useConnectionNotification } from "@/app/_lib/useConnectionNotification";
import { useReactions } from "@/app/_lib/useReactions";
import { useSyncUserName } from "@/app/_lib/useSyncUserName";
import { useTimer } from "@/app/_lib/useTimer";
import useWebSocket from "@/app/_lib/useWebSocket";
import type { Vote } from "@/app/_types/types";
import { createClient } from "@/utils/supabase/client";

interface RoomClientProps {
    roomId: string;
}

const supabase = createClient();

const RoomClient = ({ roomId }: RoomClientProps) => {
    const [selectedCardNumber, selectCardNumber] = useState<Vote>("not yet");
    const [userName, setUserName] = useAtom(userNameAtom);
    useSyncUserName();

    // confetti
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const { width, height } = useWindowSize();

    // reaction
    const { reactions, handleReceiveReaction } = useReactions();

    // timer
    const {
        currentTime,
        isPaused,
        handleResetTimer,
        handlePauseTimer,
        handleResumeTimer,
    } = useTimer();

    // websocket
    const connection = useWebSocket({
        roomId: roomId,
        userName: userName,
        onResetVote: () => {
            setShowConfetti(false);
            selectCardNumber(() => "not yet");
        },
        onReceiveResetTimerMessage: () => handleResetTimer(),
        onReceivePauseTimerMessage: (time: number) => handlePauseTimer(time),
        onReceiveResumeTimerMessage: (time: number) => handleResumeTimer(time),
        onReceiveReaction: (kind, sender) =>
            handleReceiveReaction(kind, sender),
        onAllVotesMatch: () => setShowConfetti(true),
    });

    useConnectionNotification(connection.connectionState);

    const { trigger } = useWebHaptics();

    const timerElement = (
        <Timer
            currentTime={currentTime}
            isPaused={isPaused}
            onTapPauseButton={() =>
                connection.timerControls.pause(roomId, currentTime)
            }
            onTapResumeButton={() =>
                connection.timerControls.resume(roomId, currentTime)
            }
            onTapResetButton={() => connection.timerControls.reset(roomId)}
        />
    );

    return (
        <div className="h-screen bg-background relative">
            {showConfetti && (
                <Confetti width={width} height={height} recycle={false} />
            )}
            {reactions.map((reaction) => (
                <ReactionPopup
                    key={reaction.id}
                    reaction={reaction.type}
                    x={reaction.x}
                    y={reaction.y}
                    username={reaction.username}
                />
            ))}
            <Header>
                <HeaderItem className="max-sm:hidden sm:text-xl">
                    {timerElement}
                </HeaderItem>
                <HeaderItem className="sm:text-xl">
                    <CopyToClipBoard
                        copyTarget={globalThis.window?.location.href}
                    >
                        <div className="max-md:hidden">{roomId}</div>
                    </CopyToClipBoard>
                </HeaderItem>
                <HeaderItem className="px-2">
                    <EditNameDialog
                        onSubmit={async (candidate: string) => {
                            await supabase.auth.updateUser({
                                data: { display_name: candidate },
                            });
                            setUserName(candidate);
                        }}
                    />
                </HeaderItem>
                <HeaderItem>
                    <ThemeSelector />
                </HeaderItem>
            </Header>
            <div className="flex flex-col items-center h-5/6">
                <VoteResultsContainer
                    participantVotes={connection.participants.map(
                        (it) => it.vote,
                    )}
                />
                <ParticipantList participants={connection.participants} />
                <ButtonsContainer
                    onClickNextVote={() => {
                        connection.cardControls.reset(roomId);
                        connection.timerControls.reset(roomId);
                        trigger();
                    }}
                    onClickReveal={() => {
                        connection.cardControls.revealAll(roomId);
                        trigger();
                    }}
                />
                <ScrumCards
                    onSelect={(target) => {
                        selectCardNumber(target);
                        connection.cardControls.submit(roomId, target);
                        trigger();
                    }}
                    selectedCard={selectedCardNumber}
                />
                <ReactionButtonContainer
                    onClick={(emoji) =>
                        connection.reactionControls.send(emoji.emoji)
                    }
                />
            </div>
            <ToastContainer
                className={"absolute"}
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default RoomClient;
