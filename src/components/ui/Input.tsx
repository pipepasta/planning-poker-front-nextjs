import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
}

export const Input = ({ className, invalid, ...props }: Props) => (
    <input
        aria-invalid={invalid || undefined}
        className={cn(
            "h-12 w-full rounded-lg border border-input bg-card px-4 text-foreground",
            "placeholder:text-muted-foreground",
            invalid && "border-destructive",
            className,
        )}
        {...props}
    />
);
