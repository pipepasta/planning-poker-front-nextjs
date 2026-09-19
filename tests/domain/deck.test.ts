import { describe, expect, it } from "vitest";
import {
    DECK_LIST,
    DECKS,
    DEFAULT_DECK_ID,
    isCardInDeck,
    isDeckId,
    SKIP_CARD,
} from "@/src/domain/deck";

// Drift guard: these values are duplicated in
// planning-poker-server/cdk/src/domain/deck.ts. Changing them here without
// changing them there breaks card validation on the server, so this test is
// deliberately exact.
describe("deck definitions (server parity)", () => {
    it("pins the deck ids", () => {
        expect(Object.keys(DECKS)).toEqual(["fibonacci", "tshirt"]);
        expect(DECK_LIST.map((d) => d.id)).toEqual(["fibonacci", "tshirt"]);
        expect(DEFAULT_DECK_ID).toBe("fibonacci");
        expect(SKIP_CARD).toBe("skip");
    });

    it("pins the fibonacci deck", () => {
        expect(DECKS.fibonacci).toEqual({
            id: "fibonacci",
            label: "Fibonacci",
            kind: "numeric",
            cards: ["0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
        });
    });

    it("pins the t-shirt deck", () => {
        expect(DECKS.tshirt).toEqual({
            id: "tshirt",
            label: "T-shirt",
            kind: "ordinal",
            cards: ["S", "M", "L", "XL"],
        });
    });

    it("recognises deck ids and cards", () => {
        expect(isDeckId("fibonacci")).toBe(true);
        expect(isDeckId("poker")).toBe(false);
        expect(isCardInDeck(DECKS.tshirt, "XL")).toBe(true);
        expect(isCardInDeck(DECKS.tshirt, SKIP_CARD)).toBe(true);
        expect(isCardInDeck(DECKS.tshirt, "XXL")).toBe(false);
    });
});
