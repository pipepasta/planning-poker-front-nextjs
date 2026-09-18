"use client";
import { ThemeDialog } from "@/src/components/theme/ThemeDialog";
import { Wordmark } from "@/src/components/Wordmark";
import type { Deck, DeckId } from "@/src/domain/deck";
import type { MetricId } from "@/src/domain/metric";
import type { TimerState } from "@/src/domain/timer";
import type { TimerActionName } from "@/src/protocol/messages";
import { CopyLink } from "./CopyLink";
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
    deck: Deck;
    onDeck: (id: DeckId) => void;
    metric: MetricId;
    onMetric: (id: MetricId) => void;
}

const control =
    "inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground";

// `header-chrome` re-points the ordinary colour tokens at their dark-bar
// values for everything inside, so the controls need no variant of their own.
//
// One composition at every width: the room's own settings sit behind the gear,
// the personal ones (name, theme) stay out here beside it. Nothing is hidden
// at a breakpoint — only the two text labels, the wordmark's and the name's,
// step aside below `sm` so the six controls hold one row at 390px.
export const RoomHeader = (p: Props) => (
    <header className="header-chrome sticky top-0 z-30 bg-header text-header-foreground">
        <div className="mx-auto flex max-w-5xl items-center gap-x-1.5 px-2 py-2 sm:gap-x-3 sm:px-3">
            <Wordmark compact />
            <CopyLink roomId={p.roomId} />
            <div className="ml-auto flex items-center gap-x-1.5 sm:gap-x-3">
                <TimerControl
                    timer={p.timer}
                    clockOffsetMs={p.clockOffsetMs}
                    onAction={p.onTimer}
                />
                <RoomSettingsDialog
                    deck={p.deck}
                    onDeck={p.onDeck}
                    metric={p.metric}
                    onMetric={p.onMetric}
                />
                <NameDialog compact name={p.name} onSave={p.onRename} />
                <ThemeDialog className={control} />
            </div>
        </div>
    </header>
);
