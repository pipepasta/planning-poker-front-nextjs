import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = { title: "Home" };

const Page = () => <HomeClient />;
export default Page;
