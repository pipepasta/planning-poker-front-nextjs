import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "md" | "lg";
}

const variants = {
    primary:
        "bg-primary text-primary-foreground shadow-sm hover:brightness-95 active:brightness-90",
    secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:brightness-95 active:brightness-90",
    ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
};
const sizes = { md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };

export const Button = ({
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}: Props) => (
    <button
        type={type}
        className={cn(
            "inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold transition",
            "disabled:pointer-events-none disabled:opacity-50",
            variants[variant],
            sizes[size],
            className,
        )}
        {...props}
    />
);
