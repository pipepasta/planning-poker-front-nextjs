import ScrumCard from "@/app/_components/features/voting/ScrumCard";
import { allCards } from "@/app/_lib/variables";
import type { Vote } from "@/app/_types/types";

interface Props {
    onSelect: (target: Vote) => void;
    selectedCard: Vote;
}

const ScrumCards = ({ onSelect, selectedCard }: Props) => (
    <div className="ml-12 flex justify-center items-center">
        {allCards.map((it) => (
            <div
                key={it}
                className="-ml-9 sm:-ml-8 group cursor-pointer"
                onClick={() => onSelect(it)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(it);
                }}
            >
                <div className="pointer-events-none transition group-hover:-translate-y-4">
                    <ScrumCard
                        cardSymbol={it}
                        onSelect={onSelect}
                        selected={it === selectedCard}
                    />
                </div>
            </div>
        ))}
    </div>
);
export default ScrumCards;
