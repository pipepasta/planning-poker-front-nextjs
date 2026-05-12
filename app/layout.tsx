import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "./_components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteName = "macaroni poker";
const description = "online planning poker application";
const url = "https://macaroni-poker.vercel.app";
export const metadata: Metadata = {
    title: { default: siteName, template: `%s | ${siteName}` },
    description: description,
    metadataBase: new URL(url),
    openGraph: {
        title: siteName,
        description,
        url,
        siteName,
    },
    twitter: {
        title: siteName,
        description,
        card: "summary_large_image",
    },
    other: {
        google: "notranslate",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
