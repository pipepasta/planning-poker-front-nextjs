"use client";
import { useAtom } from "jotai";
import { cn } from "@/src/lib/cn";
import { THEMES, themeAtom } from "@/src/lib/prefs";

export const ThemePicker = () => {
    const [theme, setTheme] = useAtom(themeAtom);
    return (
        <div
            role="radiogroup"
            aria-label="Tablecloth colour"
            className="flex items-center gap-1.5"
        >
            {THEMES.map((t) => (
                // biome-ignore lint/a11y/useSemanticElements: styled toggle, not a form control
                <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={theme === t.id}
                    aria-label={`${t.label} tablecloth`}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                        "size-5 rounded-full border-2 border-ink transition-transform hover:scale-110",
                        theme === t.id &&
                            "ring-2 ring-ink ring-offset-2 ring-offset-cream",
                    )}
                    style={{ backgroundColor: `hsl(${t.hue} 55% 78%)` }}
                />
            ))}
        </div>
    );
};
