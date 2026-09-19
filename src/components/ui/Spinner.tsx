import { cn } from "@/src/lib/cn";

// A ring that leaves one quarter open so the rotation reads. Under
// prefers-reduced-motion globals.css stops the spin and it stays a quiet ring.
export const Spinner = ({ className }: { className?: string }) => (
    <span
        aria-hidden="true"
        className={cn(
            "inline-block size-6 animate-spin rounded-full border-2 border-muted border-t-transparent",
            className,
        )}
    />
);
