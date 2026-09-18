"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NameDialog } from "@/src/components/room/NameDialog";
import { ThemePicker } from "@/src/components/theme/ThemePicker";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Panel } from "@/src/components/ui/Panel";
import { Wordmark } from "@/src/components/Wordmark";
import { useSession } from "@/src/lib/session";
import { isValidRoomId, ROOM_ID_MAX } from "@/src/protocol/messages";

export const HomeScreen = () => {
    const router = useRouter();
    const session = useSession();
    const [roomId, setRoomId] = useState("");
    const valid = isValidRoomId(roomId);
    const enter = (id: string) =>
        router.push(`/rooms/${encodeURIComponent(id)}`);

    return (
        <div className="flex min-h-dvh flex-col">
            <header className="flex items-center justify-between gap-3 p-3">
                <Wordmark />
                <div className="flex items-center gap-3">
                    {session.status === "ready" && (
                        <NameDialog
                            name={session.displayName}
                            onSave={session.rename}
                        />
                    )}
                    <ThemePicker />
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center p-4">
                <Panel className="w-full max-w-sm p-6">
                    <h1 className="mb-5 text-center text-2xl font-semibold">
                        Join a table
                    </h1>
                    <form
                        className="flex gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (valid) enter(roomId);
                        }}
                    >
                        <Input
                            aria-label="Room ID"
                            placeholder="Room ID"
                            maxLength={ROOM_ID_MAX}
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            invalid={roomId.length > 0 && !valid}
                        />
                        <Button type="submit" disabled={!valid} size="lg">
                            Join
                        </Button>
                    </form>
                    <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        or
                        <span className="h-px flex-1 bg-border" />
                    </div>
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => enter(crypto.randomUUID().slice(0, 8))}
                    >
                        Deal a new table
                    </Button>
                </Panel>
            </main>
        </div>
    );
};
