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

// Fan geometry. The caps keep a long deck from arcing past the row's padding:
// at 18deg a 80x112 card overhangs ~10px at the top, plus 14px of lift and
// 16px when selected, which fits the row's pt-10.
const MAX_TILT = 18;
const MAX_LIFT = 14;
const clamp = (n: number, limit: number) =>
    Math.max(-limit, Math.min(limit, n));

export const HandCard = ({
    card,
    selected,
    onSelect,
    index,
    total,
    disabled,
}: Props) => {
    const mid = (total - 1) / 2;
    const rotate = clamp((index - mid) * 3, MAX_TILT);
    // Negative: the outer cards ride up, the way a fan of held cards does.
    const lift = -Math.min(Math.abs(index - mid) * 2, MAX_LIFT);
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={`Vote ${cardLabel(card)}`}
            onClick={() => onSelect(card)}
            style={{ transform: `rotate(${rotate}deg) translateY(${lift}px)` }}
            className={cn(
                "group relative -ml-5 h-24 w-16 shrink-0 rounded-lg border border-border transition-transform duration-150 first:ml-0 sm:h-28 sm:w-20",
                "hover:z-10 hover:-translate-y-2 focus-visible:z-10",
                selected
                    ? "z-20 -translate-y-4 bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-card-foreground shadow-sm",
                disabled && "opacity-60",
            )}
        >
            <span className="absolute left-1.5 top-1 text-xs font-semibold">
                {cardLabel(card)}
            </span>
            <span className="flex h-full items-center justify-center text-3xl font-semibold">
                {cardLabel(card)}
            </span>
            <span className="absolute bottom-1 right-1.5 rotate-180 text-xs font-semibold">
                {cardLabel(card)}
            </span>
        </button>
    );
};
