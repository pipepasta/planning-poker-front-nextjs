"use client";
import { Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/Dialog";
import { IconButton } from "@/src/components/ui/IconButton";
import type { Deck, DeckId } from "@/src/domain/deck";
import type { MetricId } from "@/src/domain/metric";
import { DeckSwitcher } from "./DeckSwitcher";
import { MetricSwitcher } from "./MetricSwitcher";

interface Props {
    deck: Deck;
    onDeck: (id: DeckId) => void;
    metric: MetricId;
    onMetric: (id: MetricId) => void;
    className?: string;
}

const Field = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {label}
        </span>
        {children}
    </div>
);

/**
 * Everything in here belongs to the room rather than to the person changing it,
 * which is why it is one dialog at every width: the name and the theme are
 * personal and stay out in the header bar beside it.
 */
export const RoomSettingsDialog = ({
    deck,
    onDeck,
    metric,
    onMetric,
    className,
}: Props) => (
    <Dialog>
        <DialogTrigger asChild>
            <IconButton label="Room settings" className={className}>
                <Settings size={18} />
            </IconButton>
        </DialogTrigger>
        <DialogContent
            title="Room settings"
            description="These change the room for everyone in it."
        >
            <div className="flex flex-col gap-5">
                <Field label="Deck">
                    <DeckSwitcher deckId={deck.id} onChange={onDeck} />
                </Field>
                <Field label="Result shown">
                    <MetricSwitcher
                        metric={metric}
                        deck={deck}
                        onChange={onMetric}
                    />
                </Field>
            </div>
        </DialogContent>
    </Dialog>
);
