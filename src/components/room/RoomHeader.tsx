"use client";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import { Wordmark } from "@/src/components/Wordmark";
import type { Deck, DeckId } from "@/src/domain/deck";
import type { MetricId } from "@/src/domain/metric";
import type { TimerState } from "@/src/domain/timer";
import type { TimerActionName } from "@/src/protocol/messages";
import { CopyLink } from "./CopyLink";
import { NameDialog } from "./NameDialog";
import { SettingsDialog } from "./SettingsDialog";
import { TimerControl } from "./TimerControl";

interface Props {
    roomId: string;
    name: string;
    onRename: (name: string) => Promise<void>;
    timer: TimerState | undefined;
    clockOffsetMs: number;
    onTimer: (action: TimerActionName) => void;
    deck: Deck;
    onDeck: (id: DeckId) => void;
    metric: MetricId;
    onMetric: (id: MetricId) => void;
}

// `header-chrome` re-points the ordinary colour tokens at their dark-bar
// values for everything inside, so the controls need no variant of their own.
//
// The bar is split by who a setting affects. The room's own settings are always
// behind the gear. The personal ones sit out here from `sm` up; below that the
// bar keeps the whole wordmark, so they fold into the same gear dialog rather
// than the lockup giving up its word.
export const RoomHeader = (p: Props) => (
    <header className="header-chrome sticky top-0 z-30 bg-header text-header-foreground">
        <div className="mx-auto flex max-w-5xl items-center gap-x-1.5 px-2 py-2 sm:gap-x-3 sm:px-3">
            <Wordmark />
            <CopyLink roomId={p.roomId} />
            <div className="ml-auto flex items-center gap-x-1.5 sm:gap-x-3">
                <TimerControl
                    timer={p.timer}
                    clockOffsetMs={p.clockOffsetMs}
                    onAction={p.onTimer}
                />
                <SettingsDialog
                    deck={p.deck}
                    onDeck={p.onDeck}
                    metric={p.metric}
                    onMetric={p.onMetric}
                    name={p.name}
                    onRename={p.onRename}
                />
                <div className="hidden items-center gap-x-3 sm:flex">
                    <NameDialog name={p.name} onSave={p.onRename} />
                    <ThemePicker />
                </div>
            </div>
        </div>
    </header>
);
