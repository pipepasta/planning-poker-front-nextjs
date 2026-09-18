"use client";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/Dialog";
import { Input } from "@/src/components/ui/Input";
import { cn } from "@/src/lib/cn";
import { NAME_MAX } from "@/src/protocol/messages";

/**
 * Just the field and its save button. The room settings dialog renders this
 * directly rather than nesting a second dialog inside itself.
 */
export const NameForm = ({
    name,
    onSave,
    onSaved,
    autoFocus,
}: {
    name: string;
    onSave: (name: string) => Promise<void> | void;
    onSaved?: () => void;
    autoFocus?: boolean;
}) => {
    const [draft, setDraft] = useState(name);
    const valid = draft.trim().length >= 1 && draft.trim().length <= NAME_MAX;
    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
                e.preventDefault();
                if (!valid) return;
                await onSave(draft.trim());
                onSaved?.();
            }}
        >
            <Input
                autoFocus={autoFocus}
                maxLength={NAME_MAX}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
            />
            <Button type="submit" disabled={!valid} className="self-end">
                Save name
            </Button>
        </form>
    );
};

/** `compact` keeps the button but drops the name label below `sm`. */
export const NameDialog = ({
    name,
    onSave,
    className,
    compact,
}: {
    name: string;
    onSave: (name: string) => Promise<void> | void;
    className?: string;
    compact?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
                    compact &&
                        "max-sm:size-10 max-sm:justify-center max-sm:px-0",
                    className,
                )}
                aria-label="Change your name"
            >
                <UserRound size={18} />
                <span
                    className={cn(
                        "max-w-28 truncate",
                        compact && "max-sm:sr-only",
                    )}
                >
                    {name || "Set name"}
                </span>
            </DialogTrigger>
            <DialogContent
                title="Change name"
                description="What should we call you?"
            >
                {/* Remounted per open so the draft starts from the saved name. */}
                {open && (
                    <NameForm
                        autoFocus
                        name={name}
                        onSave={onSave}
                        onSaved={() => setOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
