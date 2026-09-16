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
            "inline-flex size-10 items-center justify-center rounded-xl text-ink hover:bg-ink/10 disabled:opacity-40",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            className,
        )}
        {...props}
    />
);
