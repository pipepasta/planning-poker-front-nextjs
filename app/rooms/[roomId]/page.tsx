import type { Metadata } from "next";
import { RoomScreen } from "@/src/components/room/RoomScreen";

export const metadata: Metadata = { title: "Room" };

const Page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
    const { roomId } = await params;
    return <RoomScreen roomId={roomId.slice(0, 12)} />;
};

export default Page;
