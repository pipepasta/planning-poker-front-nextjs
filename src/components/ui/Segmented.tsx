import { cn } from "@/src/lib/cn";

interface Props<T extends string> {
    label: string;
    options: Array<{ value: T; label: string }>;
    value: T;
    onChange: (value: T) => void;
}

export const Segmented = <T extends string>({
    label,
    options,
    value,
    onChange,
}: Props<T>) => (
    <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex rounded-full border border-border bg-card p-0.5 shadow-sm"
    >
        {options.map((o) => (
            // biome-ignore lint/a11y/useSemanticElements: styled toggle, not a form control
            <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={o.value === value}
                onClick={() => onChange(o.value)}
                className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
                    o.value === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);
