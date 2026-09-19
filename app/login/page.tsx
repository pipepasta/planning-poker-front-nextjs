import type { Metadata } from "next";
import { Suspense } from "react";
import { AppHeader } from "@/src/components/AppHeader";
import { LoginForm } from "@/src/components/login/LoginForm";
import { ThemePicker } from "@/src/components/theme/ThemePicker";

export const metadata: Metadata = { title: "Sign in" };

// Nobody is signed in yet, so the bar carries the one setting that exists
// before a name does: the theme.
const Page = () => (
    <div className="flex min-h-dvh flex-col">
        <AppHeader>
            <div className="ml-auto flex items-center">
                <ThemePicker />
            </div>
        </AppHeader>
        <main className="flex flex-1 items-center justify-center p-4">
            <Suspense>
                <LoginForm />
            </Suspense>
        </main>
    </div>
);

export default Page;
