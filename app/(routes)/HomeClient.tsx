"use client";
import { useSetAtom } from "jotai/index";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEventHandler, useState } from "react";
import EditNameDialog from "@/app/_components/features/room/EditNameDialog";
import ThemeSelector from "@/app/_components/features/voting/ThemeSelector";
import { Button } from "@/app/_components/ui/base/Button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/base/Card";
import { Input } from "@/app/_components/ui/base/Input";
import Header from "@/app/_components/ui/layout/Header";
import HeaderItem from "@/app/_components/ui/layout/HeaderItem";
import HorizontalLine from "@/app/_components/ui/layout/HorizontalLine";
import { userNameAtom } from "@/app/_lib/atoms";
import { useSyncUserName } from "@/app/_lib/useSyncUserName";
import { createClient } from "@/utils/supabase/client";

const HomeClient = () => {
    const { push } = useRouter();
    const [roomId, setRoomId] = useState<string>("");
    const setUserName = useSetAtom(userNameAtom);
    useSyncUserName();

    const isValid = () =>
        !!roomId && !/\s/.test(roomId) && !roomId.includes("/");

    const enter = (roomId: string) => push(`/rooms/${roomId}`);

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.key === "Enter" && isValid()) {
            enter(roomId);
        }
    };

    const supabase = createClient();

    return (
        <>
            <div className="absolute w-full">
                <Header>
                    <HeaderItem className="h-full p-2">
                        <EditNameDialog
                            onSubmit={async (candidate: string) => {
                                await supabase.auth.updateUser({
                                    data: { display_name: candidate },
                                });
                                setUserName(candidate);
                            }}
                        />
                    </HeaderItem>
                    <HeaderItem>
                        <ThemeSelector />
                    </HeaderItem>
                </Header>
            </div>
            <div className="h-screen bg-background flex flex-col items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Join room
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-flow-col gap-4">
                            <Input
                                maxLength={12}
                                className="h-12 border-zinc-200"
                                type="text"
                                placeholder="Room ID"
                                onChange={(event) =>
                                    setRoomId(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                size="icon"
                                disabled={!isValid()}
                                onClick={() => enter(roomId)}
                                className="size-12"
                            >
                                <Check size={20} strokeWidth={4} />
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <HorizontalLine innerText="or" />
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() =>
                                enter(
                                    globalThis.crypto
                                        .randomUUID()
                                        .substring(0, 8),
                                )
                            }
                            className="w-full"
                            size="xlg"
                        >
                            Create new room
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};
export default HomeClient;
