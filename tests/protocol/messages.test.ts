import { describe, expect, it } from "vitest";
import { parseServerMessage } from "@/src/protocol/messages";

const snapshot = {
    type: "room",
    serverTime: 5,
    room: {
        id: "r1",
        deckId: "fibonacci",
        phase: "voting",
        timer: { status: "running", startedAt: 1, accumulatedMs: 0 },
        participants: [{ clientId: "a", name: "A", hasVoted: true }],
    },
};

describe("parseServerMessage", () => {
    it("accepts room, reaction and error messages", () => {
        expect(parseServerMessage(snapshot)).toEqual(snapshot);
        expect(
            parseServerMessage({
                type: "reaction",
                emoji: "👍",
                from: { clientId: "a", name: "A" },
            }),
        ).toEqual({
            type: "reaction",
            emoji: "👍",
            from: { clientId: "a", name: "A" },
        });
        expect(
            parseServerMessage({
                type: "error",
                code: "invalid_card",
                message: "x",
            }),
        ).toEqual({ type: "error", code: "invalid_card", message: "x" });
    });

    it("rejects malformed messages", () => {
        expect(parseServerMessage("pong")).toBeNull();
        expect(parseServerMessage({ type: "room" })).toBeNull();
        expect(
            parseServerMessage({
                ...snapshot,
                room: { ...snapshot.room, deckId: "poker" },
            }),
        ).toBeNull();
        expect(
            parseServerMessage({
                ...snapshot,
                room: { ...snapshot.room, participants: [{ clientId: 1 }] },
            }),
        ).toBeNull();
        expect(
            parseServerMessage({ type: "reaction", emoji: "👍" }),
        ).toBeNull();
    });
});
