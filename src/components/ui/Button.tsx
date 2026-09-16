import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "md" | "lg";
}

const variants = {
    primary:
        "bg-macaroni border-2 border-ink shadow-hard hover:bg-macaroni-deep pressable",
    secondary:
        "bg-cream border-2 border-ink shadow-hard hover:bg-cream-deep pressable",
    ghost: "bg-transparent hover:bg-ink/10",
};
const sizes = { md: "h-10 px-4 text-base", lg: "h-12 px-6 text-lg" };

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
            "inline-flex items-center justify-center gap-2 rounded-xl font-display font-bold text-ink select-none",
            "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            variants[variant],
            sizes[size],
            className,
        )}
        {...props}
    />
);
