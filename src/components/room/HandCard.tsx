import { cardLabel } from "@/src/domain/deck";
import { cn } from "@/src/lib/cn";

interface Props {
    card: string;
    selected: boolean;
    onSelect: (card: string) => void;
    index: number;
    total: number;
    disabled?: boolean;
}

export const HandCard = ({
    card,
    selected,
    onSelect,
    index,
    total,
    disabled,
}: Props) => {
    const mid = (total - 1) / 2;
    const rotate = (index - mid) * 4;
    const lift = Math.abs(index - mid) * 3;
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={`Vote ${cardLabel(card)}`}
            onClick={() => onSelect(card)}
            style={{ transform: `rotate(${rotate}deg) translateY(${lift}px)` }}
            className={cn(
                "group relative -ml-5 first:ml-0 h-24 w-16 shrink-0 rounded-xl border-2 border-ink font-display text-ink transition-transform duration-150 sm:h-28 sm:w-20",
                "hover:-translate-y-3 hover:z-10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                selected
                    ? "z-20 -translate-y-6 bg-macaroni shadow-hard-lg"
                    : "bg-cream shadow-hard",
                disabled && "opacity-60",
            )}
        >
            <span className="absolute left-1.5 top-1 text-xs font-bold">
                {cardLabel(card)}
            </span>
            <span className="flex h-full items-center justify-center text-3xl font-extrabold">
                {cardLabel(card)}
            </span>
            <span className="absolute bottom-1 right-1.5 rotate-180 text-xs font-bold">
                {cardLabel(card)}
            </span>
        </button>
    );
};
