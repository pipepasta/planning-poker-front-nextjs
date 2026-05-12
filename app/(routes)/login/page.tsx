import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Sign In" };

const Page = () => <LoginClient />;
export default Page;
