import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme/ThemeProvider";
import { Toaster } from "@/src/components/ui/Toaster";
import "./globals.css";

const baloo = Baloo_2({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    variable: "--font-baloo",
});
const nunito = Nunito({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-nunito",
});

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
            <body className="min-h-dvh">
                <ThemeProvider>{children}</ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
