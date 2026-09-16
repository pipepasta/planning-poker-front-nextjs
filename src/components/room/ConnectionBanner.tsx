import { Button } from "@/src/components/ui/Button";
import type { ConnectionStatus } from "@/src/room/roomReducer";

export const ConnectionBanner = ({ status }: { status: ConnectionStatus }) => {
    if (status === "reconnecting") {
        return (
            // biome-ignore lint/a11y/useSemanticElements: a live status banner, not form output
            <div
                role="status"
                className="border-b-2 border-ink bg-macaroni px-4 py-1 text-center text-sm font-bold"
            >
                Reconnecting…
            </div>
        );
    }
    if (status === "failed") {
        return (
            <div
                role="alert"
                className="flex items-center justify-center gap-3 border-b-2 border-ink bg-danger px-4 py-1 text-sm font-bold text-cream"
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
