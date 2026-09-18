"use client";
import { Settings } from "lucide-react";
import { useState } from "react";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
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
import { NameForm } from "./NameDialog";

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
 * Settings grouped by who each one affects. The room's own — the deck and the
 * metric — are here at every width. The personal ones are here only below `sm`,
 * where the bar has no room for them beside the wordmark and the timer; above
 * `sm` that section is `display:none`, which also takes it out of the tab
 * order, because the name and the theme sit out in the header instead.
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
                        className="sm:hidden"
                        title="You"
                        note="Only you see these."
                    >
                        <Field label="Your name">
                            {/* Remounted per open so the draft starts from the
                                saved name. */}
                            {open && (
                                <NameForm
                                    name={name}
                                    onSave={onRename}
                                    onSaved={() => setOpen(false)}
                                />
                            )}
                        </Field>
                        <Field label="Theme colour">
                            <ThemePicker />
                        </Field>
                    </Section>
                </div>
            </DialogContent>
        </Dialog>
    );
};
