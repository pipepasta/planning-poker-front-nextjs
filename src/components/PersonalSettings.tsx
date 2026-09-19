"use client";
import { Settings } from "lucide-react";
import { useState } from "react";
import { NameForm } from "@/src/components/room/NameDialog";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/Dialog";
import { IconButton } from "@/src/components/ui/IconButton";

/** One labelled setting, the shape every settings dialog uses. */
export const Field = ({
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
 * The settings that affect nobody but you. They live inline in the bar where
 * it has the room for them, and inside a dialog where it does not — the room's
 * gear on a narrow screen, home's gear below `sm`.
 */
export const PersonalFields = ({
    name,
    onSave,
    onSaved,
    open,
}: {
    name: string;
    onSave: (name: string) => Promise<void> | void;
    onSaved?: () => void;
    /** Remounts the name field per opening, so the draft starts from the
     * saved name rather than from whatever was typed and abandoned. */
    open: boolean;
}) => (
    <>
        <Field label="Your name">
            {open && <NameForm name={name} onSave={onSave} onSaved={onSaved} />}
        </Field>
        <Field label="Theme colour">
            <ThemePicker />
        </Field>
    </>
);

/**
 * Home's fold: the same gear the room has, holding only the personal
 * settings, because home has no room-wide ones to offer.
 */
export const PersonalSettingsDialog = ({
    name,
    onSave,
    className,
}: {
    name: string;
    onSave: (name: string) => Promise<void> | void;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <IconButton label="Settings" className={className}>
                    <Settings size={18} />
                </IconButton>
            </DialogTrigger>
            <DialogContent title="You" description="Only you see these.">
                <div className="flex flex-col gap-4">
                    <PersonalFields
                        name={name}
                        onSave={onSave}
                        onSaved={() => setOpen(false)}
                        open={open}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
