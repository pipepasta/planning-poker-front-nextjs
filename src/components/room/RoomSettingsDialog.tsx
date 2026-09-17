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
import type { DeckId } from "@/src/domain/deck";
import { DeckSwitcher } from "./DeckSwitcher";
import { NameForm } from "./NameDialog";

interface Props {
    name: string;
    onRename: (name: string) => Promise<void>;
    deckId: DeckId;
    onDeck: (id: DeckId) => void;
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
 * Below `sm` the header has no room for the deck, name and theme controls, so
 * they move in here behind one button. Above `sm` the trigger is display:none,
 * which also takes it out of the tab order.
 */
export const RoomSettingsDialog = ({
    name,
    onRename,
    deckId,
    onDeck,
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <IconButton label="Room settings" className={className}>
                    <Settings size={18} />
                </IconButton>
            </DialogTrigger>
            <DialogContent
                title="Room settings"
                description="Deck, your name and the theme colour."
            >
                <div className="flex flex-col gap-5">
                    <Field label="Deck">
                        <DeckSwitcher deckId={deckId} onChange={onDeck} />
                    </Field>
                    <Field label="Your name">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};
