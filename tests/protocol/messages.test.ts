import { describe, expect, it } from "vitest";
import {
    isValidRoomId,
    NAME_MAX,
    parseServerMessage,
    ROOM_ID_MAX,
} from "@/src/protocol/messages";

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

describe("isValidRoomId", () => {
    it("accepts a plain short id", () => {
        expect(isValidRoomId("abc")).toBe(true);
        expect(isValidRoomId("a".repeat(ROOM_ID_MAX))).toBe(true);
    });

    it("rejects empty, over-long, spaced and slashed ids", () => {
        expect(isValidRoomId("")).toBe(false);
        expect(isValidRoomId("a".repeat(ROOM_ID_MAX + 1))).toBe(false);
        expect(isValidRoomId("a b")).toBe(false);
        expect(isValidRoomId("a\tb")).toBe(false);
        expect(isValidRoomId("a/b")).toBe(false);
    });

    it("pins the limits shared with the server", () => {
        expect(ROOM_ID_MAX).toBe(12);
        expect(NAME_MAX).toBe(15);
    });
});
