import type { CSSProperties } from "react";
import { type Deck, SKIP_CARD } from "@/src/domain/deck";
import { FAN_RISE, FAN_SINK_MAX } from "./fan";
import { HandCard } from "./HandCard";

interface Props {
    deck: Deck;
    selected: string | null;
    onSelect: (card: string) => void;
    disabled?: boolean;
}

export const Hand = ({ deck, selected, onSelect, disabled }: Props) => {
    const cards = [...deck.cards, SKIP_CARD];
    const fan = {
        "--fan-n": String(cards.length),
        // The card scales with the viewport rather than stepping at a
        // breakpoint, so eleven of them fit 320px and still read as a hand at
        // 1280px. 5:7 is the playing-card ratio.
        "--card-w": "clamp(3.5rem, 12vw, 5rem)",
        "--card-h": "calc(var(--card-w) * 1.4)",
        "--fan-rise": FAN_RISE,
        "--fan-sink-max": FAN_SINK_MAX,
        // Absolutely positioned children give the box no height, so it states
        // its own: the rise headroom, the card, then the arc's drop. No
        // overflow anywhere — the rise and the leaning corners must not be cut.
        height: "calc(var(--fan-rise) + var(--card-h) + var(--fan-sink-max))",
        // Uncapped, a five-card deck would smear across the whole 64rem column.
        // The cap keeps the step under 0.8 of a card, so every deck stays
        // overlapped, and 30rem keeps a wide hand within arm's reach.
        maxWidth:
            "min(30rem, calc(var(--card-w) * (1 + 0.8 * (var(--fan-n) - 1))))",
    } as CSSProperties;
    return (
        // This gutter is what the end cards' rotated top corners lean into; it
        // plus the shell's px-3 is why no card reaches the viewport edge.
        <div className="w-full px-3">
            {/* biome-ignore lint/a11y/useSemanticElements: a <fieldset> would add default browser styling that breaks the card-fan layout; role="group" is a valid ARIA pattern for a labelled collection. */}
            <div
                role="group"
                aria-label="Your hand"
                style={fan}
                className="relative isolate mx-auto w-full"
            >
                {cards.map((card, i) => (
                    <HandCard
                        key={card}
                        card={card}
                        index={i}
                        total={cards.length}
                        selected={selected === card}
                        onSelect={onSelect}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
};
