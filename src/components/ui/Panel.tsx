import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

export const Panel = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "rounded-xl border border-border bg-card text-card-foreground shadow-md",
            className,
        )}
        {...props}
    />
);
