import { describe, expect, it } from "vitest";
import { resolveRedirectTarget } from "@/src/lib/auth";

describe("resolveRedirectTarget", () => {
    it("only allows same-origin absolute paths", () => {
        expect(resolveRedirectTarget("/rooms/abc?x=1")).toBe("/rooms/abc?x=1");
        expect(resolveRedirectTarget("//evil.com")).toBe("/");
        expect(resolveRedirectTarget("https://evil.com")).toBe("/");
        expect(resolveRedirectTarget(null)).toBe("/");
    });
});
