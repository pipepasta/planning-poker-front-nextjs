import type { Deck } from "@/src/domain/deck";
import { summarize } from "@/src/domain/results";
import type { SnapshotParticipant } from "@/src/protocol/messages";

interface Props {
    deck: Deck;
    participants: SnapshotParticipant[];
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="flex min-w-20 flex-col items-center">
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            {label}
        </span>
        <span className="font-display text-2xl font-extrabold leading-tight">
            {value}
        </span>
    </div>
);

export const ResultsPanel = ({ deck, participants }: Props) => {
    const s = summarize(
        deck,
        participants.map((p) => p.vote),
    );
    return (
        <div className="flex flex-col items-center gap-2">
            {s.consensus && (
                <span className="pop-in rounded-full border-2 border-ink bg-macaroni px-3 py-0.5 font-display text-sm font-extrabold shadow-hard-sm">
                    Consensus!
                </span>
            )}
            <div className="flex flex-wrap justify-center gap-4">
                {s.average !== null && (
                    <Stat label="Average" value={s.average} />
                )}
                <Stat
                    label="Mode"
                    value={s.mode.length ? s.mode.join(", ") : "-"}
                />
                <Stat label="Decision" value={s.decision} />
            </div>
        </div>
    );
};
