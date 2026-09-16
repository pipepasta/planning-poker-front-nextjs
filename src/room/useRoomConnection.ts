"use client";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { DECKS, type DeckId } from "@/src/domain/deck";
import { tap } from "@/src/lib/haptics";
import { toast } from "@/src/lib/toast";
import {
    type ClientMessage,
    parseServerMessage,
    type TimerActionName,
    WS_URL,
} from "@/src/protocol/messages";
import { initialRoomState, type RoomState, roomReducer } from "./roomReducer";

const MAX_ATTEMPTS = 10;
const PING_INTERVAL_MS = 5 * 60 * 1000;

export const backoffDelay = (attempt: number): number =>
    Math.min(1000 * 2 ** attempt, 30_000);

export interface RoomActions {
    selectCard: (card: string) => void;
    reveal: () => void;
    nextRound: () => void;
    timer: (action: TimerActionName) => void;
    changeDeck: (deckId: DeckId) => void;
    react: (emoji: string) => void;
}

interface Options {
    roomId: string;
    myClientId: string;
    name: string;
    getToken: () => Promise<string | null>;
    onReaction: (
        emoji: string,
        from: { clientId: string; name: string },
    ) => void;
}

export const useRoomConnection = ({
    roomId,
    myClientId,
    name,
    getToken,
    onReaction,
}: Options): { state: RoomState; actions: RoomActions } => {
    const [state, dispatch] = useReducer(
        roomReducer,
        myClientId,
        initialRoomState,
    );
    const socketRef = useRef<WebSocket | null>(null);
    const nameRef = useRef(name);
    const onReactionRef = useRef(onReaction);
    const prevDeckRef = useRef<DeckId | null>(null);

    useEffect(() => {
        nameRef.current = name;
    }, [name]);

    useEffect(() => {
        onReactionRef.current = onReaction;
    }, [onReaction]);

    const send = useCallback((message: ClientMessage | "ping") => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(
            typeof message === "string" ? message : JSON.stringify(message),
        );
    }, []);

    useEffect(() => {
        let cancelled = false;
        let attempt = 0;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let pingTimer: ReturnType<typeof setInterval> | null = null;

        const cleanupTimers = () => {
            if (pingTimer) clearInterval(pingTimer);
            if (reconnectTimer) clearTimeout(reconnectTimer);
            pingTimer = null;
            reconnectTimer = null;
        };

        const connect = async () => {
            dispatch({ type: attempt > 0 ? "reconnecting" : "connecting" });
            const token = await getToken();
            if (cancelled) return;
            if (!token) {
                dispatch({ type: "failed" });
                return;
            }
            const socket = new WebSocket(
                `${WS_URL}?token=${encodeURIComponent(token)}`,
            );
            socketRef.current = socket;

            socket.onopen = () => {
                attempt = 0;
                dispatch({ type: "connected" });
                socket.send(
                    JSON.stringify({
                        action: "joinRoom",
                        roomId,
                        name: nameRef.current,
                    }),
                );
                pingTimer = setInterval(
                    () => socket.send("ping"),
                    PING_INTERVAL_MS,
                );
            };

            socket.onmessage = (event) => {
                if (event.data === "pong") return;
                let raw: unknown;
                try {
                    raw = JSON.parse(String(event.data));
                } catch {
                    return;
                }
                const message = parseServerMessage(raw);
                if (!message) {
                    console.warn("unrecognised message", raw);
                    return;
                }
                if (message.type === "room") {
                    dispatch({
                        type: "snapshot",
                        room: message.room,
                        serverTime: message.serverTime,
                        receivedAt: Date.now(),
                    });
                } else if (message.type === "reaction") {
                    onReactionRef.current(message.emoji, message.from);
                } else {
                    toast(message.message, "error");
                }
            };

            socket.onclose = () => {
                if (pingTimer) clearInterval(pingTimer);
                pingTimer = null;
                if (cancelled) return;
                if (attempt >= MAX_ATTEMPTS) {
                    dispatch({ type: "failed" });
                    return;
                }
                dispatch({ type: "reconnecting" });
                reconnectTimer = setTimeout(connect, backoffDelay(attempt));
                attempt += 1;
            };
        };

        connect();
        return () => {
            cancelled = true;
            cleanupTimers();
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, [roomId, myClientId, getToken]);

    useEffect(() => {
        if (name) send({ action: "joinRoom", roomId, name });
    }, [name, roomId, send]);

    useEffect(() => {
        const deckId = state.room?.deckId ?? null;
        if (deckId && prevDeckRef.current && prevDeckRef.current !== deckId) {
            toast(`Deck switched to ${DECKS[deckId].label}`);
        }
        prevDeckRef.current = deckId;
    }, [state.room?.deckId]);

    const wasReconnecting = useRef(false);
    useEffect(() => {
        if (state.connection === "reconnecting" && !wasReconnecting.current) {
            wasReconnecting.current = true;
            toast("Connection lost. Reconnecting…", "warning");
        }
        if (state.connection === "connected" && wasReconnecting.current) {
            wasReconnecting.current = false;
            toast("Reconnected", "success");
        }
    }, [state.connection]);

    const actions: RoomActions = {
        selectCard: (card) => {
            dispatch({ type: "selectCard", card });
            send({ action: "submitCard", roomId, card });
            tap();
        },
        reveal: () => {
            send({ action: "revealAllCards", roomId });
            tap();
        },
        nextRound: () => {
            send({ action: "resetRoom", roomId });
            tap();
        },
        timer: (action) => send({ action, roomId }),
        changeDeck: (deckId) => send({ action: "changeDeck", roomId, deckId }),
        react: (emoji) => send({ action: "reaction", roomId, emoji }),
    };

    return { state, actions };
};
