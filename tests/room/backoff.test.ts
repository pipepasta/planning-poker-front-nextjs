import { describe, expect, it } from "vitest";
import { backoffDelay } from "@/src/room/useRoomConnection";

describe("backoffDelay", () => {
    it("doubles from 1s and caps at 30s", () => {
        expect(backoffDelay(0)).toBe(1000);
        expect(backoffDelay(3)).toBe(8000);
        expect(backoffDelay(9)).toBe(30000);
    });
});
