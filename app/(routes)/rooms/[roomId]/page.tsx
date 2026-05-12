import type { Metadata } from "next";
import RoomClient from "./RoomClient";

export const metadata: Metadata = { title: "Room" };

const Page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
    const { roomId } = await params;
    const extractedRoomId = roomId.substring(0, 12);

    return <RoomClient roomId={extractedRoomId} />;
};

export default Page;
