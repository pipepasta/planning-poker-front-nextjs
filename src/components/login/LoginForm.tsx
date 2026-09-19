"use client";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInAnonymously } from "@/app/login/actions";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Panel } from "@/src/components/ui/Panel";
import { NICKNAME_MAX } from "@/src/lib/auth";

export const LoginForm = () => {
    const [state, action, pending] = useActionState(signInAnonymously, {
        message: "",
    });
    const next = useSearchParams().get("next");
    return (
        <Panel className="w-full max-w-sm p-5 sm:p-6">
            {/* The bar above already says the name, so the card says what to
                do here instead of repeating it. */}
            <h1 className="mb-1 text-center text-2xl font-semibold">
                Pull up a chair
            </h1>
            <p className="mb-5 text-center text-sm text-muted-foreground">
                Pick a nickname and join the table.
            </p>
            <form action={action} className="flex flex-col gap-2">
                {next && <input type="hidden" name="next" value={next} />}
                <label htmlFor="nickname" className="text-sm font-medium">
                    Nickname
                </label>
                <Input
                    id="nickname"
                    name="nickname"
                    maxLength={NICKNAME_MAX}
                    placeholder="Ravioli"
                    required
                    autoFocus
                    invalid={!!state.message}
                />
                {state.message && (
                    <p role="alert" className="text-sm text-destructive">
                        {state.message}
                    </p>
                )}
                <Button
                    type="submit"
                    size="lg"
                    disabled={pending}
                    className="mt-3 w-full"
                >
                    Join the table
                </Button>
            </form>
        </Panel>
    );
};
