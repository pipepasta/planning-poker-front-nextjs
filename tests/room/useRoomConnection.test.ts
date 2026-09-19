// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getToasts } from "@/src/lib/toast";
import { backoffDelay, useRoomConnection } from "@/src/room/useRoomConnection";

const MAX_ATTEMPTS = 10;

class FakeSocket {
    static instances: FakeSocket[] = [];
    readyState: number = WebSocket.OPEN;
    sent: string[] = [];
    closed = false;
    onopen: (() => void) | null = null;
    onclose: (() => void) | null = null;
    onmessage: ((event: { data: unknown }) => void) | null = null;

    constructor(readonly url: string) {
        FakeSocket.instances.push(this);
    }

    send(data: string) {
        this.sent.push(data);
    }

    close() {
        this.closed = true;
        this.readyState = WebSocket.CLOSED;
    }

    open() {
        this.onopen?.();
    }

    emit(data: unknown) {
        this.onmessage?.({ data });
    }

    fireClose() {
        this.readyState = WebSocket.CLOSED;
        this.onclose?.();
    }
}

const snapshotFrame = (metric = "decision") =>
    JSON.stringify({
        type: "room",
        serverTime: 1000,
        room: {
            id: "r1",
            deckId: "fibonacci",
            metric,
            phase: "voting",
            timer: { status: "paused", startedAt: null, accumulatedMs: 0 },
            participants: [
                { clientId: "me", name: "Me", hasVoted: false },
                { clientId: "you", name: "You", hasVoted: true },
            ],
        },
    });

/** Let the awaited getToken() promise inside connect() settle. */
const flush = () => act(async () => {});

const mount = (token: string | null = "tok") => {
    const createSocket = vi.fn(
        (url: string) => new FakeSocket(url) as unknown as WebSocket,
    );
    const getToken = vi.fn(async () => token);
    const view = renderHook(() =>
        useRoomConnection({
            roomId: "r1",
            myClientId: "me",
            name: "Me",
            getToken,
            onReaction: () => {},
            createSocket,
        }),
    );
    return { ...view, createSocket, getToken };
};

const latest = () => FakeSocket.instances[FakeSocket.instances.length - 1];

describe("useRoomConnection", () => {
    beforeEach(() => {
        FakeSocket.instances = [];
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("joins the room on open and reports connected", async () => {
        const { result } = mount();
        await flush();
        await act(async () => latest().open());

        expect(result.current.state.connection).toBe("connected");
        expect(JSON.parse(latest().sent[0])).toEqual({
            action: "joinRoom",
            roomId: "r1",
            name: "Me",
        });
    });

    it("applies a room snapshot", async () => {
        const { result } = mount();
        await flush();
        await act(async () => latest().open());
        await act(async () => latest().emit(snapshotFrame()));

        expect(result.current.state.room?.id).toBe("r1");
        expect(result.current.state.room?.metric).toBe("decision");
        expect(result.current.state.room?.participants).toHaveLength(2);
    });

    it("sends changeMetric and toasts when the room's metric changes", async () => {
        const { result } = mount();
        await flush();
        await act(async () => latest().open());
        await act(async () => latest().emit(snapshotFrame()));

        await act(async () => result.current.actions.changeMetric("mode"));
        expect(JSON.parse(latest().sent.at(-1) as string)).toEqual({
            action: "changeMetric",
            roomId: "r1",
            metric: "mode",
        });

        // The toast follows the server's snapshot, not the local click, so
        // everyone in the room sees it.
        expect(getToasts().map((t) => t.message)).not.toContain("Showing Mode");
        await act(async () => latest().emit(snapshotFrame("mode")));
        expect(getToasts().map((t) => t.message)).toContain("Showing Mode");
    });

    it("reconnects after a close with the first backoff delay", async () => {
        const { result } = mount();
        await flush();
        await act(async () => latest().open());
        await act(async () => latest().fireClose());

        expect(result.current.state.connection).toBe("reconnecting");
        expect(FakeSocket.instances).toHaveLength(1);

        await act(async () => {
            vi.advanceTimersByTime(backoffDelay(0) - 1);
        });
        expect(FakeSocket.instances).toHaveLength(1);

        await act(async () => {
            vi.advanceTimersByTime(1);
        });
        await flush();
        expect(FakeSocket.instances).toHaveLength(2);
    });

    it("gives up after the attempt budget is spent", async () => {
        const { result } = mount();
        await flush();

        for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
            await act(async () => latest().fireClose());
            expect(result.current.state.connection).toBe("reconnecting");
            await act(async () => {
                vi.advanceTimersByTime(backoffDelay(i));
            });
            await flush();
        }
        await act(async () => latest().fireClose());

        expect(result.current.state.connection).toBe("failed");
    });

    it("retries instead of failing when the token is missing", async () => {
        const { result, getToken } = mount(null);
        await flush();

        expect(result.current.state.connection).toBe("reconnecting");
        expect(FakeSocket.instances).toHaveLength(0);

        await act(async () => {
            vi.advanceTimersByTime(backoffDelay(0));
        });
        await flush();
        expect(getToken).toHaveBeenCalledTimes(2);
        expect(result.current.state.connection).toBe("reconnecting");
    });

    it("closes the socket and stops pinging on unmount", async () => {
        const { unmount } = mount();
        await flush();
        await act(async () => latest().open());

        const socket = latest();
        await act(async () => {
            vi.advanceTimersByTime(5 * 60 * 1000);
        });
        expect(socket.sent).toEqual([socket.sent[0], "ping"]);

        unmount();
        expect(socket.closed).toBe(true);

        const afterUnmount = socket.sent.length;
        await act(async () => {
            vi.advanceTimersByTime(30 * 60 * 1000);
        });
        expect(socket.sent).toHaveLength(afterUnmount);
        expect(FakeSocket.instances).toHaveLength(1);
    });
});
