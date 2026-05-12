"use client";

import { useAtom } from "jotai";
import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/_components/ui/base/Button";
import { themeColorAtom } from "@/app/_lib/atoms";
import { applyTheme, themeColors } from "@/app/_lib/themes";

interface ThemeSelectorProps {
    className?: string;
}

const ThemeSelector = ({ className = "" }: ThemeSelectorProps) => {
    const [themeColor, setThemeColor] = useAtom(themeColorAtom);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            applyTheme(themeColor, isDarkMode);
        }
    }, [themeColor]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleThemeChange = (newTheme: typeof themeColor) => {
        setThemeColor(newTheme);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2"
                aria-label="Change theme color"
            >
                <Palette className="size-5" />
            </Button>

            <div
                className={`
          absolute -right-1 top-full mt-2 py-1 z-50
          flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "w-10 max-h-[200px] opacity-100" : "max-h-0 opacity-0"}
        `}
            >
                {Object.entries(themeColors).map(([theme, data], _index) => (
                    <button
                        type="button"
                        key={theme}
                        onClick={() =>
                            handleThemeChange(theme as typeof themeColor)
                        }
                        className={
                            "size-8 rounded-full transition-transform duration-300 ring-zinc-200 ring-2"
                        }
                        style={{
                            backgroundColor: `hsl(${data.variables["--primary"]})`,
                            transform: isOpen
                                ? "translateY(0)"
                                : "translateY(-100%)",
                            opacity: isOpen ? 1 : 0,
                        }}
                        aria-label={`${data.name} theme`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector;
