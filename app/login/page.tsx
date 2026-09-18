import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/src/components/login/LoginForm";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import { Wordmark } from "@/src/components/Wordmark";

export const metadata: Metadata = { title: "Sign in" };

const Page = () => (
    <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-3 p-3">
            <Wordmark />
            <ThemePicker />
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
            <Suspense>
                <LoginForm />
            </Suspense>
        </main>
    </div>
);

export default Page;
