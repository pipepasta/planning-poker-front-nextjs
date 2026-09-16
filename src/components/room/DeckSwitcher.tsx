import { Segmented } from "@/src/components/ui/Segmented";
import { DECK_LIST, type DeckId } from "@/src/domain/deck";

export const DeckSwitcher = ({
    deckId,
    onChange,
}: {
    deckId: DeckId;
    onChange: (id: DeckId) => void;
}) => (
    <Segmented
        label="Deck"
        value={deckId}
        onChange={onChange}
        options={DECK_LIST.map((d) => ({ value: d.id, label: d.label }))}
    />
);
