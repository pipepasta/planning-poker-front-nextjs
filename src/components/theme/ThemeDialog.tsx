"use client";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/src/components/ui/Dialog";
import { THEMES, themeAtom } from "@/src/lib/prefs";
import { ThemePicker } from "./ThemePicker";

/**
 * The theme as one swatch-sized control: the room bar also carries the timer,
 * the room settings and the name, and five inline swatches do not fit beside
 * them at 390px. The swatch shows the theme in force; the palette is one tap
 * behind it. Wider, calmer pages (home, login) keep {@link ThemePicker} inline.
 */
export const ThemeDialog = ({ className }: { className?: string }) => {
    const theme = useAtomValue(themeAtom);
    // themeAtom reads localStorage, which the server cannot see: painting the
    // swatch before mount makes the server and the client disagree.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const active = mounted ? THEMES.find((t) => t.id === theme) : undefined;
    return (
        <Dialog>
            <DialogTrigger
                aria-label="Theme colour"
                title="Theme colour"
                className={className}
            >
                <span
                    className="block size-5 rounded-full border border-border shadow-sm"
                    style={
                        active
                            ? { backgroundColor: `hsl(${active.hue} 100% 90%)` }
                            : undefined
                    }
                />
            </DialogTrigger>
            <DialogContent
                title="Theme colour"
                description="Only you see this choice."
            >
                <ThemePicker />
            </DialogContent>
        </Dialog>
    );
};
