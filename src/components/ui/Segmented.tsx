import { cn } from "@/src/lib/cn";

interface Option<T extends string> {
    value: T;
    label: string;
    /** Offered but not choosable here; the caller says why next to the group. */
    disabled?: boolean;
}

interface Props<T extends string> {
    label: string;
    options: Array<Option<T>>;
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
                disabled={o.disabled}
                onClick={() => onChange(o.value)}
                className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
                    o.value === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    // A disabled option stays readable: it is still the shape of
                    // a choice, just one this deck cannot offer.
                    o.disabled &&
                        "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);
