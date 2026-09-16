import type { Deck } from "./deck";

export interface VoteSummary {
    average: string | null;
    mode: string[];
    decision: string;
    consensus: boolean;
    counted: number;
}

const formatAverage = (n: number): string =>
    Number.isInteger(n) ? String(n) : n.toFixed(1);

export const summarize = (
    deck: Deck,
    votes: ReadonlyArray<string | null | undefined>,
): VoteSummary => {
    const counted = votes.filter(
        (v): v is string => typeof v === "string" && deck.cards.includes(v),
    );
    const byIndex = (card: string) => deck.cards.indexOf(card);
    const distinct = [...new Set(counted)].sort(
        (a, b) => byIndex(a) - byIndex(b),
    );

    const average =
        deck.kind !== "numeric"
            ? null
            : counted.length === 0
              ? "-"
              : formatAverage(
                    counted.reduce((s, v) => s + Number(v), 0) / counted.length,
                );

    const counts = new Map<string, number>();
    for (const v of counted) counts.set(v, (counts.get(v) ?? 0) + 1);
    const max = Math.max(0, ...counts.values());
    const mode = distinct.filter((v) => counts.get(v) === max);

    let decision = "discuss";
    if (distinct.length === 0) decision = "-";
    else if (distinct.length === 1) decision = distinct[0];
    else if (distinct.length <= 3) {
        const idx = distinct.map(byIndex);
        const consecutive = idx.every(
            (v, i) => i === 0 || v === idx[i - 1] + 1,
        );
        decision = consecutive ? distinct[1] : "discuss";
    }

    const consensus =
        votes.length > 0 &&
        counted.length === votes.length &&
        distinct.length === 1;

    return { average, mode, decision, consensus, counted: counted.length };
};
