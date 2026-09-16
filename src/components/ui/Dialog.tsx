"use client";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

interface ContentProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export const DialogContent = ({
    title,
    description,
    children,
    className,
}: ContentProps) => (
    <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <RadixDialog.Content
            className={cn(
                "fixed left-1/2 top-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border-2 border-ink bg-cream p-5 shadow-hard-lg pop-in",
                className,
            )}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <RadixDialog.Title className="font-display text-xl font-bold">
                        {title}
                    </RadixDialog.Title>
                    {description ? (
                        <RadixDialog.Description className="text-sm text-ink-soft">
                            {description}
                        </RadixDialog.Description>
                    ) : (
                        <RadixDialog.Description className="sr-only">
                            {title}
                        </RadixDialog.Description>
                    )}
                </div>
                <RadixDialog.Close
                    aria-label="Close"
                    className="rounded-lg p-1 hover:bg-ink/10"
                >
                    <X size={18} />
                </RadixDialog.Close>
            </div>
            {children}
        </RadixDialog.Content>
    </RadixDialog.Portal>
);
