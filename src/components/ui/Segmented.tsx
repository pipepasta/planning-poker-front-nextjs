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
        className="inline-flex rounded-xl border-2 border-ink bg-cream p-0.5 shadow-hard-sm"
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
                    "rounded-lg px-3 py-1 font-display text-sm font-bold transition-colors",
                    o.value === value
                        ? "bg-macaroni text-ink"
                        : "text-ink-soft hover:bg-ink/10",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);
