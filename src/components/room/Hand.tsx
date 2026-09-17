import { type Deck, SKIP_CARD } from "@/src/domain/deck";
import { HandCard } from "./HandCard";

interface Props {
    deck: Deck;
    selected: string | null;
    onSelect: (card: string) => void;
    disabled?: boolean;
}

export const Hand = ({ deck, selected, onSelect, disabled }: Props) => {
    const cards = [...deck.cards, SKIP_CARD];
    return (
        // biome-ignore lint/a11y/useSemanticElements: a <fieldset> would add default browser styling that breaks the card-fan layout; role="group" is a valid ARIA pattern for a labelled collection.
        <div
            role="group"
            aria-label="Your hand"
            // The fan arcs upward and the selected card rises further, so the
            // top padding has to clear lift + selection + the rotated corners
            // (overflow-x: auto makes the vertical axis clip too).
            className="flex w-full min-w-0 shrink-0 items-end justify-center overflow-x-auto px-6 pb-4 pt-10"
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
    );
};
