"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { themeColorAtom } from "@/app/_lib/atoms";
import { applyTheme } from "@/app/_lib/themes";

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const themeColor = useAtomValue(themeColorAtom);
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            applyTheme(themeColor, isDarkMode);
            setThemeLoaded(true);
        }
    }, [themeColor]);

    return themeLoaded ? children : null;
};

export default ThemeProvider;
