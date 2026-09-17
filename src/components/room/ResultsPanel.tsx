import { Spinner } from "@/src/components/ui/Spinner";
import type { Deck } from "@/src/domain/deck";
import { summarize } from "@/src/domain/results";
import type { SnapshotParticipant } from "@/src/protocol/messages";

interface Props {
    deck: Deck;
    participants: SnapshotParticipant[];
    revealed: boolean;
}

const Stat = ({
    label,
    value,
    pending,
}: {
    label: string;
    value: string;
    pending: boolean;
}) => (
    <div className="flex flex-1 flex-col items-center gap-0.5 px-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        {pending ? (
            <span className="flex h-8 items-center">
                <Spinner />
            </span>
        ) : (
            <span className="h-8 text-2xl font-semibold leading-8">
                {value}
            </span>
        )}
    </div>
);

export const ResultsPanel = ({ deck, participants, revealed }: Props) => {
    const s = summarize(
        deck,
        participants.map((p) => p.vote),
    );
    return (
        <div className="flex w-full flex-col items-center gap-2">
            {revealed && s.consensus && (
                <span className="pop-in rounded-full bg-primary px-3 py-0.5 text-sm font-semibold text-primary-foreground shadow-sm">
                    Consensus!
                </span>
            )}
            <div className="flex w-full max-w-3xl items-start">
                <Stat
                    label="average"
                    value={s.average ?? "-"}
                    pending={!revealed}
                />
                <Stat
                    label="mode"
                    value={s.mode.length ? s.mode.join(", ") : "-"}
                    pending={!revealed}
                />
                <Stat
                    label="scrum decision"
                    value={s.decision}
                    pending={!revealed}
                />
            </div>
        </div>
    );
};
