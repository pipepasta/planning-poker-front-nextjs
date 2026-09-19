"use client";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "@/src/lib/prefs";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useAtomValue(themeAtom);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);
    return children;
};
