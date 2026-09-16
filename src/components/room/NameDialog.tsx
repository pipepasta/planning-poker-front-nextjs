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

export const NAME_MAX = 15;

export const NameDialog = ({
    name,
    onSave,
}: {
    name: string;
    onSave: (name: string) => Promise<void> | void;
}) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(name);
    const valid = draft.trim().length >= 1 && draft.trim().length <= NAME_MAX;
    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) setDraft(name);
            }}
        >
            <DialogTrigger
                className="inline-flex h-10 items-center gap-1.5 rounded-xl px-2 font-bold hover:bg-ink/10"
                aria-label="Change your name"
            >
                <UserRound size={18} />
                <span className="max-w-28 truncate">{name || "Set name"}</span>
            </DialogTrigger>
            <DialogContent
                title="Change name"
                description="How should the table call you?"
            >
                <form
                    className="flex flex-col gap-3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!valid) return;
                        await onSave(draft.trim());
                        setOpen(false);
                    }}
                >
                    <Input
                        autoFocus
                        maxLength={NAME_MAX}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Your name"
                    />
                    <Button
                        type="submit"
                        disabled={!valid}
                        className="self-end"
                    >
                        Save name
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
