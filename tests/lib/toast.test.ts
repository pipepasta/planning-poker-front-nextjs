import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dismissToast, getToasts, toast } from "@/src/lib/toast";

describe("toast store", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("adds and auto-dismisses", () => {
        toast("hello", "success");
        expect(getToasts()).toMatchObject([
            { message: "hello", kind: "success" },
        ]);
        vi.advanceTimersByTime(3000);
        expect(getToasts()).toEqual([]);
    });

    it("dismisses by id", () => {
        toast("x");
        dismissToast(getToasts()[0].id);
        expect(getToasts()).toEqual([]);
    });
});
