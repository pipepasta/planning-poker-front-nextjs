"use client";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import type { DeckId } from "@/src/domain/deck";
import type { TimerState } from "@/src/domain/timer";
import type { TimerActionName } from "@/src/protocol/messages";
import { CopyLink } from "./CopyLink";
import { DeckSwitcher } from "./DeckSwitcher";
import { NameDialog } from "./NameDialog";
import { RoomSettingsDialog } from "./RoomSettingsDialog";
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

// `header-chrome` re-points the ordinary colour tokens at their dark-bar
// values for everything inside, so the controls need no variant of their own.
export const RoomHeader = (p: Props) => (
    <header className="header-chrome sticky top-0 z-30 bg-header text-header-foreground">
        <div className="mx-auto flex max-w-5xl items-center gap-x-3 px-3 py-2">
            {/* The wordmark costs width a 390px header cannot spare. */}
            <span className="hidden text-lg font-semibold sm:inline">
                macaroni poker
            </span>
            <CopyLink roomId={p.roomId} />
            <div className="ml-auto flex items-center gap-x-3">
                <TimerControl
                    timer={p.timer}
                    clockOffsetMs={p.clockOffsetMs}
                    onAction={p.onTimer}
                />
                <div className="hidden items-center gap-x-3 sm:flex">
                    <DeckSwitcher deckId={p.deckId} onChange={p.onDeck} />
                    <NameDialog name={p.name} onSave={p.onRename} />
                    <ThemePicker />
                </div>
                <RoomSettingsDialog
                    className="sm:hidden"
                    name={p.name}
                    onRename={p.onRename}
                    deckId={p.deckId}
                    onDeck={p.onDeck}
                />
            </div>
        </div>
    </header>
);
