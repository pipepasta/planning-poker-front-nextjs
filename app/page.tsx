import type { Metadata } from "next";
import { HomeScreen } from "@/src/components/home/HomeScreen";

export const metadata: Metadata = { title: "Home" };

const Page = () => <HomeScreen />;
export default Page;
