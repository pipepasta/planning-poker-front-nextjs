import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

export const Panel = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "rounded-card border-2 border-ink bg-cream shadow-hard-lg text-ink",
            className,
        )}
        {...props}
    />
);
