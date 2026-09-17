import { Button } from "@/src/components/ui/Button";
import type { Deck } from "@/src/domain/deck";
import type { Phase, SnapshotParticipant } from "@/src/protocol/messages";
import { ResultsPanel } from "./ResultsPanel";

interface Props {
    phase: Phase;
    deck: Deck;
    participants: SnapshotParticipant[];
    onReveal: () => void;
    onNextRound: () => void;
}

export const CenterPanel = ({
    phase,
    deck,
    participants,
    onReveal,
    onNextRound,
}: Props) => {
    const voted = participants.filter((p) => p.hasVoted).length;
    const total = participants.length;
    return (
        // The narrow cap is geometry, not taste: the panel is centred in an
        // ellipse, so its corners leave the felt long before its edges reach
        // the bounding box. 68% of the box keeps all four corners on the felt.
        <div className="flex max-w-[68%] flex-col items-center gap-2 rounded-card border-2 border-ink bg-cream px-3 py-3 text-sm shadow-hard-lg sm:max-w-none sm:gap-3 sm:px-5 sm:py-4 sm:text-base">
            {phase === "voting" ? (
                <>
                    <span className="font-display text-lg font-bold">
                        {voted} / {total} voted
                    </span>
                    <div className="flex gap-1" aria-hidden="true">
                        {participants.map((p) => (
                            <span
                                key={p.clientId}
                                className={
                                    p.hasVoted
                                        ? "size-2.5 rounded-full bg-ink"
                                        : "size-2.5 rounded-full border-2 border-ink"
                                }
                            />
                        ))}
                    </div>
                    <Button
                        variant="secondary"
                        onClick={onReveal}
                        disabled={total === 0}
                    >
                        Reveal cards
                    </Button>
                </>
            ) : (
                <>
                    <ResultsPanel deck={deck} participants={participants} />
                    <Button onClick={onNextRound}>Next round</Button>
                </>
            )}
        </div>
    );
};
