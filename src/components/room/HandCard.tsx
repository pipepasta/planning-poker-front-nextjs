import type { CSSProperties } from "react";
import { cardLabel } from "@/src/domain/deck";
import { cn } from "@/src/lib/cn";
import { fanLeft, fanSink, fanTilt } from "./fan";

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
    const tilt = fanTilt(index, total);
    const geometry = {
        left: fanLeft(index, total),
        // Sink, then lean about the bottom edge: the card pivots outward and
        // rides the arc. Selection (--fan-lift) and hover/focus (--fan-pop)
        // raise it straight back up on top of that.
        transform: `translateY(calc(${fanSink(tilt)} - var(--fan-lift, 0px) - var(--fan-pop, 0px))) rotate(${tilt}deg)`,
        // Left-to-right stacking order, so each card overlaps the one before.
        "--fan-z": String(index),
    } as CSSProperties;
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={`Vote ${cardLabel(card)}`}
            onClick={() => onSelect(card)}
            style={geometry}
            className={cn(
                "absolute top-[var(--fan-rise)] h-[var(--card-h)] w-[var(--card-w)] origin-bottom rounded-lg border border-border transition-transform duration-150",
                "hover:z-30 hover:[--fan-pop:0.5rem] focus-visible:z-30 focus-visible:[--fan-pop:0.5rem]",
                selected
                    ? "z-20 bg-primary text-primary-foreground shadow-md [--fan-lift:1rem]"
                    : "z-[var(--fan-z)] bg-card text-card-foreground shadow-sm",
                disabled && "opacity-60",
            )}
        >
            {/* The cards overlap, so this corner label is the part that stays
                visible in the sliver; the large face shows on the card in front
                and on whichever card is raised. */}
            <span className="absolute left-1 top-1 text-xs font-semibold">
                {cardLabel(card)}
            </span>
            <span className="flex h-full items-center justify-center text-2xl font-semibold sm:text-3xl">
                {cardLabel(card)}
            </span>
            <span className="absolute bottom-1 right-1 rotate-180 text-xs font-semibold">
                {cardLabel(card)}
            </span>
        </button>
    );
};
