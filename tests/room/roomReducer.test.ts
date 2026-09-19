import { describe, expect, it } from "vitest";
import type { RoomSnapshot } from "@/src/protocol/messages";
import { initialRoomState, roomReducer } from "@/src/room/roomReducer";

const snap = (over: Partial<RoomSnapshot> = {}): RoomSnapshot => ({
    id: "r1",
    deckId: "fibonacci",
    metric: "decision",
    phase: "voting",
    timer: { status: "running", startedAt: 0, accumulatedMs: 0 },
    participants: [{ clientId: "me", name: "Me", hasVoted: false }],
    ...over,
});

describe("roomReducer", () => {
    it("tracks connection status", () => {
        let s = initialRoomState("me");
        s = roomReducer(s, { type: "connecting" });
        expect(s.connection).toBe("connecting");
        s = roomReducer(s, { type: "connected" });
        expect(s.everConnected).toBe(true);
        s = roomReducer(s, { type: "reconnecting" });
        expect(s.connection).toBe("reconnecting");
    });

    it("applies snapshots and clock offset", () => {
        const s = roomReducer(initialRoomState("me"), {
            type: "snapshot",
            room: snap(),
            serverTime: 1500,
            receivedAt: 1000,
        });
        expect(s.room?.id).toBe("r1");
        expect(s.clockOffsetMs).toBe(500);
    });

    it("keeps optimistic selection while server says voted, clears when server cleared it", () => {
        let s = roomReducer(initialRoomState("me"), {
            type: "selectCard",
            card: "5",
        });
        s = roomReducer(s, {
            type: "snapshot",
            room: snap({
                participants: [{ clientId: "me", name: "Me", hasVoted: true }],
            }),
            serverTime: 0,
            receivedAt: 0,
        });
        expect(s.myCard).toBe("5");
        s = roomReducer(s, {
            type: "snapshot",
            room: snap(),
            serverTime: 0,
            receivedAt: 0,
        });
        expect(s.myCard).toBeNull();
    });

    it("adopts the revealed vote from the server", () => {
        const s = roomReducer(initialRoomState("me"), {
            type: "snapshot",
            room: snap({
                phase: "revealed",
                participants: [
                    { clientId: "me", name: "Me", hasVoted: true, vote: "8" },
                ],
            }),
            serverTime: 0,
            receivedAt: 0,
        });
        expect(s.myCard).toBe("8");
    });
});
