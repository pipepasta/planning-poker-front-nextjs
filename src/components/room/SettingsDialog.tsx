"use client";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Field, PersonalFields } from "@/src/components/PersonalSettings";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/Dialog";
import { IconButton } from "@/src/components/ui/IconButton";
import type { Deck, DeckId } from "@/src/domain/deck";
import type { MetricId } from "@/src/domain/metric";
import { cn } from "@/src/lib/cn";
import { DeckSwitcher } from "./DeckSwitcher";
import { MetricSwitcher } from "./MetricSwitcher";

interface Props {
    deck: Deck;
    onDeck: (id: DeckId) => void;
    metric: MetricId;
    onMetric: (id: MetricId) => void;
    name: string;
    onRename: (name: string) => Promise<void>;
    className?: string;
}

const Section = ({
    title,
    note,
    className,
    children,
}: {
    title: string;
    note: string;
    className?: string;
    children: React.ReactNode;
}) => (
    <section className={cn("flex flex-col gap-4", className)}>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{note}</p>
        </div>
        {children}
    </section>
);

/**
 * Settings grouped by who each one affects. The room's own — the deck and the
 * metric — are here at every width. The personal ones are here only below `lg`,
 * where the bar has no room for them beside the wordmark, the link and the
 * timer; above `lg` that section is `display:none`, which also takes it out of
 * the tab order, because the name and the theme sit out in the bar instead.
 */
export const SettingsDialog = ({
    deck,
    onDeck,
    metric,
    onMetric,
    name,
    onRename,
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <IconButton label="Settings" className={className}>
                    <Settings size={18} />
                </IconButton>
            </DialogTrigger>
            <DialogContent
                title="Settings"
                description="Grouped by who each one affects."
            >
                <div className="flex flex-col gap-6">
                    <Section
                        title="Room"
                        note="These change the room for everyone in it."
                    >
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
                    </Section>
                    <Section
                        className="lg:hidden"
                        title="You"
                        note="Only you see these."
                    >
                        <PersonalFields
                            name={name}
                            onSave={onRename}
                            onSaved={() => setOpen(false)}
                            open={open}
                        />
                    </Section>
                </div>
            </DialogContent>
        </Dialog>
    );
};
