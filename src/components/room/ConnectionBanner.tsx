import { Button } from "@/src/components/ui/Button";
import type { ConnectionStatus } from "@/src/room/roomReducer";

export const ConnectionBanner = ({ status }: { status: ConnectionStatus }) => {
    if (status === "reconnecting") {
        return (
            // biome-ignore lint/a11y/useSemanticElements: a live status banner, not form output
            <div
                role="status"
                className="border-b border-border bg-secondary px-4 py-1 text-center text-sm font-semibold text-secondary-foreground"
            >
                Reconnecting…
            </div>
        );
    }
    if (status === "failed") {
        return (
            <div
                role="alert"
                className="flex items-center justify-center gap-3 bg-destructive px-4 py-1 text-sm font-semibold text-destructive-foreground"
            >
                Connection lost.
                <Button
                    size="md"
                    variant="secondary"
                    onClick={() => window.location.reload()}
                >
                    Reload
                </Button>
            </div>
        );
    }
    return null;
};
