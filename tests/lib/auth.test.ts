import { describe, expect, it } from "vitest";
import { resolveRedirectTarget } from "@/src/lib/auth";

describe("resolveRedirectTarget", () => {
    it("keeps same-origin absolute paths", () => {
        expect(resolveRedirectTarget("/rooms/abc?x=1")).toBe("/rooms/abc?x=1");
        expect(resolveRedirectTarget("/")).toBe("/");
    });

    it("rejects protocol-relative and absolute URLs", () => {
        expect(resolveRedirectTarget("//evil.com")).toBe("/");
        expect(resolveRedirectTarget("https://evil.com")).toBe("/");
        expect(resolveRedirectTarget(null)).toBe("/");
        expect(resolveRedirectTarget("")).toBe("/");
        expect(resolveRedirectTarget("rooms/abc")).toBe("/");
    });

    it("rejects backslash-smuggled hosts", () => {
        expect(resolveRedirectTarget("/\\evil.com")).toBe("/");
        expect(resolveRedirectTarget("/\\/evil.com")).toBe("/");
        expect(resolveRedirectTarget("/\\\\evil.com")).toBe("/");
    });
});
