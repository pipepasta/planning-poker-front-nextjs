"use client";
import { cn } from "@/src/lib/cn";
import { dismissToast, useToasts } from "@/src/lib/toast";

const kinds = {
    info: "border-border bg-card text-card-foreground",
    success: "border-border bg-primary text-primary-foreground",
    warning: "border-border bg-secondary text-secondary-foreground",
    error: "border-destructive bg-destructive text-destructive-foreground",
};

export const Toaster = () => {
    const toasts = useToasts();
    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
        >
            {toasts.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => dismissToast(t.id)}
                    className={cn(
                        "pop-in pointer-events-auto rounded-lg border px-4 py-2 text-sm font-semibold shadow-lg",
                        kinds[t.kind],
                    )}
                >
                    {t.message}
                </button>
            ))}
        </div>
    );
};
