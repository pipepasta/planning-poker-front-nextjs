import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Sign In" };

const Page = () => (
    <Suspense>
        <LoginClient />
    </Suspense>
);
export default Page;
