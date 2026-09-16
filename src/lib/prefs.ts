import { atomWithStorage } from "jotai/utils";

export type ThemeId = "pink" | "blue" | "green" | "purple" | "orange";

export const THEMES: Array<{ id: ThemeId; label: string; hue: number }> = [
    { id: "pink", label: "Pink", hue: 340 },
    { id: "blue", label: "Blue", hue: 210 },
    { id: "green", label: "Green", hue: 140 },
    { id: "purple", label: "Purple", hue: 275 },
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
