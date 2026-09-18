import { Segmented } from "@/src/components/ui/Segmented";
import type { Deck } from "@/src/domain/deck";
import { METRICS, type MetricId } from "@/src/domain/metric";

/**
 * Picks the one statistic the whole room reads. `summarize` has no average for
 * an ordinal deck, so that option is offered but disabled while such a deck is
 * in play — and if the room was already on it, the panel honestly shows a dash
 * rather than the metric changing under everyone.
 */
export const MetricSwitcher = ({
    metric,
    deck,
    onChange,
}: {
    metric: MetricId;
    deck: Deck;
    onChange: (id: MetricId) => void;
}) => {
    const noAverage = deck.kind !== "numeric";
    return (
        <div className="flex flex-col items-start gap-1.5">
            <Segmented
                label="Result shown"
                value={metric}
                onChange={onChange}
                options={METRICS.map((m) => ({
                    value: m.id,
                    label: m.label,
                    disabled: noAverage && m.id === "average",
                }))}
            />
            {noAverage && (
                <p className="text-xs text-muted-foreground">
                    The {deck.label} deck has no average.
                </p>
            )}
        </div>
    );
};
