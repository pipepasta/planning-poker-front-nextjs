"use client";
import { useActionState } from "react";
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
import { loginAnonymously } from "@/app/(routes)/login/action";

const LoginClient = () => {
    const [state, formAction, pending] = useActionState(loginAnonymously, {
        message: "",
    });

    return (
        <>
            <div className="absolute w-full">
                <Header>
                    <HeaderItem>
                        <ThemeSelector />
                    </HeaderItem>
                </Header>
            </div>
            <div className="h-screen bg-background flex justify-center items-center">
                <Card className="w-2/3 max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            Sign In
                        </CardTitle>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent>
                            <label
                                className="m-1 text-xs text-left w-full"
                                htmlFor="nickname"
                            >
                                Nickname
                            </label>
                            <Input
                                maxLength={24}
                                className="full text-xs h-10 py-2 px-4"
                                type="text"
                                name="nickname"
                                id="nickname"
                                placeholder="John Doe"
                                required={true}
                            />
                            {state.message && (
                                <p className="text-destructive text-xs mt-2">
                                    {state.message}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                size="xlg"
                                className="w-full"
                                disabled={pending}
                            >
                                Sign in
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default LoginClient;
