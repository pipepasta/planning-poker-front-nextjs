import type { RoomSnapshot } from "@/src/protocol/messages";

export type ConnectionStatus =
    | "idle"
    | "connecting"
    | "connected"
    | "reconnecting"
    | "failed";

export interface RoomState {
    myClientId: string;
    connection: ConnectionStatus;
    room: RoomSnapshot | null;
    clockOffsetMs: number;
    myCard: string | null;
    everConnected: boolean;
}

export type RoomEvent =
    | { type: "connecting" }
    | { type: "connected" }
    | { type: "reconnecting" }
    | { type: "failed" }
    | {
          type: "snapshot";
          room: RoomSnapshot;
          serverTime: number;
          receivedAt: number;
      }
    | { type: "selectCard"; card: string };

export const initialRoomState = (myClientId: string): RoomState => ({
    myClientId,
    connection: "idle",
    room: null,
    clockOffsetMs: 0,
    myCard: null,
    everConnected: false,
});

export const roomReducer = (state: RoomState, event: RoomEvent): RoomState => {
    switch (event.type) {
        case "connecting":
        case "reconnecting":
        case "failed":
            return { ...state, connection: event.type };
        case "connected":
            return { ...state, connection: "connected", everConnected: true };
        case "selectCard":
            return { ...state, myCard: event.card };
        case "snapshot": {
            const me = event.room.participants.find(
                (p) => p.clientId === state.myClientId,
            );
            const myCard =
                !me || !me.hasVoted
                    ? null
                    : typeof me.vote === "string"
                      ? me.vote
                      : state.myCard;
            return {
                ...state,
                room: event.room,
                clockOffsetMs: event.serverTime - event.receivedAt,
                myCard,
            };
        }
    }
};
