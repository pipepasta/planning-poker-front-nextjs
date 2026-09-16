"use client";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import type { DeckId } from "@/src/domain/deck";
import type { TimerState } from "@/src/domain/timer";
import type { TimerActionName } from "@/src/protocol/messages";
import { CopyLink } from "./CopyLink";
import { DeckSwitcher } from "./DeckSwitcher";
import { NameDialog } from "./NameDialog";
import { TimerControl } from "./TimerControl";

interface Props {
    roomId: string;
    name: string;
    onRename: (name: string) => Promise<void>;
    timer: TimerState | undefined;
    clockOffsetMs: number;
    onTimer: (action: TimerActionName) => void;
    deckId: DeckId;
    onDeck: (id: DeckId) => void;
}

export const RoomHeader = (p: Props) => (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5">
            <span className="font-display text-xl font-extrabold">
                macaroni poker
            </span>
            <CopyLink roomId={p.roomId} />
            <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1">
                <TimerControl
                    timer={p.timer}
                    clockOffsetMs={p.clockOffsetMs}
                    onAction={p.onTimer}
                />
                <DeckSwitcher deckId={p.deckId} onChange={p.onDeck} />
                <NameDialog name={p.name} onSave={p.onRename} />
                <ThemePicker />
            </div>
        </div>
    </header>
);
