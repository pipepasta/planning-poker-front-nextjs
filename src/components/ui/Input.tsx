import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
}

export const Input = ({ className, invalid, ...props }: Props) => (
    <input
        aria-invalid={invalid || undefined}
        className={cn(
            "h-12 w-full rounded-xl border-2 border-ink bg-white px-4 font-body text-ink placeholder:text-ink/40",
            "focus:outline-none focus:shadow-hard-sm",
            invalid && "border-danger",
            className,
        )}
        {...props}
    />
);
