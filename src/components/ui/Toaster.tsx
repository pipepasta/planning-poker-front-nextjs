"use client";
import { cn } from "@/src/lib/cn";
import { dismissToast, useToasts } from "@/src/lib/toast";

const kinds = {
    info: "bg-cream",
    success: "bg-cream border-success",
    warning: "bg-macaroni",
    error: "bg-cream border-danger",
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
                        "pointer-events-auto rounded-xl border-2 border-ink px-4 py-2 text-sm font-semibold shadow-hard pop-in",
                        kinds[t.kind],
                    )}
                >
                    {t.message}
                </button>
            ))}
        </div>
    );
};
