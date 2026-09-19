"use client";
import { AppHeader } from "@/src/components/AppHeader";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
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

// The room's controls, in the bar `AppHeader` owns.
//
// The bar is split by who a setting affects. The room's own settings are always
// behind the gear. The personal ones sit out here from `lg` up — the room bar
// also carries the link and the timer, so that is the first width where all of
// them fit beside a whole wordmark. Below it they fold into the same gear
// dialog rather than the lockup giving up its word.
export const RoomHeader = (p: Props) => (
    <AppHeader>
        <CopyLink roomId={p.roomId} />
        <div className="ml-auto flex items-center gap-x-1 sm:gap-x-3">
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
            <div className="hidden items-center gap-x-3 lg:flex">
                <NameDialog name={p.name} onSave={p.onRename} />
                <ThemePicker />
            </div>
        </div>
    </AppHeader>
);
