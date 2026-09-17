"use client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { THEMES, type ThemeId, themeAtom } from "@/src/lib/prefs";

// Each swatch shows the theme's own --primary. The hues match the ones
// globals.css feeds into the token formulas.
const SWATCH_HUE: Record<ThemeId, number> = {
    pink: 330,
    blue: 210,
    green: 120,
    purple: 270,
    orange: 30,
};

export const ThemePicker = () => {
    const [theme, setTheme] = useAtom(themeAtom);
    // themeAtom reads localStorage, which the server cannot see: rendering the
    // selection before mount makes the server and the client disagree. Nothing
    // is selected for the first client render, then the effect settles it.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const selected = mounted ? theme : null;
    return (
        <div
            role="radiogroup"
            aria-label="Theme colour"
            className="flex items-center gap-1.5"
        >
            {THEMES.map((t) => (
                // biome-ignore lint/a11y/useSemanticElements: styled toggle, not a form control
                <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected === t.id}
                    aria-label={`${t.label} theme`}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                        "size-5 rounded-full border border-border transition-transform hover:scale-110",
                        selected === t.id &&
                            "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                    style={{
                        backgroundColor: `hsl(${SWATCH_HUE[t.id]} 100% 90%)`,
                    }}
                />
            ))}
        </div>
    );
};
