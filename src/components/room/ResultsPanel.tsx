import { Spinner } from "@/src/components/ui/Spinner";
import type { Deck } from "@/src/domain/deck";
import { type MetricId, metricLabel } from "@/src/domain/metric";
import { metricValue, summarize } from "@/src/domain/results";
import type { SnapshotParticipant } from "@/src/protocol/messages";

interface Props {
    deck: Deck;
    metric: MetricId;
    participants: SnapshotParticipant[];
    revealed: boolean;
}

/**
 * The room's one statistic. A single number does not want a full-width band, so
 * this is a small card that takes only the width its value asks for and sits
 * centred above the table.
 *
 * Its height is fixed: the value row is `h-9` whether it holds the pending
 * spinner, the number, or the number and the consensus pill side by side. That
 * is the whole reason the pill sits beside the value instead of above it —
 * reaching consensus must not push the participants panel down the page.
 */
export const ResultsPanel = ({
    deck,
    metric,
    participants,
    revealed,
}: Props) => {
    const s = summarize(
        deck,
        participants.map((p) => p.vote),
    );
    return (
        <div className="flex w-full justify-center">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-2.5 text-card-foreground shadow-sm">
                {/* The label captions the value alone, so the pill can never
                    look like the thing being labelled. */}
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        {metricLabel(metric)}
                    </span>
                    <span className="flex h-9 items-center text-3xl font-semibold leading-none">
                        {revealed ? metricValue(metric, s) : <Spinner />}
                    </span>
                </div>
                {/* In flow, not absolute, so assistive tech reads it where it
                    appears. */}
                {revealed && s.consensus && (
                    <span className="pop-in whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-sm font-semibold text-primary-foreground shadow-sm">
                        Consensus!
                    </span>
                )}
            </div>
        </div>
    );
};
