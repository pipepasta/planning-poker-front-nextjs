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
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-foreground/40" />
        <RadixDialog.Content
            className={cn(
                "pop-in fixed left-1/2 top-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2",
                "rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg",
                className,
            )}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <RadixDialog.Title className="text-xl font-semibold">
                        {title}
                    </RadixDialog.Title>
                    {description ? (
                        <RadixDialog.Description className="text-sm text-muted-foreground">
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
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <X size={18} />
                </RadixDialog.Close>
            </div>
            {children}
        </RadixDialog.Content>
    </RadixDialog.Portal>
);
