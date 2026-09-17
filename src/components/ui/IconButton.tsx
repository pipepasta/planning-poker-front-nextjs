import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

export const IconButton = ({
    label,
    className,
    type = "button",
    ...props
}: Props) => (
    <button
        type={type}
        aria-label={label}
        title={label}
        className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40",
            className,
        )}
        {...props}
    />
);
