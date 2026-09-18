import { type DeckId, isDeckId } from "@/src/domain/deck";
import { isMetricId, type MetricId } from "@/src/domain/metric";
import type { TimerState } from "@/src/domain/timer";

export const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ??
    "wss://sjy1ekd1t6.execute-api.ap-northeast-1.amazonaws.com/v1/";

// Client-side validation limits. These mirror the server's own validation in
// planning-poker-server/cdk/src/protocol — keep both sides in step.
export const ROOM_ID_MAX = 12;
export const NAME_MAX = 15;

export const isValidRoomId = (value: string): boolean =>
    value.length >= 1 &&
    value.length <= ROOM_ID_MAX &&
    !/\s/.test(value) &&
    !value.includes("/");

export type TimerActionName = "resetTimer" | "pauseTimer" | "resumeTimer";
export type Phase = "voting" | "revealed";

export type ClientMessage =
    | { action: "joinRoom"; roomId: string; name: string }
    | { action: "submitCard"; roomId: string; card: string }
    | { action: "revealAllCards"; roomId: string }
    | { action: "resetRoom"; roomId: string }
    | { action: TimerActionName; roomId: string }
    | { action: "reaction"; roomId: string; emoji: string }
    | { action: "changeDeck"; roomId: string; deckId: DeckId }
    | { action: "changeMetric"; roomId: string; metric: MetricId };

export type ErrorCode =
    | "invalid_message"
    | "not_in_room"
    | "invalid_card"
    | "unknown_deck"
    | "unknown_metric"
    | "invalid_name"
    | "invalid_room_id"
    | "internal";

export interface SnapshotParticipant {
    clientId: string;
    name: string;
    hasVoted: boolean;
    vote?: string | null;
}

export interface RoomSnapshot {
    id: string;
    deckId: DeckId;
    metric: MetricId;
    phase: Phase;
    timer: TimerState;
    participants: SnapshotParticipant[];
}

export type ServerMessage =
    | { type: "room"; serverTime: number; room: RoomSnapshot }
    | {
          type: "reaction";
          emoji: string;
          from: { clientId: string; name: string };
      }
    | { type: "error"; code: ErrorCode; message: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;
const isString = (v: unknown): v is string => typeof v === "string";

const parseTimer = (v: unknown): TimerState | null => {
    if (!isRecord(v)) return null;
    if (v.status !== "running" && v.status !== "paused") return null;
    if (v.startedAt !== null && typeof v.startedAt !== "number") return null;
    if (typeof v.accumulatedMs !== "number") return null;
    return {
        status: v.status,
        startedAt: v.startedAt,
        accumulatedMs: v.accumulatedMs,
    };
};

const parseParticipant = (v: unknown): SnapshotParticipant | null => {
    if (
        !isRecord(v) ||
        !isString(v.clientId) ||
        !isString(v.name) ||
        typeof v.hasVoted !== "boolean"
    )
        return null;
    const p: SnapshotParticipant = {
        clientId: v.clientId,
        name: v.name,
        hasVoted: v.hasVoted,
    };
    if ("vote" in v) {
        if (v.vote !== null && !isString(v.vote)) return null;
        p.vote = v.vote;
    }
    return p;
};

const parseSnapshot = (v: unknown): RoomSnapshot | null => {
    if (!isRecord(v) || !isString(v.id) || !isDeckId(v.deckId)) return null;
    if (!isMetricId(v.metric)) return null;
    if (v.phase !== "voting" && v.phase !== "revealed") return null;
    const timer = parseTimer(v.timer);
    if (!timer || !Array.isArray(v.participants)) return null;
    const participants = v.participants.map(parseParticipant);
    if (participants.some((p) => p === null)) return null;
    return {
        id: v.id,
        deckId: v.deckId,
        metric: v.metric,
        phase: v.phase,
        timer,
        participants: participants as SnapshotParticipant[],
    };
};

export const parseServerMessage = (raw: unknown): ServerMessage | null => {
    if (!isRecord(raw)) return null;
    switch (raw.type) {
        case "room": {
            const room = parseSnapshot(raw.room);
            return room && typeof raw.serverTime === "number"
                ? { type: "room", serverTime: raw.serverTime, room }
                : null;
        }
        case "reaction":
            return isString(raw.emoji) &&
                isRecord(raw.from) &&
                isString(raw.from.clientId) &&
                isString(raw.from.name)
                ? {
                      type: "reaction",
                      emoji: raw.emoji,
                      from: {
                          clientId: raw.from.clientId,
                          name: raw.from.name,
                      },
                  }
                : null;
        case "error":
            return isString(raw.code) && isString(raw.message)
                ? {
                      type: "error",
                      code: raw.code as ErrorCode,
                      message: raw.message,
                  }
                : null;
        default:
            return null;
    }
};
