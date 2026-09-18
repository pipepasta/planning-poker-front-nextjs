import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme/ThemeProvider";
import { Toaster } from "@/src/components/ui/Toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteName = "macaroni poker";
const description = "online planning poker application";
const url = "https://macaroni-poker.vercel.app";

export const metadata: Metadata = {
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    metadataBase: new URL(url),
    openGraph: { title: siteName, description, url, siteName },
    twitter: { title: siteName, description, card: "summary_large_image" },
    other: { google: "notranslate" },
};

/**
 * Applies the stored theme before the first paint. No interpolation: the
 * value is read from localStorage at runtime, validated against the known
 * ids, and only ever reaches `dataset.theme`, so nothing can be injected.
 * Keep the ids and the storage key in step with `src/lib/prefs.ts`.
 */
const THEME_BOOTSTRAP = `try{var t=JSON.parse(localStorage.getItem("mp.theme"));if(["pink","blue","green","purple","orange"].indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // THEME_BOOTSTRAP adds data-theme before React hydrates, so the server
        // markup and the client element differ by that one attribute. This
        // suppresses the warning for <html>'s own attributes only; children
        // are still checked normally.
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                {/* The server cannot see localStorage, so without this the first
                    paint always uses the default theme and then snaps to the
                    stored one — very visible now that the header is a saturated
                    bar. Runs before paint; ThemeProvider owns every later change. */}
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: fixed literal, no interpolation
                    dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
                />
            </head>
            <body className="min-h-dvh">
                <ThemeProvider>{children}</ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
