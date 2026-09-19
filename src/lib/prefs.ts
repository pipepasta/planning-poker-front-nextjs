import { atomWithStorage } from "jotai/utils";

export type ThemeId = "pink" | "blue" | "green" | "purple" | "orange";

/**
 * `hue` is the value `app/globals.css` feeds into the token formulas for that
 * theme, so a swatch painted with it matches the theme's own `--primary`.
 * Keep the two in step: changing a hue here without changing the matching
 * `[data-theme=...]` block leaves the picker lying about what it selects.
 */
export const THEMES: Array<{ id: ThemeId; label: string; hue: number }> = [
    { id: "pink", label: "Pink", hue: 330 },
    { id: "blue", label: "Blue", hue: 210 },
    { id: "green", label: "Green", hue: 120 },
    { id: "purple", label: "Purple", hue: 270 },
    { id: "orange", label: "Orange", hue: 30 },
];

export const themeAtom = atomWithStorage<ThemeId>(
    "mp.theme",
    "pink",
    undefined,
    {
        getOnInit: true,
    },
);
